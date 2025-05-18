'use client';

import React from 'react';
import { Header } from '@/components/organisms/Header';
import { TodaysWorkCard } from '@/components/organisms/dashboard/TodaysWorkCard';
import { TodaysBreakCard } from '@/components/organisms/dashboard/TodaysBreakCard';
import { WeekHistory } from '@/components/organisms/dashboard/WeekHisory';
import { DatePicker } from '@/components/molecules/DatePicker';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { formatDurationFromMs } from '@/lib/utils';
import useAlert from '@/hooks/useAlert';

import Stats from '@/components/organisms/dashboard/Stats';

// Mock data for header, replace with actual auth context or props
const MOCK_USER_DATA = {
  id: '1',
  name: 'Emmanuel Kemdirim',
  organizationName: 'CasualsHQ',
  avatarUrl: 'https://picsum.photos/id/237/200/300',
};

const StaffDashboardPage = () => {
  const alert = useAlert();
  const {
    selectedDate,
    setSelectedDate,
    isLoading,
    error,
    staffData,
    statsForSelectedDate,
    hoursWorkedThisWeek,
    weekHistory,
    activeSession,
    workTimerMs,
    breakTimerMs,
    handleClockIn,
    handleClockOut,
    handleStartBreak,
    handleEndBreak,
    isTodaySelected,
    breakTypes,
  } = useDashboardStats(MOCK_USER_DATA.id, new Date()); // Initialize with today's date

  if (error) {
    alert.showAlert(error.name, 'error', { subtext: error.message });
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-4 md:pb-4 md:px-8">
      <Header
        userName={MOCK_USER_DATA.name}
        organizationName={MOCK_USER_DATA.organizationName}
        userAvatar={MOCK_USER_DATA.avatarUrl}
        onSignOut={() => console.log('Sign Out Clicked')}
      />

      <main className="mt-10 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium mb-2 text-black">
              Welcome {MOCK_USER_DATA.name.split(' ')[0]},
            </h1>
            <p className="text-custom-gray">
              Let&apos;s get started on a productive day.
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 text-gray-700 mt-4 md:mt-0">
            <DatePicker
              variant="single"
              initialDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>

        <Stats
          staffData={staffData}
          activeSession={activeSession}
          hoursWorkedThisWeek={hoursWorkedThisWeek}
          statsForSelectedDate={statsForSelectedDate}
          isTodaySelected={isTodaySelected}
          isLoading={isLoading}
          breakTimerMs={breakTimerMs}
          workTimerMs={workTimerMs}
        />

        {/* Today's Work and Break Cards - only interactive if today is selected */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TodaysWorkCard
            // currentTime is the total work time for the day, including current segment
            currentTime={formatDurationFromMs(
              statsForSelectedDate.totalWorkMs +
                (!activeSession.isOnBreak && activeSession.isActive
                  ? workTimerMs
                  : 0)
            )}
            isClockedIn={activeSession.isActive}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            canInteract={isTodaySelected} // Pass this to enable/disable buttons
            showClockInButton={
              isTodaySelected &&
              !activeSession.isActive &&
              !statsForSelectedDate.clockedInAt
            }
          />
          <TodaysBreakCard
            // currentBreakTime is the total break time for the day, including current segment
            currentBreakTime={formatDurationFromMs(
              statsForSelectedDate.totalBreakMs +
                (activeSession.isOnBreak ? breakTimerMs : 0)
            )}
            isOnBreak={activeSession.isOnBreak}
            isClockedIn={activeSession.isActive} // Needed to determine if break can be started
            onStartBreak={handleStartBreak}
            onResumeWork={handleEndBreak}
            canInteract={isTodaySelected && activeSession.isActive} // Can only interact with breaks if clocked in and today
            breakTypes={breakTypes}
            // selectedBreakType can be managed internally in TodaysBreakCard or passed from hook if needed globally
          />
        </div>

        <WeekHistory history={weekHistory} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default StaffDashboardPage;
