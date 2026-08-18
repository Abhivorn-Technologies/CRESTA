"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Check, X } from "lucide-react";

export function PersonalInfoForm() {
  const { user, setUser } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showSuccessModal]);

  // Split name into first/last for the UI (basic split)
  const nameParts = user?.name ? user.name.split(" ") : ["", ""];
  const initialFirstName = nameParts[0];
  const initialLastName = nameParts.slice(1).join(" ");

  // Form states
  const [firstName, setFirstName] = useState(initialFirstName || "");
  const [lastName, setLastName] = useState(initialLastName || "");
  const [gender, setGender] = useState("Female");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState("+917036592351");

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      const parts = user.name ? user.name.split(" ") : ["", ""];
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const newName = `${firstName} ${lastName}`.trim();
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email }),
      });
      
      if (res.ok) {
        if (user) {
          setUser({
            ...user,
            name: newName,
            email: email
          });
        }
        setShowSuccessModal(true);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-white rounded shadow-sm border border-gray-100 flex flex-col relative overflow-hidden pb-[150px]">
      <form onSubmit={handleSave} className="p-8 flex flex-col gap-10">
        
        {/* Personal Information Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-[#101b4d]">Personal Information</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-[550px]">
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="flex-1 p-3 rounded border border-gray-300 bg-white focus:outline-none focus:border-[#2874f0] text-sm font-medium transition-colors"
              placeholder="First Name"
            />
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="flex-1 p-3 rounded border border-gray-300 bg-white focus:outline-none focus:border-[#2874f0] text-sm font-medium transition-colors"
              placeholder="Last Name"
            />
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <span className="text-sm text-[#101b4d] font-medium">Your Gender</span>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender" 
                  value="Male" 
                  checked={gender === "Male"}
                  onChange={() => setGender("Male")}
                  className="w-4 h-4 text-[#2874f0] border-gray-300 focus:ring-[#2874f0]"
                />
                <span className={`text-sm ${gender === 'Male' ? 'text-gray-900' : 'text-gray-500'}`}>Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="gender" 
                  value="Female" 
                  checked={gender === "Female"}
                  onChange={() => setGender("Female")}
                  className="w-4 h-4 text-[#2874f0] border-gray-300 focus:ring-[#2874f0]"
                />
                <span className={`text-sm ${gender === 'Female' ? 'text-gray-900' : 'text-gray-500'}`}>Female</span>
              </label>
            </div>
          </div>
        </section>

        {/* Email Address Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-[#101b4d]">Email Address</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-[400px]">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 p-3 rounded border border-gray-300 bg-white focus:outline-none focus:border-[#2874f0] text-sm font-medium transition-colors"
            />
          </div>
        </section>

        {/* Mobile Number Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-[#101b4d]">Mobile Number</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-[400px]">
            <input 
              type="text" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="flex-1 p-3 rounded border border-gray-300 bg-white focus:outline-none focus:border-[#2874f0] text-sm font-medium transition-colors"
            />
          </div>
        </section>
        
        {/* Save Button */}
        <div className="mt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-10 py-3.5 bg-[#2874f0] text-white text-sm font-bold rounded shadow hover:bg-[#1a5bc3] transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* FAQs */}
        <section className="flex flex-col gap-4 mt-8 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-bold text-[#101b4d]">FAQs</h2>
          <div className="flex flex-col gap-6 text-[13px] text-gray-600">
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-[#101b4d]">What happens when I update my email address (or mobile number)?</h4>
              <p className="leading-relaxed">Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-[#101b4d]">When will my Cresta account be updated with the new email address (or mobile number)?</h4>
              <p className="leading-relaxed">It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-[#101b4d]">What happens to my existing Cresta account when I update my email address (or mobile number)?</h4>
              <p className="leading-relaxed">Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-[#101b4d]">Does my Seller account get affected when I update my email address?</h4>
              <p className="leading-relaxed">Cresta has a 'single sign-on' policy. Any changes will reflect in your Seller account also.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-[#101b4d]">How is my personal information protected?</h4>
              <p className="leading-relaxed">Your data is fully encrypted and securely stored. We never share your personal details or contact information with third parties.</p>
            </div>
          </div>
        </section>



      </form>

      {/* Bottom Graphic (Abstract representation of Flipkart's footer graphic) */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-yellow-300 via-yellow-100/50 to-transparent flex items-end pointer-events-none">
        <div className="w-full h-[60px] bg-[url('https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myProfileFooter_4e9fe2.png')] bg-repeat-x bg-bottom opacity-80" />
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-[101] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="size-5" />
            </button>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100">
              <Check className="size-8 text-[#26a541]" />
            </div>
            <h3 className="text-xl font-bold text-[#101b4d] mb-2">Profile Updated!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your personal information has been saved successfully.
            </p>
            
            <button 
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-4 py-3 rounded-xl bg-[#2874f0] text-white font-bold text-sm hover:bg-[#1a5bc3] transition-colors flex items-center justify-center"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
