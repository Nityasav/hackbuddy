
import React from "react";
import { Plus } from "lucide-react";
import Button from "../Button";
import SkillCard, { Skill } from "../SkillCard";
import { skillCategories, skillLevels } from "./types";

interface SkillsSectionProps {
  skills: Skill[];
  newSkill: {
    name: string;
    category: string;
    level: string;
  };
  setNewSkill: React.Dispatch<React.SetStateAction<{
    name: string;
    category: string;
    level: string;
  }>>;
  handleAddSkill: () => void;
  handleRemoveSkill: (id: string) => void;
}

const SkillsSection = ({
  skills,
  newSkill,
  setNewSkill,
  handleAddSkill,
  handleRemoveSkill
}: SkillsSectionProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 neon-text">Skills</h2>
      
      {/* Current Skills */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground/70 mb-3">Your Skills</h3>
        
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
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
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
  );
};

export default SkillsSection;
