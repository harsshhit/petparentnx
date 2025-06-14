export interface Reminder {
  id: string;
  pet: string;
  category: 'General' | 'Lifestyle' | 'Health';
  title: string;
  notes?: string;
  startDateTime: Date;
  frequency: 'Daily' | 'Weekly';
  isCompleted: boolean;
  completedAt?: Date;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderFormData {
  pet: string;
  category: 'General' | 'Lifestyle' | 'Health';
  title: string;
  notes?: string;
  startDateTime: Date;
  frequency: 'Daily' | 'Weekly';
}

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening';

export interface GroupedReminders {
  Morning: Reminder[];
  Afternoon: Reminder[];
  Evening: Reminder[];
}