import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { parseISO } from "date-fns";
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
    const start = parseISO(startDate);

    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44);
      const years = Math.floor(days / 365.25);

      setTimeUnits([
        { value: years, label: t('counter.years') },
        { value: months % 12, label: t('counter.months') },
        { value: days % 30, label: t('counter.days') },
        { value: hours % 24, label: t('counter.hours') },
        { value: minutes % 60, label: t('counter.min') }
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
