import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Reminder, ReminderFormData, GroupedReminders } from "@/types/reminder";
import { format, isToday, getHours } from "date-fns";

interface ReminderStore {
  reminders: Reminder[];
  selectedDate: Date;
  selectedPet: string | null;
  selectedCategory: string | null;
  isLoading: boolean;

  // Actions
  addReminder: (data: ReminderFormData) => void;
  updateReminder: (id: string, data: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderComplete: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedPet: (pet: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  getFilteredReminders: () => Reminder[];
  getGroupedReminders: () => GroupedReminders;
  getTodayCompletedCount: () => number;
  getTodayTotalCount: () => number;
  getReminderStreak: (id: string) => number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const getTimeSlot = (date: Date): "Morning" | "Afternoon" | "Evening" => {
  const hour = getHours(date);
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
};

// Sample data for demonstration
const sampleReminders: Reminder[] = [
  {
    id: "1",
    pet: "Buddy",
    category: "Health",
    title: "Morning medication",
    notes: "Give with food",
    startDateTime: new Date(2025, 0, 20, 8, 0),
    frequency: "Daily",
    isCompleted: false,
    streak: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    pet: "Luna",
    category: "Lifestyle",
    title: "Walk in the park",
    startDateTime: new Date(2025, 0, 20, 16, 30),
    frequency: "Daily",
    isCompleted: true,
    completedAt: new Date(),
    streak: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    pet: "Buddy",
    category: "General",
    title: "Feed dinner",
    startDateTime: new Date(2025, 0, 20, 19, 0),
    frequency: "Daily",
    isCompleted: false,
    streak: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: sampleReminders,
      selectedDate: new Date(),
      selectedPet: null,
      selectedCategory: null,
      isLoading: false,

      addReminder: (data: ReminderFormData) => {
        const newReminder: Reminder = {
          ...data,
          id: generateId(),
          isCompleted: false,
          streak: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));
      },

      updateReminder: (id: string, data: Partial<Reminder>) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id
              ? { ...reminder, ...data, updatedAt: new Date() }
              : reminder
          ),
        }));
      },

      deleteReminder: (id: string) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },

      toggleReminderComplete: (id: string) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) => {
            if (reminder.id === id) {
              const isCompleted = !reminder.isCompleted;
              const newStreak = isCompleted
                ? reminder.streak + 1
                : Math.max(0, reminder.streak - 1);

              return {
                ...reminder,
                isCompleted,
                completedAt: isCompleted ? new Date() : undefined,
                streak: newStreak,
                updatedAt: new Date(),
              };
            }
            return reminder;
          }),
        }));
      },

      setSelectedDate: (date: Date) => set({ selectedDate: date }),
      setSelectedPet: (pet: string | null) => set({ selectedPet: pet }),
      setSelectedCategory: (category: string | null) =>
        set({ selectedCategory: category }),

      getFilteredReminders: () => {
        const { reminders, selectedDate, selectedPet, selectedCategory } =
          get();

        return reminders.filter((reminder) => {
          const dateMatch =
            format(reminder.startDateTime, "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd");
          const petMatch = !selectedPet || reminder.pet === selectedPet;
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
          const timeSlot = getTimeSlot(reminder.startDateTime);
          grouped[timeSlot].push(reminder);
        });

        // Sort each group by time
        Object.keys(grouped).forEach((slot) => {
          grouped[slot as keyof GroupedReminders].sort(
            (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()
          );
        });

        return grouped;
      },

      getTodayCompletedCount: () => {
        const { reminders } = get();
        return reminders.filter(
          (reminder) => isToday(reminder.startDateTime) && reminder.isCompleted
        ).length;
      },

      getTodayTotalCount: () => {
        const { reminders } = get();
        return reminders.filter((reminder) => isToday(reminder.startDateTime))
          .length;
      },

      getReminderStreak: (id: string) => {
        const { reminders } = get();
        const reminder = reminders.find((r) => r.id === id);
        return reminder?.streak || 0;
      },
    }),
    {
      name: "zooco-reminders-storage",
    }
  )
);
