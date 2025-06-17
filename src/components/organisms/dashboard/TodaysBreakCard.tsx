import { Button } from '@/components/molecules/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import React, { useEffect, useState } from 'react'; // Added useState for local break type selection
import playDarkIcon from '@/assets/staff/play-dark.svg';
import Image from 'next/image';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';

import { BreakType } from '@/types/dashboard';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';

import useAlert from '@/hooks/useAlert';
import { useLazyQuery } from '@apollo/client';
import { GET_BREAK_TYPES } from '@/graphql/queries';
import BreakValue from './BreakValue';

export const TodaysBreakCard = ({
  isClockedIn,
  setSelectedBreakType,
  selectedBreakType,
  canInteract,
  isOnBreak,
  breakStartedAt,
  onBreakStart,
  startBreakLoading,
  onBreakEnd,
  endBreakLoading,
}: {
  isClockedIn: boolean;
  setSelectedBreakType: (breakType: BreakType) => void;
  selectedBreakType: BreakType;
  canInteract: boolean;
  isOnBreak: boolean;
  breakStartedAt: string;
  onBreakStart: () => void;
  startBreakLoading: boolean;
  onBreakEnd: () => void;
  endBreakLoading: boolean;
}) => {
  const alert = useAlert();

  const [breakTypes, setBreakTypes] = useState<BreakType[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const onResumeWork = () => {
    onBreakEnd();
  };

  const handleInitiateAction = () => {
    if (selectedBreakType.id) setIsConfirmOpen(true);
    else
      alert.showAlert('No break type selected', 'info', {
        subtext: 'Please select a break type',
      });
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
      onBreakStart();
    }
  };

  // Queries
  const [getBreakTypes] = useLazyQuery(GET_BREAK_TYPES, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: (data) => {
      setBreakTypes(data.breakTypes);
    },
  });

  useEffect(() => {
    getBreakTypes();
  }, []);

  return (
    <>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        content={
          <article className="p-5 bg-white rounded-2xl border">
            <article className="space-y-3">
              <h4 className="font-medium text-2xl text-black">Start break?</h4>
              <p className="text-base text-custom-gray">
                Are you sure you want to start your break?
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
                value={selectedBreakType.id}
                onValueChange={(value) =>
                  setSelectedBreakType(
                    breakTypes.find((type) => type.id === value) as BreakType
                  )
                }
                disabled={!canInteract || !isClockedIn || isOnBreak}
              >
                <SelectTrigger className="h-9 text-base">
                  <SelectValue placeholder="Break type" />
                </SelectTrigger>
                <SelectContent>
                  {breakTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="text-base"
                    >
                      {type.name}
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
                <BreakValue breakStartedAt={breakStartedAt} />
              </div>
              <Button
                size="lg"
                onClick={onResumeWork}
                disabled={!canInteract || endBreakLoading}
                leftIcon={<Image src={playDarkIcon} alt="" />}
                variant={'outline'}
              >
                {endBreakLoading ? 'Please wait' : 'End break'}
              </Button>
            </>
          ) : (
            <>
              <div
                className={`text-5xl font-medium mb-6 tabular-nums py-20 ${
                  !isClockedIn || !canInteract ? 'text-black' : 'text-black'
                }`}
              >
                {!isClockedIn || !canInteract ? (
                  <p className="font-medium text-lg text-center px-4 max-w-[30ch]">
                    You can start break after you have clocked in for the day.
                  </p>
                ) : (
                  <BreakValue breakStartedAt={breakStartedAt} />
                )}
              </div>

              <Button
                size="lg"
                onClick={handleInitiateAction}
                disabled={!canInteract || !isClockedIn || startBreakLoading}
                leftIcon={<Image src={playDarkIcon} alt="" />}
                variant={'outline'}
              >
                {startBreakLoading ? 'Please wait' : 'Start break'}
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
