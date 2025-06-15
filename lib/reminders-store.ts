import { Reminder } from '@/types/reminder';

// In-memory storage
let reminders: Reminder[] = [];

export function getReminders() {
  return reminders;
}

export function addReminder(reminder: Reminder) {
  reminders.push(reminder);
  return reminder;
}

export function updateReminder(id: string, data: Partial<Reminder>) {
  const index = reminders.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('Reminder not found');
  }
  
  const updatedReminder = {
    ...reminders[index],
    ...data,
    updatedAt: new Date(),
  };
  
  reminders[index] = updatedReminder;
  return updatedReminder;
}

export function deleteReminder(id: string) {
  const index = reminders.findIndex((r) => r.id === id);
  if (index === -1) return false;
  
  reminders = reminders.filter((r) => r.id !== id);
  return true;
} 