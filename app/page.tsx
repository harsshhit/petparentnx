"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarStrip } from "@/components/calendar-strip";
import { FilterBar } from "@/components/filter-bar";
import { TimeSection } from "@/components/time-section";
import { ReminderForm } from "@/components/reminder-form";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { StatsCard } from "@/components/stats-card";
import { useReminderStore } from "@/lib/store";
import { Reminder } from "@/types/reminder";
import { toast } from "sonner";

export default function HomePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null
  );
  const [reminderToDelete, setReminderToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { getGroupedReminders, deleteReminder } = useReminderStore();
  const groupedReminders = getGroupedReminders();

  const handleAddReminder = () => {
    setSelectedReminder(null);
    setIsAddModalOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsEditModalOpen(true);
  };

  const handleDeleteReminder = (id: string, title: string) => {
    setReminderToDelete({ id, title });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (reminderToDelete) {
      deleteReminder(reminderToDelete.id);
      toast.success("Reminder deleted successfully");
      setIsDeleteModalOpen(false);
      setReminderToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-100 dark:border-gray-800">
        <div className="container-responsive py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">ZOOCO</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Daily Reminders
                </p>
              </div>
            </div>

            <Button
              onClick={handleAddReminder}
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </div>
      </header>

      <div className="container-responsive py-6">
        {/* Stats */}
        <div className="mb-6">
          <StatsCard />
        </div>

        {/* Calendar Strip */}
        <div className="mb-6">
          <CalendarStrip />
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar />
        </div>

        {/* Content */}
        <main className="responsive-spacing">
          {["Morning", "Afternoon", "Evening"].map((timeSlot) => (
            <TimeSection
              key={timeSlot}
              title={timeSlot as "Morning" | "Afternoon" | "Evening"}
              reminders={
                groupedReminders[timeSlot as keyof typeof groupedReminders]
              }
              onAddReminder={handleAddReminder}
              onEditReminder={handleEditReminder}
              onDeleteReminder={(id) => {
                const reminder = groupedReminders[
                  timeSlot as keyof typeof groupedReminders
                ].find((r) => r.id === id);
                if (reminder) {
                  handleDeleteReminder(id, reminder.title);
                }
              }}
            />
          ))}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">Made with ❤️ for pet parents</p>
          <p className="text-xs">
            © {new Date().getFullYear()} ZOOCO. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Modals */}
      <ReminderForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ReminderForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reminder={selectedReminder || undefined}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={reminderToDelete?.title || ""}
      />
    </div>
  );
}
