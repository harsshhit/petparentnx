"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useReminderStore } from "@/lib/store";

export function FilterBar() {
  const {
    selectedPet,
    selectedCategory,
    setSelectedPet,
    setSelectedCategory,
    reminders,
  } = useReminderStore();

  // Get unique pets and categories from reminders
  const uniquePets = Array.from(new Set(reminders.map((r) => r.pet.name)));
  const categories = ["General", "Lifestyle", "Health"];

  const clearFilters = () => {
    setSelectedPet(null);
    setSelectedCategory(null);
  };

  const hasActiveFilters = selectedPet || selectedCategory;

  const handlePetChange = (value: string) => {
    if (value === "all") {
      setSelectedPet(null);
    } else {
      setSelectedPet(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </span>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Select value={selectedPet || "all"} onValueChange={handlePetChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <SelectValue placeholder="All pets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All pets</SelectItem>
            {uniquePets.map((pet) => (
              <SelectItem key={pet} value={pet}>
                {pet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCategory || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "General" && "🐾 "}
                {category === "Lifestyle" && "🎾 "}
                {category === "Health" && "💊 "}
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedPet && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
            >
              Pet: {selectedPet}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setSelectedPet(null)}
              />
            </Badge>
          )}
          {selectedCategory && (
            <Badge
              variant="secondary"
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
            >
              Category: {selectedCategory}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setSelectedCategory(null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
