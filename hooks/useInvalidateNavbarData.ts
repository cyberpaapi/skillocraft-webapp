'use client';

import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateNavbarData = () => {
  const queryClient = useQueryClient();

  const invalidateNavbarData = () => {
    queryClient.invalidateQueries({ queryKey: ['navbar-data'] });
  };

  return { invalidateNavbarData };
};
