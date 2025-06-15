'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Reminder, ReminderFormData } from '@/types/reminder';
import { useReminderStore } from '@/lib/store';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { petsApi } from '@/lib/api';

const formSchema = z.object({
  petId: z.string().min(1, 'Pet is required'),
  category: z.enum(['General', 'Lifestyle', 'Health']),
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  startDateTime: z.string().min(1, 'Date and time are required'),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly', 'Custom']),
  timeSlot: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']),
});

interface ReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  reminder?: Reminder;
}

export function ReminderForm({ isOpen, onClose, reminder }: ReminderFormProps) {
  const { addReminder, updateReminder } = useReminderStore();
  const isEditing = !!reminder;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pets, setPets] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsData = await petsApi.getAll();
        setPets(petsData);
      } catch (error) {
        toast.error('Failed to fetch pets');
      }
    };
    fetchPets();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petId: reminder?.pet._id || '',
      category: reminder?.category || 'General',
      title: reminder?.title || '',
      notes: reminder?.notes || '',
      startDateTime: reminder
        ? format(new Date(reminder.startDate), "yyyy-MM-dd'T'HH:mm")
        : '',
      frequency: reminder?.frequency || 'Daily',
      timeSlot: reminder?.timeSlot || 'Morning',
    },
  });

  // Update form values when reminder changes
  useEffect(() => {
    if (reminder) {
      form.reset({
        petId: reminder.pet._id,
        category: reminder.category,
        title: reminder.title,
        notes: reminder.notes || '',
        startDateTime: format(new Date(reminder.startDate), "yyyy-MM-dd'T'HH:mm"),
        frequency: reminder.frequency,
        timeSlot: reminder.timeSlot,
      });
    } else {
      form.reset({
        petId: '',
        category: 'General',
        title: '',
        notes: '',
        startDateTime: '',
        frequency: 'Daily',
        timeSlot: 'Morning',
      });
    }
  }, [reminder, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formData: ReminderFormData = {
        ...values,
        startDateTime: new Date(values.startDateTime),
      };

      if (isEditing && reminder) {
        await updateReminder(reminder._id, formData);
      } else {
        await addReminder(formData);
      }

      form.reset();
      onClose();
      toast.success(isEditing ? 'Reminder updated successfully!' : 'Reminder created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save reminder. Please try again.');
      console.error('Error saving reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl">
            {isEditing ? 'Edit Reminder' : 'Add New Reminder'}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {isEditing
              ? 'Update your pet care reminder.'
              : 'Create a new reminder for your pet care routine.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="petId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Pet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                          <SelectValue placeholder="Select pet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pets.map((pet) => (
                          <SelectItem key={pet._id} value={pet._id} className="text-sm sm:text-base">
                            {pet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General" className="text-sm sm:text-base">🐾 General</SelectItem>
                        <SelectItem value="Lifestyle" className="text-sm sm:text-base">🎾 Lifestyle</SelectItem>
                        <SelectItem value="Health" className="text-sm sm:text-base">💊 Health</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter reminder title" 
                        {...field} 
                        className="h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes..."
                        className="resize-none min-h-[80px] text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Date & Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field} 
                        className="h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Daily" className="text-sm sm:text-base">Daily</SelectItem>
                        <SelectItem value="Weekly" className="text-sm sm:text-base">Weekly</SelectItem>
                        <SelectItem value="Monthly" className="text-sm sm:text-base">Monthly</SelectItem>
                        <SelectItem value="Custom" className="text-sm sm:text-base">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Time Slot</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Morning" className="text-sm sm:text-base">🌅 Morning</SelectItem>
                        <SelectItem value="Afternoon" className="text-sm sm:text-base">☀️ Afternoon</SelectItem>
                        <SelectItem value="Evening" className="text-sm sm:text-base">🌆 Evening</SelectItem>
                        <SelectItem value="Night" className="text-sm sm:text-base">🌙 Night</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEditing ? 'Update Reminder' : 'Create Reminder'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}