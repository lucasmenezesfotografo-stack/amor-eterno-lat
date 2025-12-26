import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface LoveLetterProps {
  content: string;
  author?: string;
  className?: string;
}

const LoveLetter = ({ content, author, className = "" }: LoveLetterProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Decorative Elements */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-10 h-10 text-accent fill-accent/20" />
        </motion.div>
      </div>

      {/* Letter Container */}
      <div className="glass-card p-8 md:p-12 lg:p-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="hearts-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <text x="10" y="15" textAnchor="middle" fontSize="10" fill="currentColor">♥</text>
            </pattern>
            <rect width="100%" height="100%" fill="url(#hearts-pattern)" />
          </svg>
        </div>

        {/* Opening Quote */}
        <motion.div
          className="text-6xl md:text-8xl font-serif text-accent/30 leading-none mb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          "
        </motion.div>

        {/* Letter Content */}
        <motion.div
          className="love-letter text-foreground/90 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {content.split('\n\n').map((paragraph, index) => (
            <motion.p
              key={index}
              className="mb-6 last:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        {/* Closing Quote */}
        <motion.div
          className="text-6xl md:text-8xl font-serif text-accent/30 leading-none text-right mt-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          "
        </motion.div>

        {/* Author Signature */}
        {author && (
          <motion.div
            className="mt-8 text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="text-lg md:text-xl font-serif italic text-gradient-romantic">
              Con todo mi amor,
            </span>
            <p className="text-2xl md:text-3xl font-serif font-semibold text-foreground mt-2">
              {author}
            </p>
          </motion.div>
        )}

        {/* Decorative Corner Hearts */}
        <div className="absolute top-4 right-4 opacity-20">
          <Heart className="w-6 h-6 text-accent" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <Heart className="w-6 h-6 text-accent" />
        </div>
      </div>
    </motion.div>
  );
};

export default LoveLetter;
