
import { useState } from "react";
import Button from "./Button";
import { Plus, Save, Trash, X } from "lucide-react";
import { Skill } from "./SkillCard";
import SkillCard from "./SkillCard";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  onSave: (profileData: ProfileFormData) => void;
  initialData?: ProfileFormData;
  className?: string;
}

export interface ProfileFormData {
  name: string;
  role: string;
  bio: string;
  email: string;
  github?: string;
  linkedin?: string;
  skills: Skill[];
  lookingFor: string[];
}

const skillCategories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
  { value: "data", label: "Data Science" },
  { value: "mobile", label: "Mobile" },
  { value: "other", label: "Other" }
];

const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

const defaultSkills: Skill[] = [];

const ProfileForm = ({ onSave, initialData, className }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData || {
    name: "",
    role: "",
    bio: "",
    email: "",
    github: "",
    linkedin: "",
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would validate the data here
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
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        
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
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              placeholder="https://github.com/username"
            />
          </div>
        </div>
      </div>
      
      {/* Skills */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        
        {/* Current Skills */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground/70 mb-3">Your Skills</h3>
          
          {formData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  removable
                  onRemove={handleRemoveSkill}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/60 mb-4">
              No skills added yet. Use the form below to add your skills.
            </p>
          )}
        </div>
        
        {/* Add New Skill */}
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="skillName" className="block text-sm font-medium">
              Skill Name
            </label>
            <input
              id="skillName"
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              placeholder="React, UI Design, Python, etc."
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="skillCategory" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="skillCategory"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            >
              {skillCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="skillLevel" className="block text-sm font-medium">
              Level
            </label>
            <select
              id="skillLevel"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            >
              {skillLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSkill}
              disabled={!newSkill.name.trim()}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Skill
            </Button>
          </div>
        </div>
      </div>
      
      {/* Looking For */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">What You're Looking For</h2>
        
        {/* Current Looking For */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground/70 mb-3">You're Looking For</h3>
          
          {formData.lookingFor.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.lookingFor.map((item, index) => (
                <div 
                  key={index}
                  className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all bg-secondary text-secondary-foreground hover-scale"
                >
                  {item}
                  <button 
                    onClick={() => handleRemoveLookingFor(index)}
                    className="ml-1 text-foreground/40 hover:text-foreground/70 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/60 mb-4">
              No preferences added yet. Use the form below to add what you're looking for in teammates.
            </p>
          )}
        </div>
        
        {/* Add New Looking For */}
        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-1">
            <label htmlFor="lookingFor" className="block text-sm font-medium">
              Add Preference
            </label>
            <input
              id="lookingFor"
              type="text"
              value={newLookingFor}
              onChange={(e) => setNewLookingFor(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              placeholder="UI Designer, Backend Developer, etc."
            />
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleAddLookingFor}
            disabled={!newLookingFor.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
      
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
