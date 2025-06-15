export interface Pet {
  _id: string;
  name: string;
  type: string;
  breed?: string;
  age?: number;
  owner: string;
}

export interface Reminder {
  _id: string;
  title: string;
  pet: Pet;
  category: 'General' | 'Lifestyle' | 'Health';
  notes?: string;
  startDate: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  status: 'Pending' | 'Completed';
  streak: number;
  lastCompleted?: string;
}

export interface ReminderFormData {
  title: string;
  petId: string;
  category: 'General' | 'Lifestyle' | 'Health';
  notes?: string;
  startDateTime: Date;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
}

export interface GroupedReminders {
  Morning: Reminder[];
  Afternoon: Reminder[];
  Evening: Reminder[];
}