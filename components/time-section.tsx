"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { ReminderCard } from "./reminder-card";
import { Button } from "@/components/ui/button";
import { Reminder } from "@/types/reminder";

interface TimeSectionProps {
  title: string;
  reminders: Reminder[];
  onAddReminder: () => void;
  onEditReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
}

const timeSlotEmojis = {
  Morning: "🌅",
  Afternoon: "☀️",
  Evening: "🌙",
};

const timeSlotColors = {
  Morning: "border-l-yellow-400 bg-yellow-50/30 dark:bg-yellow-900/20",
  Afternoon: "border-l-orange-400 bg-orange-50/30 dark:bg-orange-900/20",
  Evening: "border-l-purple-400 bg-purple-50/30 dark:bg-purple-900/20",
};

export function TimeSection({
  title,
  reminders,
  onAddReminder,
  onEditReminder,
  onDeleteReminder,
}: TimeSectionProps) {
  const completedCount = reminders.filter((r) => r.lastCompleted).length;
  const totalCount = reminders.length;

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-l-4 pl-4 py-6 ${timeSlotColors[title as keyof typeof timeSlotColors]} modern-shadow`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl">{timeSlotEmojis[title as keyof typeof timeSlotEmojis]}</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount} of {totalCount} completed
            </p>
          </div>
        </div>

        {/* <Button
          onClick={onAddReminder}
          size="sm"
          className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Reminder
        </Button> */}
      </div>

      <div className="space-y-4 px-4">
        <AnimatePresence mode="popLayout">
          {reminders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="text-5xl mb-3">🐾</div>
              <p className="text-lg font-medium mb-1">
                No reminders for this time
              </p>
              <p className="text-sm">Add one to get started!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder._id} 
                  reminder={reminder}
                  onEdit={onEditReminder}
                  onDelete={onDeleteReminder}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
