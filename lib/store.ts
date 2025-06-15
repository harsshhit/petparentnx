import { create } from "zustand";
import { Reminder, ReminderFormData, GroupedReminders } from "@/types/reminder";
import { format, isToday, getHours } from "date-fns";
import { remindersApi } from "./api";

interface ReminderStore {
  reminders: Reminder[];
  selectedDate: Date;
  selectedPet: string | null;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchReminders: () => Promise<void>;
  addReminder: (data: ReminderFormData) => Promise<void>;
  updateReminder: (id: string, data: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminderComplete: (id: string) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  setSelectedPet: (pet: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  getFilteredReminders: () => Reminder[];
  getGroupedReminders: () => GroupedReminders;
  getTodayCompletedCount: () => number;
  getTodayTotalCount: () => number;
  getReminderStreak: (id: string) => number;
}

const getTimeSlot = (date: Date): keyof GroupedReminders => {
  const hour = getHours(date);
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
};

export const useReminderStore = create<ReminderStore>()((set, get) => ({
  reminders: [],
  selectedDate: new Date(),
  selectedPet: null,
  selectedCategory: null,
  isLoading: false,
  error: null,

  fetchReminders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await remindersApi.getAll();
      set({ reminders: data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch reminders', isLoading: false });
    }
  },

  addReminder: async (data: ReminderFormData) => {
    set({ isLoading: true, error: null });
    try {
      const newReminder = await remindersApi.create({
        ...data,
        pet: data.petId, // Convert petId to pet reference
        startDate: data.startDateTime.toISOString(),
        status: 'Pending',
        streak: 0
      });
      
      set((state) => ({
        reminders: [...state.reminders, newReminder],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add reminder', isLoading: false });
      throw error;
    }
  },

  updateReminder: async (id: string, data: Partial<Reminder>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedReminder = await remindersApi.update(id, {
        ...data,
        startDate: data.startDateTime?.toISOString(),
      });
      
      set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? updatedReminder : r
        ),
        isLoading: false,
      }));

      return updatedReminder;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update reminder', isLoading: false });
      throw error;
    }
  },

  deleteReminder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await remindersApi.delete(id);
      set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete reminder', isLoading: false });
    }
  },

  toggleReminderComplete: async (id: string) => {
    const reminder = get().reminders.find((r) => r.id === id);
    if (!reminder) return;

    try {
      const updatedReminder = await remindersApi.complete(id);
      set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? updatedReminder : r
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to complete reminder' });
    }
  },

  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  setSelectedPet: (pet: string | null) => set({ selectedPet: pet }),
  setSelectedCategory: (category: string | null) =>
    set({ selectedCategory: category }),

  getFilteredReminders: () => {
    const { reminders, selectedDate, selectedPet, selectedCategory } = get();

    return reminders.filter((reminder) => {
      const dateMatch =
        format(new Date(reminder.startDate), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd");
      const petMatch = !selectedPet || reminder.pet._id === selectedPet;
      const categoryMatch =
        !selectedCategory || reminder.category === selectedCategory;

      return dateMatch && petMatch && categoryMatch;
    });
  },

  getGroupedReminders: () => {
    const filteredReminders = get().getFilteredReminders();

    const grouped: GroupedReminders = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };

    filteredReminders.forEach((reminder) => {
      const timeSlot = getTimeSlot(new Date(reminder.startDate));
      grouped[timeSlot].push(reminder);
    });

    Object.keys(grouped).forEach((slot) => {
      grouped[slot as keyof GroupedReminders].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    });

    return grouped;
  },

  getTodayCompletedCount: () => {
    const { reminders } = get();
    return reminders.filter(
      (reminder) => isToday(new Date(reminder.startDate)) && reminder.status === 'Completed'
    ).length;
  },

  getTodayTotalCount: () => {
    const { reminders } = get();
    return reminders.filter((reminder) => isToday(new Date(reminder.startDate)))
      .length;
  },

  getReminderStreak: (id: string) => {
    const { reminders } = get();
    const reminder = reminders.find((r) => r.id === id);
    return reminder?.streak || 0;
  },
}));
