
import { useState, useEffect, useRef } from "react";
import { Save } from "lucide-react";
import Button from "../Button";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import BasicInformation from "./BasicInformation";
import SkillsSection from "./SkillsSection";
import LookingForSection from "./LookingForSection";
import { ProfileFormProps, ProfileFormData, defaultSkills } from "./types";
import { Skill } from "../SkillCard";

const ProfileForm = ({ onSave, initialData, className }: ProfileFormProps) => {
  const { uploadAvatar } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>(initialData || {
    name: "",
    role: "",
    bio: "",
    email: "",
    github: "",
    linkedin: "",
    website: "",
    avatar: "",
    skills: defaultSkills,
    lookingFor: []
  });
  
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "frontend",
    level: "intermediate",
  });
  
  const [newLookingFor, setNewLookingFor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Add a new skill
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      category: newSkill.category as Skill["category"],
      level: newSkill.level as Skill["level"]
    };
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    
    // Reset new skill form
    setNewSkill({
      name: "",
      category: "frontend",
      level: "intermediate",
    });
  };
  
  // Remove a skill
  const handleRemoveSkill = (id: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };
  
  // Add looking for
  const handleAddLookingFor = () => {
    if (!newLookingFor.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      lookingFor: [...prev.lookingFor, newLookingFor]
    }));
    
    setNewLookingFor("");
  };
  
  // Remove looking for
  const handleRemoveLookingFor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.filter((_, i) => i !== index)
    }));
  };
  
  // Handle avatar upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle avatar file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const avatarUrl = await uploadAvatar(file);
      
      setFormData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
      
      toast.success("Profile picture uploaded");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
      {/* Basic Information */}
      <BasicInformation 
        formData={formData}
        handleChange={handleChange}
        handleUploadClick={handleUploadClick}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        isUploading={isUploading}
      />
      
      {/* Skills */}
      <SkillsSection 
        skills={formData.skills}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        handleAddSkill={handleAddSkill}
        handleRemoveSkill={handleRemoveSkill}
      />
      
      {/* Looking For */}
      <LookingForSection 
        lookingFor={formData.lookingFor}
        newLookingFor={newLookingFor}
        setNewLookingFor={setNewLookingFor}
        handleAddLookingFor={handleAddLookingFor}
        handleRemoveLookingFor={handleRemoveLookingFor}
      />
      
      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          <Save className="h-4 w-4 mr-1" />
          Save Profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
