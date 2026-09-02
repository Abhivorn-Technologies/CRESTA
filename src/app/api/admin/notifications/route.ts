import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import Order from '@/models/Order';
import { Setting } from '@/models/Setting';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch physical notifications
    const physicalNotifications = await Notification.find().sort({ createdAt: -1 }).lean();
    
    // Fetch recent orders
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = await Order.find({ updatedAt: { $gte: thirtyDaysAgo } }).sort({ updatedAt: -1 }).limit(50).lean();
    
    // Fetch last read time
    const setting = await Setting.findOne();
    const lastReadAt = setting?.notifications?.lastReadAt || new Date(0);

    const dynamicNotifications = [];

    for (const order of recentOrders) {
      const shortId = order._id.toString().substring(0, 8).toUpperCase();
      const isUnread = new Date(order.updatedAt) > new Date(lastReadAt);

      if (order.orderStatus === 'order_placed') {
        dynamicNotifications.push({
          _id: `${order._id}_placed`,
          type: 'order',
          title: 'New Order Received',
          description: `Order #${shortId} has been placed for ₹${order.totalAmount}.`,
          unread: isUnread,
          createdAt: order.createdAt
        });
      } else if (order.orderStatus === 'delivered') {
        dynamicNotifications.push({
          _id: `${order._id}_delivered`,
          type: 'order',
          title: 'Order Delivered',
          description: `Order #${shortId} has been successfully delivered to the customer.`,
          unread: isUnread,
          createdAt: order.updatedAt
        });
      } else if (order.orderStatus === 'cancelled') {
        // Only generate this if not already caught by a physical notification
        // (Physical notifications are generated in the PATCH endpoint for cancellation)
        const hasPhysical = physicalNotifications.some(n => n.description?.includes(shortId) && n.title === 'Order Cancelled');
        if (!hasPhysical) {
          dynamicNotifications.push({
            _id: `${order._id}_cancelled`,
            type: 'inventory',
            title: 'Order Cancelled',
            description: `Order #${shortId} was cancelled.`,
            unread: isUnread,
            createdAt: order.updatedAt
          });
        }
      } else if (order.orderStatus === 'refunded') {
        dynamicNotifications.push({
          _id: `${order._id}_refunded`,
          type: 'payment',
          title: 'Refund Processed',
          description: `Refund for Order #${shortId} has been successfully processed.`,
          unread: isUnread,
          createdAt: order.updatedAt
        });
      }
    }

    // Combine and sort
    const allNotifications = [...physicalNotifications, ...dynamicNotifications]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);

    return NextResponse.json(allNotifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// Mark all as read
export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    
    // Mark physical notifications as read
    await Notification.updateMany({ unread: true }, { unread: false });
    
    // Update lastReadAt for dynamic notifications
    const setting = await Setting.findOne();
    if (setting) {
      if (!setting.notifications) setting.notifications = {};
      setting.notifications.lastReadAt = new Date();
      await setting.save();
    } else {
      await Setting.create({
        notifications: {
          orderAlerts: true,
          stockAlerts: true,
          newsletterSubscribers: false,
          lastReadAt: new Date(),
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to mark notifications as read:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
