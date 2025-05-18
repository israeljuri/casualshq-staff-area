'use client';

import { useQuery } from '@tanstack/react-query';
import { getStaffs } from '@/services/staff.service';
import useAlert from '@/hooks/useAlert';

export const useGetStaffs = () => {
  const alert = useAlert();

  try {
    const result = useQuery({
      queryKey: ['staffs'],
      queryFn: getStaffs,
    });

    if (result.error) {
      return alert.showAlert(result.error.name, 'error', {
        subtext: result.error.message,
      });
    }

    return {
      data: result.data,
      isPending: result.isPending,
    };
  } catch (error) {
    if (error instanceof Error)
      alert.showAlert(error.name, 'error', { subtext: error.message });
  }
};
