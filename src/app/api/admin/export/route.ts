import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "orders"; // Can export different things

    await connectToDatabase();

    if (type === "orders") {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();

      // Define CSV Headers
      const headers = [
        "Order ID",
        "Date",
        "Customer Name",
        "Customer Email",
        "Phone",
        "Address",
        "City",
        "Total Amount",
        "Payment Status",
        "Order Status",
        "Items Count"
      ];

      // Format data into CSV rows
      const rows = orders.map((o: any) => {
        const date = new Date(o.createdAt).toLocaleString();
        const customerName = o.shippingAddress?.firstName ? `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}` : "Guest";
        const email = o.shippingAddress?.email || "N/A";
        const phone = o.shippingAddress?.phone || "N/A";
        const address = `"${o.shippingAddress?.address || ""}"`; // wrap in quotes to handle commas
        const city = o.shippingAddress?.city || "";
        const amount = o.totalAmount;
        const paymentStatus = o.paymentStatus;
        const orderStatus = o.orderStatus;
        const itemsCount = o.items ? o.items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;

        return [
          o._id.toString(),
          `"${date}"`,
          `"${customerName}"`,
          `"${email}"`,
          `"${phone}"`,
          address,
          `"${city}"`,
          amount,
          paymentStatus,
          orderStatus,
          itemsCount
        ].join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="Cresta_Orders_Report_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (type === "dashboard") {
      const [orders, totalUsers, activeOrdersCount] = await Promise.all([
        Order.find().lean(),
        import("@/models/User").then(m => m.default.countDocuments()),
        Order.countDocuments({ orderStatus: { $in: ["processing", "shipped", "pending"] } })
      ]);

      const calculateSales = (ordersList: any[]) => ordersList.filter(o => o.orderStatus !== "cancelled").reduce((sum, o) => sum + o.totalAmount, 0);
      const calculateRefunds = (ordersList: any[]) => ordersList.filter(o => o.orderStatus === "cancelled" && o.cancellationInfo?.refundAmount).reduce((sum, o) => sum + o.cancellationInfo.refundAmount, 0);
      const calculateCount = (ordersList: any[]) => ordersList.filter(o => o.orderStatus !== "cancelled").length;

      const currentSales = calculateSales(orders);
      const currentOrderCount = calculateCount(orders);
      const currentRefunds = calculateRefunds(orders);

      const headers = ["Metric", "Value"];
      const rows = [
        `"Total Sales",${currentSales}`,
        `"Total Orders",${currentOrderCount}`,
        `"Average Order Value",${currentOrderCount > 0 ? (currentSales / currentOrderCount).toFixed(2) : 0}`,
        `"Total Customers",${totalUsers}`,
        `"Active Orders",${activeOrdersCount}`,
        `"Total Refund Amount",${currentRefunds}`
      ];

      const csvContent = [headers.join(","), ...rows].join("\n");

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="Cresta_Dashboard_Summary_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });

  } catch (error) {
    console.error("Export API Error:", error);
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }
}
