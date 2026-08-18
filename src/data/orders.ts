export type OrderStatus = "Delivered" | "Out for Delivery" | "Cancelled" | "Upcoming";

export interface Order {
  id: string;
  items: string;
  date: string;
  image: string;
  deliveryAddress: string;
  status: OrderStatus;
  statusTime: string;
  totalAmount: number;
}

// Generate 12 mock orders for pagination testing
export const mockOrders: Order[] = [
  {
    id: "CR12345678",
    items: "ICE-CREAM",
    date: "28 May 2024, 05:30 PM",
    image: "/images/image 5.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Delivered",
    statusTime: "21 May 2024, 11:45 AM",
    totalAmount: 848.00
  },
  {
    id: "CR12345677",
    items: "ICE-CREAM",
    date: "15 May 2024, 08:15 PM",
    image: "/images/image 5.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Out for Delivery",
    statusTime: "21 May 2024, 07:00 PM",
    totalAmount: 1070.00
  },
  {
    id: "CR12345676",
    items: "ICE-CREAM",
    date: "10 May 2024, 02:00 PM",
    image: "/images/image 5.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Delivered",
    statusTime: "11 May 2024, 10:00 AM",
    totalAmount: 450.00
  },
  {
    id: "CR12345675",
    items: "ICE-CREAM CAKE",
    date: "05 May 2024, 09:30 AM",
    image: "/images/image 8.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Cancelled",
    statusTime: "05 May 2024, 10:00 AM",
    totalAmount: 1250.00
  },
  {
    id: "CR12345674",
    items: "ICE-CREAM",
    date: "01 May 2024, 04:20 PM",
    image: "/images/image 6.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Delivered",
    statusTime: "02 May 2024, 12:30 PM",
    totalAmount: 848.00
  },
  {
    id: "CR12345673",
    items: "PREMIUM SCOOPS",
    date: "25 Apr 2024, 06:15 PM",
    image: "/images/paleta-strawberry.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Upcoming",
    statusTime: "Estimated Delivery: 29 May 2024",
    totalAmount: 350.00
  },
  {
    id: "CR12345672",
    items: "ICE-CREAM",
    date: "20 Apr 2024, 11:10 AM",
    image: "/images/image 5.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Delivered",
    statusTime: "21 Apr 2024, 02:45 PM",
    totalAmount: 900.00
  },
  {
    id: "CR12345671",
    items: "ICE-CREAM CAKE",
    date: "15 Apr 2024, 01:00 PM",
    image: "/images/image 9.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Delivered",
    statusTime: "16 Apr 2024, 11:00 AM",
    totalAmount: 1400.00
  },
  {
    id: "CR12345670",
    items: "SUNDAE",
    date: "10 Apr 2024, 07:45 PM",
    image: "/images/sundae-deliciousness.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Cancelled",
    statusTime: "10 Apr 2024, 08:00 PM",
    totalAmount: 250.00
  },
  {
    id: "CR12345669",
    items: "ICE-CREAM",
    date: "05 Apr 2024, 03:20 PM",
    image: "/images/image 7.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Delivered",
    statusTime: "06 Apr 2024, 01:15 PM",
    totalAmount: 650.00
  },
  {
    id: "CR12345668",
    items: "PARTY PACK",
    date: "01 Apr 2024, 09:00 AM",
    image: "/images/image 6.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Delivered",
    statusTime: "02 Apr 2024, 10:30 AM",
    totalAmount: 2400.00
  },
  {
    id: "CR12345667",
    items: "ICE-CREAM",
    date: "25 Mar 2024, 05:50 PM",
    image: "/images/image 5.png",
    deliveryAddress: "Venkatesh S\n12-3-45, Main Road, Banjara Hills, Hyderabad,\nTelangana - 500034",
    status: "Delivered",
    statusTime: "26 Mar 2024, 11:20 AM",
    totalAmount: 848.00
  }
];
