import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { useLanguage } from "@/hooks/use-language";

interface TimeUnit {
  value: number;
  label: string;
}

interface RelationshipCounterProps {
  startDate: string;
  className?: string;
}

const RelationshipCounter = ({
  startDate,
  className = ""
}: RelationshipCounterProps) => {
  const { t } = useLanguage();
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([]);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Mexico_City";

    // Parse the start date as a local calendar date at noon to avoid DST edge cases
    let start: DateTime;
    if (startDate.includes("T")) {
      // ISO string like "2025-02-26T00:00:00"
      const [datePart] = startDate.split("T");
      const [y, m, d] = datePart.split("-").map(Number);
      start = DateTime.fromObject({ year: y, month: m, day: d, hour: 12 }, { zone: tz });
    } else {
      // Plain date "2025-02-26"
      const [y, m, d] = startDate.split("-").map(Number);
      start = DateTime.fromObject({ year: y, month: m, day: d, hour: 12 }, { zone: tz });
    }

    const calculateTime = () => {
      const now = DateTime.now().setZone(tz);
      const diff = now.diff(start, ["years", "months", "days", "hours", "minutes"]);

      setTimeUnits([
        { value: Math.floor(diff.years), label: t('counter.years') },
        { value: Math.floor(diff.months), label: t('counter.months') },
        { value: Math.floor(diff.days), label: t('counter.days') },
        { value: Math.floor(diff.hours), label: t('counter.hours') },
        { value: Math.floor(diff.minutes), label: t('counter.min') }
      ]);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate, t]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <motion.div
      className={`flex flex-wrap justify-center gap-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {timeUnits.map(unit => (
        <motion.div
          key={unit.label}
          className="counter-unit min-w-[80px] md:min-w-[100px]"
          variants={itemVariants}
        >
          <motion.span
            className="counter-number block text-paper bg-paper"
            key={`${unit.label}-${unit.value}`}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {unit.value.toString().padStart(2, "0")}
          </motion.span>
          <span className="counter-label block">{unit.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RelationshipCounter;
