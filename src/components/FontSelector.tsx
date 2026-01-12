import { cn } from "@/lib/utils";
import { Check, Type } from "lucide-react";

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  className: string;
  preview: string;
}

export const fontOptions: FontOption[] = [
  { id: "great-vibes", name: "Great Vibes", fontFamily: "Great Vibes", className: "font-script", preview: "Love" },
  { id: "dancing-script", name: "Dancing Script", fontFamily: "Dancing Script", className: "font-dancing", preview: "Love" },
  { id: "parisienne", name: "Parisienne", fontFamily: "Parisienne", className: "font-parisienne", preview: "Love" },
  { id: "sacramento", name: "Sacramento", fontFamily: "Sacramento", className: "font-sacramento", preview: "Love" },
  { id: "allura", name: "Allura", fontFamily: "Allura", className: "font-allura", preview: "Love" },
  { id: "alex-brush", name: "Alex Brush", fontFamily: "Alex Brush", className: "font-alex-brush", preview: "Love" },
  { id: "tangerine", name: "Tangerine", fontFamily: "Tangerine", className: "font-tangerine", preview: "Love" },
  { id: "pinyon-script", name: "Pinyon Script", fontFamily: "Pinyon Script", className: "font-pinyon", preview: "Love" },
];

export const serifFontOptions: FontOption[] = [
  { id: "cormorant", name: "Cormorant", fontFamily: "Cormorant Garamond", className: "font-serif", preview: "María & Juan" },
  { id: "playfair", name: "Playfair", fontFamily: "Playfair Display", className: "font-playfair", preview: "María & Juan" },
];

interface FontSelectorProps {
  selectedFont: FontOption;
  onFontChange: (font: FontOption) => void;
  label?: string;
  fonts?: FontOption[];
}

const FontSelector = ({ 
  selectedFont, 
  onFontChange, 
  label = "Fuente romántica",
  fonts = fontOptions
}: FontSelectorProps) => {
  return (
    <div>
      <label className="font-sans text-xs font-medium text-[#6B6B6B] mb-3 flex items-center gap-1.5">
        <Type className="w-3.5 h-3.5" /> {label}
      </label>
      <div className="flex flex-wrap gap-2 justify-center">
        {fonts.map((font) => (
          <button
            key={font.id}
            onClick={() => onFontChange(font)}
            className={cn(
              "relative px-3 py-2 rounded-lg border-2 transition-all duration-200 min-w-[80px]",
              selectedFont.id === font.id
                ? "border-[#1C1C1C] bg-[#FAF9F7] shadow-sm"
                : "border-[#E8E6E3] bg-white hover:border-[#D0CDCA]"
            )}
          >
            <span 
              className={cn("text-lg text-[#1C1C1C] block", font.className)}
              style={{ fontFamily: font.fontFamily }}
            >
              {font.preview}
            </span>
            <span className="text-[8px] text-[#6B6B6B] block mt-0.5 font-sans">
              {font.name}
            </span>
            {selectedFont.id === font.id && (
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

export default FontSelector;
