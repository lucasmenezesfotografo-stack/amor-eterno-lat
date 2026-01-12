import { cn } from "@/lib/utils";
import { Check, MoveVertical } from "lucide-react";

export type NamePosition = "top" | "center" | "bottom";

interface PositionOption {
  id: NamePosition;
  name: string;
  icon: React.ReactNode;
}

const positionOptions: PositionOption[] = [
  { id: "top", name: "Arriba", icon: <div className="w-full flex flex-col items-center"><div className="w-4 h-0.5 bg-current mb-1" /><div className="w-6 h-3 bg-current/20 rounded" /></div> },
  { id: "center", name: "Centro", icon: <div className="w-full flex flex-col items-center"><div className="w-6 h-1.5 bg-current/20 rounded mb-1" /><div className="w-4 h-0.5 bg-current" /><div className="w-6 h-1.5 bg-current/20 rounded mt-1" /></div> },
  { id: "bottom", name: "Abajo", icon: <div className="w-full flex flex-col items-center"><div className="w-6 h-3 bg-current/20 rounded" /><div className="w-4 h-0.5 bg-current mt-1" /></div> },
];

interface NamePositionSelectorProps {
  selectedPosition: NamePosition;
  onPositionChange: (position: NamePosition) => void;
}

const NamePositionSelector = ({ selectedPosition, onPositionChange }: NamePositionSelectorProps) => {
  return (
    <div>
      <label className="font-sans text-xs font-medium text-[#6B6B6B] mb-3 flex items-center gap-1.5">
        <MoveVertical className="w-3.5 h-3.5" /> Posición de los nombres
      </label>
      <div className="flex justify-center gap-3">
        {positionOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onPositionChange(option.id)}
            className={cn(
              "relative flex flex-col items-center justify-center w-20 h-16 rounded-lg border-2 transition-all duration-200",
              selectedPosition === option.id
                ? "border-[#1C1C1C] bg-[#FAF9F7] text-[#1C1C1C]"
                : "border-[#E8E6E3] bg-white text-[#6B6B6B] hover:border-[#D0CDCA]"
            )}
          >
            <div className="h-8 flex items-center justify-center text-[#1C1C1C]">
              {option.icon}
            </div>
            <span className="text-[9px] font-sans mt-1">{option.name}</span>
            {selectedPosition === option.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#1C1C1C] rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NamePositionSelector;
