import { NextResponse } from 'next/server';
import { Reminder, ReminderFormData } from '@/types/reminder';
import { v4 as uuidv4 } from 'uuid';
import { getReminders, addReminder } from '@/lib/reminders-store';

// In-memory storage (replace with database in production)
export let reminders: Reminder[] = [
  {
    id: 'e82588c7-8069-4904-bed1-d00de71bc8a3',
    pet: 'Test Pet',
    category: 'General',
    title: 'Test Reminder',
    notes: 'Test notes',
    startDateTime: new Date(),
    frequency: 'Daily',
    isCompleted: false,
    streak: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET() {
  const reminders = getReminders();
  return NextResponse.json(reminders);
}

export async function POST(request: Request) {
  try {
    const data: ReminderFormData = await request.json();
    
    // Validate required fields
    if (!data.pet || !data.title || !data.startDateTime || !data.category || !data.frequency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate date
    const startDate = new Date(data.startDateTime);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const newReminder: Reminder = {
      ...data,
      id: uuidv4(),
      isCompleted: false,
      streak: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const addedReminder = addReminder(newReminder);
    return NextResponse.json(addedReminder, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
} 