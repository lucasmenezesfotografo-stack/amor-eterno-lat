import * as React from "react";
import { format, setMonth, setYear, getMonth, getYear } from "date-fns";
import { es, enUS, ptBR, it } from "date-fns/locale";
import type { Locale } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";

interface DatePickerWithYearMonthProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  fromYear?: number;
  toYear?: number;
}

const LOCALES: Record<string, Locale> = {
  es,
  en: enUS,
  pt: ptBR,
  it,
};

const MONTH_LABEL: Record<string, string> = {
  es: "Mes",
  en: "Month",
  pt: "Mês",
  it: "Mese",
};

const YEAR_LABEL: Record<string, string> = {
  es: "Año",
  en: "Year",
  pt: "Ano",
  it: "Anno",
};

const DATE_FORMAT: Record<string, string> = {
  es: "EEEE, d 'de' MMMM 'de' yyyy",
  en: "EEEE, MMMM d, yyyy",
  pt: "EEEE, d 'de' MMMM 'de' yyyy",
  it: "EEEE, d MMMM yyyy",
};

const DatePickerWithYearMonth = ({
  date,
  onDateChange,
  placeholder = "Selecciona una fecha...",
  disabled,
  fromYear = 1990,
  toYear = new Date().getFullYear(),
}: DatePickerWithYearMonthProps) => {
  const { language } = useLanguage();
  const locale = LOCALES[language] || es;

  const [calendarDate, setCalendarDate] = React.useState<Date>(date || new Date());
  const [isOpen, setIsOpen] = React.useState(false);

  // Localized months derived from current locale
  const months = React.useMemo(() => {
    const base = new Date(2024, 0, 1);
    return Array.from({ length: 12 }, (_, i) => {
      const name = format(setMonth(base, i), "LLLL", { locale });
      return name.charAt(0).toUpperCase() + name.slice(1);
    });
  }, [locale]);

  const years = React.useMemo(() => {
    const yearsArray = [];
    for (let year = toYear; year >= fromYear; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }, [fromYear, toYear]);

  const handleMonthChange = (monthIndex: string) => {
    setCalendarDate(setMonth(calendarDate, parseInt(monthIndex)));
  };

  const handleYearChange = (year: string) => {
    setCalendarDate(setYear(calendarDate, parseInt(year)));
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    if (selectedDate) {
      setCalendarDate(selectedDate);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-14 rounded-xl bg-secondary border-border hover:bg-secondary/80",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
          {date ? (
            <span className="text-foreground">
              {format(date, DATE_FORMAT[language] || DATE_FORMAT.es, { locale })}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
        <div className="p-3 border-b border-border">
          <div className="flex gap-2">
            <Select
              value={getMonth(calendarDate).toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="flex-1 h-10 bg-secondary border-border">
                <SelectValue placeholder={MONTH_LABEL[language] || "Mes"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-[200px]">
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={getYear(calendarDate).toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-24 h-10 bg-secondary border-border">
                <SelectValue placeholder={YEAR_LABEL[language] || "Año"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-[200px]">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          month={calendarDate}
          onMonthChange={setCalendarDate}
          disabled={disabled}
          initialFocus
          locale={locale}
          className="rounded-xl pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerWithYearMonth;
