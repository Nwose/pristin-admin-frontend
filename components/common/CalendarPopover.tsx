"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CalendarPopoverProps {
  onSelect: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export default function CalendarPopover({
  onSelect,
  isOpen,
  onClose,
  anchorRef,
}: CalendarPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Date>();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, scale: 0.85, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute z-50 bg-white shadow-xl rounded-xl p-4 border w-[280px]"
      style={{
        top:
          (anchorRef.current?.getBoundingClientRect().bottom ?? 0) +
          window.scrollY +
          10,
        left:
          (anchorRef.current?.getBoundingClientRect().left ?? 0) +
          window.scrollX -
          100,
      }}
    >
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(day) => {
          if (day) {
            setSelected(day);
            onSelect(day);
            onClose();
          }
        }}
      />
    </motion.div>
  );
}
