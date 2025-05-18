import { Button } from '@/components/molecules/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import React, { useState } from 'react'; // Added useState for local break type selection
import playDarkIcon from "@/assets/staff/play-dark.svg"
import Image from 'next/image';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';

import { BreakType } from '@/types';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';

interface TodaysBreakCardProps {
  currentBreakTime: string; // Formatted duration
  isOnBreak: boolean;
  isClockedIn: boolean;
  onStartBreak: (breakType: BreakType) => void;
  onResumeWork: () => void;
  canInteract: boolean; // If false, buttons are disabled
  breakTypes: BreakType[];
}

export const TodaysBreakCard = ({
  currentBreakTime,
  isOnBreak,
  isClockedIn,
  onStartBreak,
  onResumeWork,
  canInteract,
  breakTypes,
}: TodaysBreakCardProps) => {
  const [selectedBreakType, setSelectedBreakType] = useState<BreakType>(
    breakTypes[0] || 'Recess'
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleInitiateAction = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    handleStartBreakClick();
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  const handleStartBreakClick = () => {
    if (canInteract) {
      onStartBreak(selectedBreakType);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        content={
          <article className="p-5 bg-white rounded-2xl border">
            <article className="space-y-3">
              <h4 className="font-medium text-2xl text-black">Resume break?</h4>
              <p className="text-base text-custom-gray">
                Are you sure you want to resume your break?
              </p>
            </article>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <Button
                variant="outline"
                size="md"
                onClick={handleCancel}
                className="w-full"
              >
                Cancel
              </Button>
              <Button size="md" onClick={handleConfirm}>
                Yes, proceed
              </Button>
            </div>
          </article>
        }
      />
      <Card className="border-olive-100 flex flex-col min-h-[250px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-gray-700">
            Today&apos;s break hours
          </CardTitle>
          {isClockedIn &&
            canInteract &&
            !isOnBreak && ( // Show select only if clocked in, can interact, and not already on break
              <Select
                value={selectedBreakType}
                onValueChange={(value) =>
                  setSelectedBreakType(value as BreakType)
                }
                disabled={!canInteract || !isClockedIn || isOnBreak}
              >
                <SelectTrigger className="h-9 text-base">
                  <SelectValue placeholder="Break type" />
                </SelectTrigger>
                <SelectContent>
                  {breakTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-base">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center flex-grow text-center">
          {!isClockedIn && canInteract ? (
            <p className="text-lg font-medium text-center px-4 py-20">
              Clock in first to start a break.
            </p>
          ) : isOnBreak ? (
            <>
              <div className="text-5xl font-medium text-gray-800 mb-6 tabular-nums py-20">
                {currentBreakTime}
              </div>
              <Button
                size="lg"
                onClick={onResumeWork}
                disabled={!canInteract}
                leftIcon={<Image src={playDarkIcon} alt="" />}
                variant={'outline'}
              >
                Resume work
              </Button>
            </>
          ) : (
            <>
              <div
                className={`text-5xl font-medium mb-6 tabular-nums py-20 ${
                  !isClockedIn || !canInteract ? 'text-black' : 'text-black'
                }`}
              >
                {currentBreakTime === '0:00:00' &&
                (!isClockedIn || !canInteract) ? (
                  <p className="font-medium text-lg text-center px-4 max-w-[30ch]">
                    You can start break after you have clocked in for the day.
                  </p>
                ) : (
                  currentBreakTime
                )}
              </div>

              <Button
                size="lg"
                onClick={handleInitiateAction}
                disabled={!canInteract || !isClockedIn}
                leftIcon={<Image src={playDarkIcon} alt="" />}
                variant={'outline'}
              >
                Resume break
              </Button>
            </>
          )}
          {!canInteract && isClockedIn && (
            <p className="text-gray-500 text-sm mt-4">
              Select today&apos;s date to manage breaks.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};
