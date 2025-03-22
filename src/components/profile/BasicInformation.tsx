
import React from "react";
import { Camera, Upload, User } from "lucide-react";
import Button from "../Button";
import { cn } from "@/lib/utils";
import { ProfileFormData } from "./types";

interface BasicInformationProps {
  formData: ProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const BasicInformation = ({
  formData,
  handleChange,
  handleUploadClick,
  fileInputRef,
  handleFileChange,
  isUploading
}: BasicInformationProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6 neon-text">Basic Information</h2>
      
      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group cursor-pointer mb-4" onClick={handleUploadClick}>
          <div className={cn(
            "h-32 w-32 rounded-full overflow-hidden border-2 border-primary/40 shadow-lg transition-all duration-300",
            isUploading && "opacity-60"
          )}>
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-secondary flex items-center justify-center">
                <User className="h-16 w-16 text-secondary-foreground/60" />
              </div>
            )}
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <Camera className="h-8 w-8 text-white" />
          </div>
          
          {/* Loading indicator */}
          {isUploading && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center"
        >
          <Upload className="h-4 w-4 mr-1" />
          {formData.avatar ? "Change Picture" : "Upload Picture"}
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium">
            Role / Title
          </label>
          <input
            id="role"
            name="role"
            type="text"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            placeholder="Frontend Developer"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            placeholder="Tell us about yourself, your experience, and what you're passionate about..."
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            placeholder="john@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="github" className="block text-sm font-medium">
            GitHub (optional)
          </label>
          <input
            id="github"
            name="github"
            type="url"
            value={formData.github}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            placeholder="https://github.com/username"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="linkedin" className="block text-sm font-medium">
            LinkedIn (optional)
          </label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="website" className="block text-sm font-medium">
            Personal Website (optional)
          </label>
          <input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
