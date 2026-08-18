import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileSidebar } from "@/features/profile/ProfileSidebar";
import { PersonalInfoForm } from "@/features/profile/PersonalInfoForm";

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f1f3f6]">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1250px] mx-auto px-4 md:px-6 pt-[100px] pb-12 flex flex-col md:flex-row gap-4 items-start">
        
        {/* Left Sidebar */}
        <ProfileSidebar />

        {/* Main Content */}
        <PersonalInfoForm />
        
      </div>
    </main>
  );
}
