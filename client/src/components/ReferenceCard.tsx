import { Play, BookOpen, ExternalLink } from "lucide-react";
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

export default function ReferenceCard({ reference, persona }: ReferenceCardProps) {
  const Icon = reference.type === "post" ? BookOpen : Play;

  return (
    <a href={reference.url} target="_blank" rel="noopener noreferrer" className="reference-card">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${persona.accent}1A`, color: persona.accent }}
      >
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium">{reference.title}</div>
        <div className="mt-0.5 text-[10px] text-neutral-400">
          {PLATFORM_LABEL[reference.platform]} · {reference.free ? "Free" : "Paid"}
        </div>
      </div>
      <ExternalLink size={13} className="shrink-0 text-neutral-300" />
    </a>
  );
}
