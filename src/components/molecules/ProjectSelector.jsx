import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";

const ProjectSelector = ({
  projects,
  value,
  onChange,
  className,
  error,
  required = false,
  placeholder = "Select a project...",
  ...props
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      <Label>
        Project
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={value}
        onChange={onChange}
        error={!!error}
        {...props}
      >
        <option value="">{placeholder}</option>
        {projects.map(project => (
          <option key={project.Id} value={project.Id.toString()}>
            {project.name}
          </option>
        ))}
      </Select>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ProjectSelector;