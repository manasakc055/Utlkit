"use client";

import { LucideIcon } from "lucide-react";

type Tool = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type ToolCardProps = {
  tool: Tool;
  setActiveTool: (id: string) => void;
};

export default function ToolCard({
  tool,
  setActiveTool,
}: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <div
      onClick={() => setActiveTool(tool.id)}
      className="
        border border-gray-800
        bg-gray-900
        p-6
        rounded-2xl
        cursor-pointer
        hover:border-blue-500
        hover:bg-gray-800
        hover:shadow-lg
        hover:shadow-blue-500/10
        active:scale-95
        transition-all
        duration-300
        group
      "
    >
      <Icon
        size={32}
        className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300"
      />

      <h3 className="text-lg font-semibold mb-2 text-white">
        {tool.title}
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed">
        {tool.description}
      </p>
    </div>
  );
}