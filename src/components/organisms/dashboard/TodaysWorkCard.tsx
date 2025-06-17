import { Button } from '@/components/molecules/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/molecules/Form';
import { Textarea } from '@/components/molecules/Textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import {   useState } from 'react';
import { useForm } from 'react-hook-form';
import { CockoutReasonData, CockoutReasonSchema } from '@/types';
import {
  evaluateWorkDurationFromTimeString,
} from '@/lib/utils';

import playIcon from '@/assets/staff/play.svg';
import stopIcon from '@/assets/staff/stop.svg';
import warningIcon from '@/assets/alert/warning-icon.svg';
import closeIcon from '@/assets/alert/close-icon.svg';

import WorkValue from './WorkValue';
import { parseISO } from 'date-fns';

export const TodaysWorkCard = ({
  expectedWorkHours,
  isLoading,
  clockedInAt,
  isClockedIn,
  showClockInButton,
  canInteract,
  onClockIn,
  clockInLoading,
  onClockOut,
  clockOutLoading,
  currentTime,
}: {
  isLoading: boolean;
  expectedWorkHours: number;
  clockedInAt: string;
  isClockedIn: boolean;
  showClockInButton: boolean;
  canInteract: boolean;
  onClockIn: () => void;
  clockInLoading: boolean;
  onClockOut: () => void;
  clockOutLoading: boolean;
  currentTime: string;
}) => {

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);
  const [sendRequest, setSendRequest] = useState(false);

  const handleInitiateAction = () => {
    setIsConfirmOpen(true);
    const start = parseISO(clockedInAt).getTime();
    const end = parseISO(new Date().toISOString()).getTime();

    const diffMs = end - start;

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0'
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    const formattedDuration = `${hours}:${minutes}:${seconds}`;
    const result = evaluateWorkDurationFromTimeString(
      formattedDuration,
      expectedWorkHours
    );
    if (typeof result === 'string') return setActionToConfirm('overTime');
    if (result) return setActionToConfirm('default');
    return setActionToConfirm('underTime');
  };

  const handleConfirm = () => {
    onClockOut();
    setIsConfirmOpen(false);
    setActionToConfirm(null);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
    setActionToConfirm(null);
    setSendRequest(false);
  };

  const form = useForm<CockoutReasonData>({
    resolver: zodResolver(CockoutReasonSchema),
    defaultValues: {
      reason: '',
    },
  });

  function onSubmit(values: CockoutReasonData) {
    console.log('Sign Up form submitted:', values);
    handleConfirm();
  }

  return (
    <>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        content={
          <>
            {actionToConfirm === 'underTime' && (
              <article className="grid grid-cols-[max-content_1fr_max-content] place-items-start gap-5 bg-[#FEF6E7] w-auto md:max-w-[21.438rem] rounded-[0.5rem] p-[1rem]">
                <span className="bg-white rounded-full flex w-[3rem] h-[3rem] items-center justify-center">
                  <Image src={warningIcon} alt="" />
                </span>
                <article className="space-y-3">
                  <h4 className="font-medium text-base text-black">Warning</h4>
                  <p className="text-[0.875rem] text-custom-gray">
                    You are trying to clock out before your scheduled time. Are
                    you sure you want to proceed?
                  </p>
                </article>
                <button onClick={handleCancel} type="button" className="">
                  <Image src={closeIcon} alt="" />
                </button>

                <div className="grid grid-cols-2 gap-4 col-span-full w-full mt-3">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleCancel}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleConfirm}
                    className="w-full"
                  >
                    Yes, proceed
                  </Button>
                </div>
              </article>
            )}

            {actionToConfirm === 'default' && (
              <article className="p-5 bg-white rounded-[0.5rem]">
                <article className="space-y-3">
                  <h4 className="font-medium text-base text-black">
                    Clock out?
                  </h4>
                  <p className="text-[0.875rem] text-custom-gray">
                    Are you sure you want to clock out?
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
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleConfirm}
                    className="w-full"
                  >
                    Clock out
                  </Button>
                </div>
              </article>
            )}

            {actionToConfirm === 'overTime' && (
              <article className="grid grid-cols-[max-content_1fr_max-content] place-items-start gap-5 bg-[#FEF6E7] w-auto md:max-w-[21.438rem] rounded-[0.5rem] p-[1rem]">
                <span className="bg-white rounded-full flex w-[3rem] h-[3rem] items-center justify-center">
                  <Image src={warningIcon} alt="" />
                </span>

                <article className="space-y-3">
                  <h4 className="font-medium text-base text-black">Warning</h4>
                  <p className="text-[0.875rem] text-custom-gray">
                    You have worked{' '}
                    {evaluateWorkDurationFromTimeString(currentTime)} over your
                    allocated shift. Do you want to request overtime?
                  </p>
                </article>

                <button onClick={handleCancel} type="button" className="">
                  <Image src={closeIcon} alt="" />
                </button>

                {!sendRequest && (
                  <div className="grid grid-cols-2 gap-4 mt-3 col-span-full w-full">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleCancel}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setSendRequest(true)}
                      className="w-full"
                    >
                      Yes, proceed
                    </Button>
                  </div>
                )}

                {sendRequest && (
                  <div className="grid col-span-full w-full mt-3">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter reason for request"
                                  className="w-full bg-white min-h-[6rem] placeholder:text-[#98A2B3]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <Button
                            variant="outline"
                            size="md"
                            onClick={handleCancel}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="md"
                            type="submit"
                            className="w-full"
                          >
                            Send request
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}
              </article>
            )}
          </>
        }
      />

      <Card className="border-olive-100 flex flex-col min-h-[250px]">
        <CardHeader>
          <CardTitle className="text-base font-medium text-gray-700">
            Today&apos;s work hours
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center flex-grow text-center">
          {showClockInButton && canInteract ? (
            <>
              <p className="font-medium text-[1.125rem] text-center px-4 max-w-[35ch] py-20">
                Click on the &ldquo;Clock in&rdquo; button below to begin
                tracking your hours today.
              </p>
              <Button
                size="lg"
                onClick={onClockIn}
                disabled={!canInteract || clockInLoading || isLoading}
                leftIcon={<Image src={playIcon} alt="" />}
              >
                {clockInLoading ? 'Please wait' : 'Clock in'}
              </Button>
            </>
          ) : isClockedIn ? (
            <>
              <div className="text-[3rem] font-medium text-gray-800 mb-6 tabular-nums py-20">
                <WorkValue clockedInAt={clockedInAt} />
              </div>

              <Button
                size="lg"
                onClick={handleInitiateAction}
                disabled={!canInteract || clockOutLoading}
                leftIcon={<Image src={stopIcon} alt="" />}
              >
                {clockOutLoading ? 'Please wait' : 'Clock out'}
              </Button>
            </>
          ) : (
            <>
              <div className="text-[3rem] font-medium text-black mb-6 tabular-nums">
                {!showClockInButton && !canInteract ? (
                  <p className="font-medium text-[1.125rem] text-center px-4 max-w-[35ch] py-20">
                    Click on the &ldquo;Clock in&rdquo; button below to begin
                    tracking your hours today.
                  </p>
                ) : (
                  <WorkValue clockedInAt={clockedInAt} />
                )}
              </div>
              <p className="text-gray-500 text-sm">
                {canInteract
                  ? 'You are not clocked in.'
                  : "Select today's date to track time."}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
