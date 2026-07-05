import { ExternalLink } from "lucide-react";
import type { ReferenceItem, Persona } from "@/types/chat";

interface ReferenceCardProps {
  reference: ReferenceItem;
  persona: Persona;
}

const PLATFORM_LABEL: Record<ReferenceItem["platform"], string> = {
  youtube: "YouTube",
  cohort: "Cohort",
  udemy: "Udemy",
  website: "Website",
  social: "Social",
  github: "GitHub",
};

function ReferenceCard({ reference }: ReferenceCardProps) {
  return (
    <a href={reference.url} target="_blank" rel="noopener noreferrer" className="reference-card">
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium">{reference.title}</div>
        <div className="text-muted mt-0.5 text-[10px]">
          {PLATFORM_LABEL[reference.platform]} · {reference.free ? "Free" : "Paid"}
        </div>
      </div>
      <ExternalLink size={18} className="text-muted shrink-0" />
    </a>
  );
}

export default ReferenceCard;
