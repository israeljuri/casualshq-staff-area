'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/organisms/Header';
import { TodaysWorkCard } from '@/components/organisms/dashboard/TodaysWorkCard';
import { TodaysBreakCard } from '@/components/organisms/dashboard/TodaysBreakCard';
import { WeekHistory } from '@/components/organisms/dashboard/WeekHisory';
import { DatePicker } from '@/components/molecules/DatePicker';

import Stats from '@/components/organisms/dashboard/Stats';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  GET_TIMESHEETS,
  GET_BUSINESS,
  GET_BREAK_TYPES,
  GET_USER,
} from '@/graphql/queries';
import {
  getTimesheetForDate,
  getTotalBreakDurationFormatted,
} from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import useAlert from '@/hooks/useAlert';
import { getCookie } from 'cookies-next';
import {
  CLOCKIN,
  CLOCKOUT,
  END_BREAK,
  LOGOUT,
  START_BREAK,
} from '@/graphql/mutations';
import { BreakType, Timesheet } from '@/types/dashboard';
import { useRouter } from 'next/navigation';
import { usePagination } from '@/hooks/usePagination';

const StaffDashboardPage = () => {
  const router = useRouter();
  const alert = useAlert();
  const pageSize = 7;

  const [user, setUser] = useState({
    first_name: 'Anonymous',
    last_name: 'User',
  });
  // states
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [stats, setStats] = React.useState({
    clockedInAt: '--:--',
    breakTaken: {
      value: '--:--',
      expectDuration: '(0 min)',
    },
    hoursWorked: {
      value: '--:--',
      expectDuration: '(0 min)',
    },
    hoursThisWeek: {
      value: '--:--',
      expectDuration: '(0 min)',
    },
  });
  const [currentTime] = useState<string>('');
  const [clockedInAt, setClockedInAt] = useState<string>('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [showClockInButton, setShowClockInButton] = useState(true);
  const [canInteract, setCanInteract] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartedAt, setBreakStartedAt] = useState<string>('');
  const [selectedBreakType, setSelectedBreakType] = useState<BreakType>({
    id: '',
    name: '',
    duration_minutes: '',
    is_paid: false,
  });

  // Get business for business config usage
  const { data: businessData } = useQuery(GET_BUSINESS);

  // Get break types
  const { data: breakTypesData } = useQuery(GET_BREAK_TYPES);

  // Timesheet query
  const [getTimesheets, { data: timesheetsData, loading: timesheetsLoading }] =
    useLazyQuery(GET_TIMESHEETS);

  // User Query
  const [getUser] = useLazyQuery(GET_USER, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: (data) => {
      setUser({
        first_name:
          data.staffMember.staff_information.personal_information.first_name,
        last_name:
          data.staffMember.staff_information.personal_information.last_name,
      });
    },
  });

  // Logout Mutation
  const [logout, { loading: logoutLoading }] = useMutation(LOGOUT, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: () => {
      router.replace('/sign-in');
    },
  });

  // Clock in mutation
  const [clockIn, { loading: clockInLoading }] = useMutation(CLOCKIN, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: (data) => {
      alert.showAlert('Clock in', 'success', {
        subtext: 'You have successfully clocked in',
      });
      setClockedInAt(data.clockIn.time_in);
      setIsClockedIn(true);
      setShowClockInButton(false);
      setCanInteract(true);
    },
    update: (cache, { data }) => {
      // if (!businessData) return;

      // const paymentFrequency =
      //   businessData?.business?.business_config?.work_policies
      //     ?.payment_frequency;
      // const paymentPeriodStartDay =
      //   businessData?.business?.business_config?.work_policies
      //     ?.payment_period_start_day;
      // const { periodStart, periodEnd } = getPeriodRange(
      //   new Date().toISOString(),
      //   paymentFrequency || 'WEEKLY',
      //   paymentPeriodStartDay || 'MONDAY'
      // );

      const getStartDate = () => {
        if (dateRange?.from) return dateRange.from;
        // if (periodStart) return periodStart;
        return null;
      };

      const getEndDate = () => {
        if (dateRange?.to) return dateRange.to;
        // if (periodEnd) return periodEnd;
        return null;
      };

      const timesheets: { timesheets: Timesheet[] } | null = cache.readQuery({
        query: GET_TIMESHEETS,
        variables: {
          filter: {
            start_date: getStartDate() || '',
            end_date: getEndDate() || '',
            scope: 'STAFF',
            staff_id: getCookie('user_id') || '',
            current_period: getStartDate() ? false : true,
          },
        },
      });

      console.log('timesheets', timesheets);
      console.log('data', data);

      cache.writeQuery({
        query: GET_TIMESHEETS,
        variables: {
          filter: {
            start_date: getStartDate() || '',
            end_date: getEndDate() || '',
            scope: 'STAFF',
            staff_id: getCookie('user_id') || '',
            current_period: getStartDate() ? false : true,
          },
        },
        data: {
          timesheets: [data.clockIn, ...(timesheets?.timesheets || [])],
        },
      });
    },
  });

  // Clock out mutation
  const [clockOut, { loading: clockOutLoading }] = useMutation(CLOCKOUT, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: () => {
      alert.showAlert('Clock out', 'success', {
        subtext: 'You have successfully clocked out',
      });
      setClockedInAt('');
      setIsClockedIn(false);
      setShowClockInButton(true);
      setCanInteract(true);
    },
    update: (cache, { data }) => {
      // if (!businessData) return;

      // const paymentFrequency =
      //   businessData?.business?.business_config?.work_policies
      //     ?.payment_frequency;
      // const paymentPeriodStartDay =
      //   businessData?.business?.business_config?.work_policies
      //     ?.payment_period_start_day;
      // const { periodStart, periodEnd } = getPeriodRange(
      //   new Date().toISOString(),
      //   paymentFrequency || 'WEEKLY',
      //   paymentPeriodStartDay || 'MONDAY'
      // );

      const getStartDate = () => {
        if (dateRange?.from) return dateRange.from;
        // if (periodStart) return periodStart;
        return null;
      };

      const getEndDate = () => {
        if (dateRange?.to) return dateRange.to;
        // if (periodEnd) return periodEnd;
        return null;
      };

      const timesheets: { timesheets: Timesheet[] } | null = cache.readQuery({
        query: GET_TIMESHEETS,
        variables: {
          filter: {
            start_date: getStartDate() || '',
            end_date: getEndDate() || '',
            scope: 'STAFF',
            staff_id: getCookie('user_id') || '',
            current_period: getStartDate() ? false : true,
          },
        },
      });

      const updatedTimesheets = timesheets?.timesheets?.map((timesheet) => {
        if (timesheet.id === data.clockOut.id) {
          return data.clockOut;
        }
        return timesheet;
      });

      cache.writeQuery({
        query: GET_TIMESHEETS,
        variables: {
          filter: {
            start_date: getStartDate() || '',
            end_date: getEndDate() || '',
            scope: 'STAFF',
            staff_id: getCookie('user_id') || '',
            current_period: getStartDate() ? false : true,
          },
        },
        data: {
          timesheets: updatedTimesheets,
        },
      });
    },
  });

  // Start break mutation
  const [startBreak, { loading: startBreakLoading }] = useMutation(
    START_BREAK,
    {
      variables: {
        breakTypeId: selectedBreakType?.id,
      },
      onError: (error) => {
        alert.showAlert(error.name, 'error', {
          subtext: error.message,
        });
      },
      onCompleted: (data) => {
        alert.showAlert('Break started', 'success', {
          subtext: 'You have successfully started a break',
        });
        setBreakStartedAt(data.startBreak.break_start);
        setIsOnBreak(true);
        setIsClockedIn(true);
        setCanInteract(true);
      },
    }
  );

  // End break mutation
  const [endBreak, { loading: endBreakLoading }] = useMutation(END_BREAK, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: () => {
      alert.showAlert('Break ended', 'success', {
        subtext: 'You have successfully ended a break',
      });
      setBreakStartedAt('');
      setIsOnBreak(false);
      setIsClockedIn(true);
      setCanInteract(true);
    },
    refetchQueries: [
      {
        query: GET_TIMESHEETS,
        variables: {
          filter: { scope: 'STAFF', staff_id: getCookie('user_id') || '' },
        },
      },
    ],
  });

  useEffect(() => {
    const userId = getCookie('user_id');
    if (userId) {
      getUser({ variables: { staffMemberId: userId } });
    }
  }, []);

  useEffect(() => {
    if (!timesheetsData) return;
    if (!breakTypesData) return;

    const todayTimesheet = getTimesheetForDate(
      timesheetsData.timesheets,
      dateRange?.from ? dateRange.from : new Date()
    );

    const expectedWorkHours =
      businessData?.business?.business_config?.work_policies?.work_hours || 8;
    const expectedBreakHours =
      getTotalBreakDurationFormatted(todayTimesheet?.break_sessions || []) || 0;
    const expectedHoursThisWeek = expectedWorkHours * 5;

    setStats((prev) => ({
      ...prev,
      clockedInAt: todayTimesheet?.time_in
        ? format(todayTimesheet?.time_in, 'h:mm a')
        : '--:--',
      breakTaken: {
        value: todayTimesheet?.total_break
          ? `${todayTimesheet?.total_break} mins`
          : '--:--',
        expectDuration: `(${expectedBreakHours})`,
      },
      hoursWorked: {
        value: todayTimesheet?.total_hours
          ? `${Math.round(Number(todayTimesheet?.total_hours))} hours`
          : '--:--',
        expectDuration: `(${expectedWorkHours} hours)`,
      },
      hoursThisWeek: {
        value: todayTimesheet?.total_hours
          ? `${Math.round(Number(todayTimesheet?.total_hours))} hours`
          : '--:--',
        expectDuration: `(${expectedHoursThisWeek} hours)`,
      },
    }));
  }, [timesheetsData, breakTypesData]);

  useEffect(() => {
    // if (!businessData) return;

    // const paymentFrequency =
    //   businessData?.business?.business_config?.work_policies?.payment_frequency;
    // const paymentPeriodStartDay =
    //   businessData?.business?.business_config?.work_policies
    //     ?.payment_period_start_day;
    // const { periodStart, periodEnd } = getPeriodRange(
    //   new Date().toISOString(),
    //   paymentFrequency || 'WEEKLY',
    //   paymentPeriodStartDay || 'MONDAY'
    // );

    const getStartDate = () => {
      if (dateRange?.from) return dateRange.from;
      // if (periodStart) return periodStart;
      return null;
    };

    const getEndDate = () => {
      if (dateRange?.to) return dateRange.to;
      // if (periodEnd) return periodEnd;
      return null;
    };

    // Call the timesheet query with filters
    getTimesheets({
      variables: {
        filter: {
          start_date: getStartDate() || '',
          end_date: getEndDate() || '',
          scope: 'STAFF',
          staff_id: getCookie('user_id') || '',
          current_period: getStartDate() ? false : true,
        },
      },
    });
  }, [getTimesheets, dateRange]);

  useEffect(() => {
    if (!timesheetsData) return;
    const todayTimesheet = getTimesheetForDate(
      timesheetsData?.timesheets,
      new Date()
    );
    if (todayTimesheet) {
      if (todayTimesheet.time_out) {
        setClockedInAt('');
        setIsClockedIn(false);
        setCanInteract(true);
        setShowClockInButton(true);
      } else {
        setClockedInAt(todayTimesheet.time_in);
        setIsClockedIn(true);
        setCanInteract(true);
        setShowClockInButton(false);

        if (
          !todayTimesheet?.break_sessions[0]?.break_end &&
          todayTimesheet?.break_sessions[0]?.break_start
        ) {
          setIsOnBreak(true);
          setBreakStartedAt(todayTimesheet?.break_sessions[0]?.break_start);
        }
      }
    }
  }, [timesheetsData]);

  const listPagination = usePagination(
    timesheetsData?.timesheets || [],
    pageSize
  );

  return (
    <div className="min-h-screen bg-white px-4 pb-4 md:pb-4 md:px-8">
      <Header />

      <main className="mt-10 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-[1.5rem] font-medium mb-2 text-black">
              Welcome {user?.first_name} {user?.last_name},
            </h1>
            <p className="text-custom-gray text-[0.875rem]">
              Let&apos;s get started on a productive day.
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-gray-700 mt-4 md:mt-0">
            <DatePicker
              variant="range"
              initialDateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>

        <Stats isLoading={timesheetsLoading} {...stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TodaysWorkCard
            expectedWorkHours={
              businessData?.business?.business_config?.work_policies?.work_hours
            }
            isLoading={timesheetsLoading}
            clockedInAt={clockedInAt}
            currentTime={currentTime}
            isClockedIn={isClockedIn}
            showClockInButton={showClockInButton}
            canInteract={canInteract}
            onClockIn={clockIn}
            clockInLoading={clockInLoading}
            onClockOut={() => {
              clockOut();
              logout();
            }}
            clockOutLoading={clockOutLoading || logoutLoading}
          />

          <TodaysBreakCard
            isClockedIn={isClockedIn}
            canInteract={canInteract}
            isOnBreak={isOnBreak}
            breakStartedAt={breakStartedAt}
            onBreakStart={startBreak}
            setSelectedBreakType={setSelectedBreakType}
            selectedBreakType={selectedBreakType}
            startBreakLoading={startBreakLoading}
            onBreakEnd={endBreak}
            endBreakLoading={endBreakLoading}
          />
        </div>

        <WeekHistory
          isLoading={timesheetsLoading}
          timesheets={listPagination.paginatedData as Timesheet[]}
          currentPage={listPagination.currentPage}
          totalPages={listPagination.totalPages}
          onPageChange={listPagination.setCurrentPage}
          totalItems={listPagination.totalCount}
          pageSize={pageSize}
        />
      </main>
    </div>
  );
};

export default StaffDashboardPage;
