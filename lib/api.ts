const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Pet {
  _id: string;
  name: string;
  type: string;
  breed?: string;
  age?: number;
  owner: string;
}

interface Reminder {
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

// API client for pets
export const petsApi = {
  getAll: async (): Promise<Pet[]> => {
    const response = await fetch(`${API_BASE_URL}/pets`);
    if (!response.ok) throw new Error('Failed to fetch pets');
    return response.json();
  },

  getOne: async (id: string): Promise<Pet> => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`);
    if (!response.ok) throw new Error('Failed to fetch pet');
    return response.json();
  },

  create: async (pet: Omit<Pet, '_id'>): Promise<Pet> => {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });
    if (!response.ok) throw new Error('Failed to create pet');
    return response.json();
  },

  update: async (id: string, pet: Partial<Pet>): Promise<Pet> => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pet),
    });
    if (!response.ok) throw new Error('Failed to update pet');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete pet');
  },
};

// API client for reminders
export const remindersApi = {
  getAll: async (): Promise<Reminder[]> => {
    const response = await fetch(`${API_BASE_URL}/reminders`);
    if (!response.ok) throw new Error('Failed to fetch reminders');
    return response.json();
  },

  getByPet: async (petId: string): Promise<Reminder[]> => {
    const response = await fetch(`${API_BASE_URL}/reminders/pet/${petId}`);
    if (!response.ok) throw new Error('Failed to fetch reminders');
    return response.json();
  },

  create: async (reminder: Omit<Reminder, '_id' | 'pet'> & { pet: string }): Promise<Reminder> => {
    const response = await fetch(`${API_BASE_URL}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminder),
    });
    if (!response.ok) throw new Error('Failed to create reminder');
    return response.json();
  },

  update: async (id: string, reminder: Partial<Reminder>): Promise<Reminder> => {
    const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminder),
    });
    if (!response.ok) throw new Error('Failed to update reminder');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/reminders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete reminder');
  },

  complete: async (id: string): Promise<Reminder> => {
    const response = await fetch(`${API_BASE_URL}/reminders/${id}/complete`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to complete reminder');
    return response.json();
  },
}; 