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
import { Pet } from '@/types/reminder';
import { petsApi } from '@/lib/api';
import { useState } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  breed: z.string().optional(),
  age: z.string().optional(),
  owner: z.string().min(1, 'Owner is required'),
});

interface PetFormProps {
  isOpen: boolean;
  onClose: () => void;
  pet?: Pet;
}

export function PetForm({ isOpen, onClose, pet }: PetFormProps) {
  const isEditing = !!pet;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pet?.name || '',
      type: pet?.type || '',
      breed: pet?.breed || '',
      age: pet?.age?.toString() || '',
      owner: pet?.owner || '',
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const petData = {
        ...data,
        age: data.age ? parseInt(data.age) : undefined,
      };

      if (isEditing && pet) {
        await petsApi.update(pet._id, petData);
        toast.success('Pet updated successfully');
      } else {
        await petsApi.create(petData);
        toast.success('Pet added successfully');
      }
      handleClose();
    } catch (error) {
      toast.error('Failed to save pet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl">
            {isEditing ? 'Edit Pet' : 'Add New Pet'}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {isEditing
              ? 'Update your pet information.'
              : 'Add a new pet to your family.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter pet name"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Dog, Cat, Bird"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Breed</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter breed (optional)"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter age in years (optional)"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Owner</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter owner name"
                        className="h-10 sm:h-11 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
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
                  isEditing ? 'Update Pet' : 'Add Pet'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 