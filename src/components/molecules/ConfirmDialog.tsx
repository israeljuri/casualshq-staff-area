/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import { AlertDialog, AlertDialogContent } from '@/components/atoms/alert-dialog';

interface ReusableConfirmDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;
  content: React.ReactNode | any;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  content,
}: ReusableConfirmDialogProps) {
  // Prevent content shift when dialog appears by managing body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function to restore scroll when component unmounts or dialog closes
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full md:w-[25rem] p-0 bg-transparent overflow-hidden border-none">
        {content}
      </AlertDialogContent>
    </AlertDialog>
  );
}
