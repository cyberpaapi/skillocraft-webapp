import React from "react";
import { Input } from "@/components/ui/input";

export const InputWithIcon: React.FC<InputWithIconProps> = ({
  icon,
  iconPosition = "left",
  ...props
}) => (
  <div className="w-full relative">
    {iconPosition === "left" && (
      <span className="absolute inset-y-0 start-2 flex items-center text-gray-400">
        {icon}
      </span>
    )}
    <Input
      className={`w-full ${iconPosition === "left" ? "ps-8" : "pe-8"}`}
      {...props}
    />
    {iconPosition === "right" && (
      <span className="absolute inset-y-0 end-2 flex items-center text-gray-400">
        {icon}
      </span>
    )}
  </div>
);

type InputWithIconProps = {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
} & React.InputHTMLAttributes<HTMLInputElement>;
