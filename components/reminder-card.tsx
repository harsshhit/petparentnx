"use client";

import { motion } from "framer-motion";
import { Clock, MoreVertical, Flame, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Reminder } from "@/types/reminder";
import { useReminderStore } from "@/lib/store";
import { format } from "date-fns";

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string, title: string) => void;
}

const categoryColors = {
  General:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Lifestyle:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Health:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

const categoryIcons = {
  General: "🐾",
  Lifestyle: "🎾",
  Health: "💊",
};

export function ReminderCard({
  reminder,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  const { toggleReminderComplete } = useReminderStore();

  const handleToggleComplete = () => {
    toggleReminderComplete(reminder._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-4 shadow-sm transition-all duration-200 ${
        reminder.lastCompleted
          ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20"
          : "border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-700 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xl">{categoryIcons[reminder.category]}</span>
            <Badge
              variant="outline"
              className={`text-xs font-medium ${
                categoryColors[reminder.category]
              }`}
            >
              {reminder.category}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
            >
              {reminder.pet.name}
            </Badge>
          </div>

          <h3
            className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate ${
              reminder.lastCompleted
                ? "line-through text-gray-500 dark:text-gray-400"
                : ""
            }`}
          >
            {reminder.title}
          </h3>

          {reminder.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {reminder.notes}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{format(reminder.startDate, "h:mm a")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300">
                {reminder.frequency}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{reminder.pet.name}</span>
            </div>
            {reminder.streak > 0 && (
              <div className="flex items-center gap-1.5 ml-auto">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  {reminder.streak}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleComplete}
            className={`h-8 w-8 p-0 rounded-full ${
              reminder.lastCompleted
                ? "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                : "text-gray-400 hover:text-teal-600 dark:text-gray-500 dark:hover:text-teal-400"
            }`}
          >
            {reminder.lastCompleted ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onEdit(reminder)}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(reminder._id, reminder.title)}
                className="text-red-600 dark:text-red-400 cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
