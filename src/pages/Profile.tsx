
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileForm, { ProfileFormData } from "@/components/ProfileForm";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, isLoading, updateUser } = useUser();
  const [formData, setFormData] = useState<ProfileFormData | undefined>(undefined);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        role: user.role,
        bio: user.bio,
        email: user.email,
        github: user.github || "",
        linkedin: user.linkedin || "",
        skills: user.skills,
        lookingFor: user.lookingFor
      });
    }
  }, [user]);
  
  const handleSaveProfile = async (data: ProfileFormData) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user context
      updateUser({
        name: data.name,
        role: data.role,
        bio: data.bio,
        email: data.email,
        github: data.github,
        linkedin: data.linkedin,
        skills: data.skills,
        lookingFor: data.lookingFor
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Your Profile</h1>
            <p className="text-foreground/70">
              Keep your profile up to date to get the best matches
            </p>
          </div>
          
          {formData ? (
            <ProfileForm
              initialData={formData}
              onSave={handleSaveProfile}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/70">
                Profile data could not be loaded. Please try again later.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
