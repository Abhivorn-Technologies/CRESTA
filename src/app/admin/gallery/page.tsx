import { AdminGalleryClient } from "./AdminGalleryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery Media Manager | Cresta Global Admin",
  description: "Admin interface to manage public gallery photos and videos"
};

export default function AdminGalleryPage() {
  return <AdminGalleryClient />;
}

