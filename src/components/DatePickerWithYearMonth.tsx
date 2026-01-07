import * as React from "react";
import { format, setMonth, setYear, getMonth, getYear } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react";
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

interface DatePickerWithYearMonthProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  fromYear?: number;
  toYear?: number;
}

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DatePickerWithYearMonth = ({
  date,
  onDateChange,
  placeholder = "Selecciona una fecha...",
  disabled,
  fromYear = 1990,
  toYear = new Date().getFullYear(),
}: DatePickerWithYearMonthProps) => {
  const [calendarDate, setCalendarDate] = React.useState<Date>(date || new Date());
  const [isOpen, setIsOpen] = React.useState(false);

  // Generate years array
  const years = React.useMemo(() => {
    const yearsArray = [];
    for (let year = toYear; year >= fromYear; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }, [fromYear, toYear]);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = setMonth(calendarDate, parseInt(monthIndex));
    setCalendarDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(calendarDate, parseInt(year));
    setCalendarDate(newDate);
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
              {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
        <div className="p-3 border-b border-border">
          <div className="flex gap-2">
            {/* Month Selector */}
            <Select
              value={getMonth(calendarDate).toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="flex-1 h-10 bg-secondary border-border">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-[200px]">
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Selector */}
            <Select
              value={getYear(calendarDate).toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-24 h-10 bg-secondary border-border">
                <SelectValue placeholder="Año" />
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
          locale={es}
          className="rounded-xl"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerWithYearMonth;
