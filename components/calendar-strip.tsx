"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReminderStore } from "@/lib/store";
import { format, addDays, subDays, isToday, isSameDay } from "date-fns";

export function CalendarStrip() {
  const { selectedDate, setSelectedDate, getFilteredReminders } =
    useReminderStore();

  const generateDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      dates.push(addDays(selectedDate, i));
    }
    return dates;
  };

  const dates = generateDates();

  const handlePrevious = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNext = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const getRemindersForDate = (date: Date) => {
    const reminders = getFilteredReminders();
    return reminders.filter(
      (reminder) =>
        format(new Date(reminder.startDate), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 px-4">
          <div className="flex justify-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date, index) => {
              const isSelected = isSameDay(date, selectedDate);
              const isTodayDate = isToday(date);
              const hasReminders = getRemindersForDate(date).length > 0;

              return (
                <motion.button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`relative flex flex-col items-center justify-center w-14 h-20 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-br from-teal-500 to-blue-500 text-white shadow-lg scale-105"
                      : isTodayDate
                      ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-2 border-teal-200 dark:border-teal-700"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-xs font-medium">
                    {format(date, "EEE")}
                  </span>
                  <span className="text-xl font-semibold mt-1">
                    {format(date, "d")}
                  </span>
                  {hasReminders && (
                    <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400" />
                  )}
                  {isTodayDate && !isSelected && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-teal-600 dark:text-teal-400 bg-white dark:bg-gray-800 px-1 rounded-full">
                      Today
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {format(selectedDate, "EEEE, MMMM d")}
          </h2>
          {isToday(selectedDate) && (
            <span className="text-sm text-teal-600 dark:text-teal-400 font-medium bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
