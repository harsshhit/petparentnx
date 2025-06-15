import { NextResponse } from 'next/server';
import { Reminder } from '@/types/reminder';
import { getReminders, updateReminder, deleteReminder } from '@/lib/reminders-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const reminder = getReminders().find((r) => r.id === params.id);
  
  if (!reminder) {
    return NextResponse.json(
      { error: 'Reminder not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(reminder);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updated = updateReminder(params.id, data);

    if (!updated) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const success = deleteReminder(params.id);

  if (!success) {
    return NextResponse.json(
      { error: 'Reminder not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
} 