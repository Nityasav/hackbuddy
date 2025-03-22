
import React from "react";
import { Plus, X } from "lucide-react";
import Button from "../Button";

interface LookingForSectionProps {
  lookingFor: string[];
  newLookingFor: string;
  setNewLookingFor: React.Dispatch<React.SetStateAction<string>>;
  handleAddLookingFor: () => void;
  handleRemoveLookingFor: (index: number) => void;
}

const LookingForSection = ({
  lookingFor,
  newLookingFor,
  setNewLookingFor,
  handleAddLookingFor,
  handleRemoveLookingFor
}: LookingForSectionProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 neon-text">What You're Looking For</h2>
      
      {/* Current Looking For */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground/70 mb-3">You're Looking For</h3>
        
        {lookingFor.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {lookingFor.map((item, index) => (
              <div 
                key={index}
                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm font-medium transition-all bg-secondary text-secondary-foreground hover-scale"
              >
                {item}
                <button 
                  type="button"
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
            className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
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
  );
};

export default LookingForSection;
