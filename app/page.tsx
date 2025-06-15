"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Heart, CheckCircle2 } from "lucide-react";
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
import { ReminderCard } from "@/components/reminder-card";
import { PetForm } from '@/components/pet-form';

export default function HomePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);

  const { 
    getGroupedReminders, 
    deleteReminder, 
    fetchReminders,
    isLoading,
    error 
  } = useReminderStore();

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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

  const confirmDelete = async () => {
    if (reminderToDelete) {
      await deleteReminder(reminderToDelete.id);
      toast.success("Reminder deleted successfully");
      setIsDeleteModalOpen(false);
      setReminderToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Pet Care Reminders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Stay on top of your pet's daily needs
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsPetFormOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Pet
            </Button>
            <Button
              onClick={handleAddReminder}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Reminder
            </Button>
          </div>
        </div>

        <CalendarStrip />
        <FilterBar />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatsCard />
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Your Pet's Health
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Keep track of your pet's health and well-being with our comprehensive
              reminder system.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedReminders).map(([timeSlot, reminders]) => (
            <TimeSection
              key={timeSlot}
              title={timeSlot as keyof typeof groupedReminders}
              reminders={reminders}
              onAddReminder={handleAddReminder}
              onEditReminder={handleEditReminder}
              onDeleteReminder={handleDeleteReminder}
            />
          ))}

          {/* Completed Reminders Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-800 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Completed Reminders
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(groupedReminders)
                .flat()
                .filter((reminder) => reminder.isCompleted)
                .map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onEdit={handleEditReminder}
                    onDelete={handleDeleteReminder}
                  />
                ))}
            </div>
          </motion.div>
        </div>
      </div>

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

      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} />
    </main>
  );
}
