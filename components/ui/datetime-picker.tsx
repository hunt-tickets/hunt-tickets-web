"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { format, addMonths, subMonths, isSameDay, isToday, getDate, getDaysInMonth, startOfMonth } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Day {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
}

interface DateTimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  ({ className, value, onChange, placeholder = "Seleccionar fecha y hora", ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    
    // Helper function to safely parse date
    const parseDate = (dateValue: string | undefined) => {
      if (!dateValue) return null;
      try {
        // Handle different date formats
        let date: Date;
        if (dateValue.includes('T')) {
          // ISO format: 2024-01-01T10:30
          date = new Date(dateValue);
        } else if (dateValue.includes('/')) {
          // DD/MM/YYYY format
          const [day, month, year] = dateValue.split('/');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          // Try parsing as is
          date = new Date(dateValue);
        }
        return isNaN(date.getTime()) ? null : date;
      } catch {
        return null;
      }
    };

    const initialDate = parseDate(value);
    const [currentMonth, setCurrentMonth] = React.useState(initialDate || new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(initialDate);
    const [selectedTime, setSelectedTime] = React.useState(
      initialDate ? format(initialDate, "HH:mm") : "00:00"
    );

    // Generate all days for the current month
    const monthDays = React.useMemo(() => {
      const start = startOfMonth(currentMonth);
      const totalDays = getDaysInMonth(currentMonth);
      const days: Day[] = [];
      for (let i = 0; i < totalDays; i++) {
        const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
        days.push({
          date,
          isToday: isToday(date),
          isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        });
      }
      return days;
    }, [currentMonth, selectedDate]);

    const handleDateClick = (date: Date) => {
      setSelectedDate(date);
      updateValue(date, selectedTime);
    };

    const handleTimeChange = (time: string) => {
      setSelectedTime(time);
      if (selectedDate) {
        updateValue(selectedDate, time);
      }
    };

    const updateValue = (date: Date, time: string) => {
      const [hours, minutes] = time.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onChange?.(format(newDate, "yyyy-MM-dd'T'HH:mm"));
      setIsOpen(false);
    };

    const handlePrevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1));
    };

    const displayValue = selectedDate 
      ? `${format(selectedDate, "dd/MM/yyyy")} ${selectedTime}`
      : "";

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {/* Input Display */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/50 focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-200 text-left flex items-center justify-between"
        >
          <span className={displayValue ? "text-white" : "text-white/50"}>
            {displayValue || placeholder}
          </span>
          <Clock className="w-4 h-4 text-white/40" />
        </button>

        {/* Calendar Dropdown */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 z-50 w-80 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.h3
                key={format(currentMonth, "MMMM yyyy")}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-semibold text-white"
              >
                {format(currentMonth, "MMMM yyyy")}
              </motion.h3>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-white/50 py-2">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for month start offset */}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
                <div key={index} />
              ))}
              
              {/* Month days */}
              {monthDays.map((day) => (
                <button
                  key={format(day.date, "yyyy-MM-dd")}
                  onClick={() => handleDateClick(day.date)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center relative",
                    {
                      "bg-blue-600 text-white": day.isSelected,
                      "hover:bg-white/10 text-white/80": !day.isSelected,
                      "text-blue-400": day.isToday && !day.isSelected,
                    }
                  )}
                >
                  {getDate(day.date)}
                  {day.isToday && !day.isSelected && (
                    <span className="absolute bottom-0 h-1 w-1 rounded-full bg-blue-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Time Picker */}
            <div className="border-t border-white/10 pt-4">
              <label className="block text-white/80 text-sm font-medium mb-3">
                Hora
              </label>
              <div className="flex items-center gap-3">
                {/* Hour Selector */}
                <div className="flex-1">
                  <div className="relative">
                    <select
                      value={selectedTime.split(':')[0]}
                      onChange={(e) => {
                        const minutes = selectedTime.split(':')[1];
                        handleTimeChange(`${e.target.value.padStart(2, '0')}:${minutes}`);
                      }}
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')} className="bg-black text-white">
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronRight className="h-3 w-3 text-white/40 rotate-90" />
                    </div>
                  </div>
                  <p className="text-xs text-white/50 mt-1 text-center">Horas</p>
                </div>

                <span className="text-white/60 text-lg font-bold">:</span>

                {/* Minutes Selector */}
                <div className="flex-1">
                  <div className="relative">
                    <select
                      value={selectedTime.split(':')[1]}
                      onChange={(e) => {
                        const hours = selectedTime.split(':')[0];
                        handleTimeChange(`${hours}:${e.target.value.padStart(2, '0')}`);
                      }}
                      className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:bg-white/10 focus:border-blue-500/50 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')} className="bg-black text-white">
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronRight className="h-3 w-3 text-white/40 rotate-90" />
                    </div>
                  </div>
                  <p className="text-xs text-white/50 mt-1 text-center">Minutos</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Overlay to close calendar */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";