import { FilterFn } from '@tanstack/react-table';
import { User } from '@/types';

// Define the filter function with proper typing
export const userFilterFn: FilterFn<User> = (row, columnId, filterValue: string) => {
  // Convert the value to lowercase for case-insensitive search
  const searchValue = filterValue.toLowerCase();
  const user = row.original;
  
  // Check each searchable field
  return (
    user.name.toLowerCase().includes(searchValue) ||
    user.email.toLowerCase().includes(searchValue) ||
    user.role.toLowerCase().includes(searchValue)
  );
};

// Export the search configuration
export const searchConfig = {
  placeholder: 'Search users by name, email, or role...',
  filterFn: userFilterFn,
};
