import { useState } from 'react';

type ViewMode = 'month' | 'week';

interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'published' | 'draft';
  color: string;
}

const mockPosts: ScheduledPost[] = [
  {
    id: '1',
    title: 'Product Launch Post',
    platform: 'Facebook',
    date: new Date(2026, 0, 10),
    time: '10:00 AM',
    status: 'scheduled',
    color: '#1877F2',
  },
  {
    id: '2',
    title: 'Weekly Update',
    platform: 'Instagram',
    date: new Date(2026, 0, 12),
    time: '2:30 PM',
    status: 'scheduled',
    color: '#E4405F',
  },
  {
    id: '3',
    title: 'Team Announcement',
    platform: 'Twitter',
    date: new Date(2026, 0, 15),
    time: '9:00 AM',
    status: 'draft',
    color: '#000000',
  },
];

export default function Scheduler() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts] = useState<ScheduledPost[]>(mockPosts);

  // Date constraints: today -30 to today +30
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 30);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getWeekDays = (date: Date) => {
    const days = [];
    const currentDay = new Date(date);
    const dayOfWeek = currentDay.getDay();
    const diff = currentDay.getDate() - dayOfWeek;

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDay);
      day.setDate(diff + i);
      days.push(day);
    }

    return days;
  };

  const isDateInRange = (date: Date) => {
    return date >= minDate && date <= maxDate;
  };

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter(
      (post) =>
        post.date.getDate() === date.getDate() &&
        post.date.getMonth() === date.getMonth() &&
        post.date.getFullYear() === date.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    if (isDateInRange(newDate)) {
      setCurrentDate(newDate);
    }
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    if (isDateInRange(newDate)) {
      setCurrentDate(newDate);
    }
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    if (isDateInRange(newDate)) {
      setCurrentDate(newDate);
    }
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    if (isDateInRange(newDate)) {
      setCurrentDate(newDate);
    }
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-32 bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const inRange = isDateInRange(date);
      const isTodayDate = isToday(date);
      const dayPosts = getPostsForDate(date);

      days.push(
        <div
          key={day}
          className={`min-h-32 border border-gray-200 p-2 ${
            !inRange ? 'bg-gray-100 opacity-50' : 'bg-white hover:bg-gray-50'
          } ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`text-sm font-semibold ${
                isTodayDate
                  ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                  : 'text-gray-900'
              }`}
            >
              {day}
            </span>
            {inRange && (
              <button
                className="text-gray-400 hover:text-blue-600"
                title="Add post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="space-y-1">
            {dayPosts.map((post) => (
              <div
                key={post.id}
                className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                style={{ backgroundColor: `${post.color}20`, borderLeft: `3px solid ${post.color}` }}
                title={`${post.time} - ${post.title}`}
              >
                <div className="font-medium truncate">{post.time}</div>
                <div className="truncate">{post.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex border border-gray-200">
        {/* Time column */}
        <div className="w-20 flex-shrink-0">
          <div className="h-16 border-b border-gray-200"></div>
          {hours.map((hour) => (
            <div key={hour} className="h-16 border-b border-gray-200 px-2 py-1 text-xs text-gray-600">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, index) => {
            const inRange = isDateInRange(day);
            const isTodayDate = isToday(day);
            const dayPosts = getPostsForDate(day);

            return (
              <div key={index} className="border-l border-gray-200">
                {/* Day header */}
                <div
                  className={`h-16 border-b border-gray-200 p-2 text-center ${
                    isTodayDate ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="text-xs text-gray-600 font-medium">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div
                    className={`text-lg font-semibold mt-1 ${
                      isTodayDate
                        ? 'bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto'
                        : 'text-gray-900'
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>

                {/* Hour cells */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`h-16 border-b border-gray-200 relative ${
                      !inRange ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {dayPosts
                      .filter((post) => {
                        const postHour = parseInt(post.time.split(':')[0]);
                        const isPM = post.time.includes('PM');
                        const adjustedHour = isPM && postHour !== 12 ? postHour + 12 : postHour;
                        return adjustedHour === hour;
                      })
                      .map((post) => (
                        <div
                          key={post.id}
                          className="absolute inset-x-1 top-1 p-1 rounded text-xs cursor-pointer hover:opacity-80"
                          style={{
                            backgroundColor: `${post.color}20`,
                            borderLeft: `3px solid ${post.color}`,
                          }}
                        >
                          <div className="font-medium truncate">{post.title}</div>
                          <div className="text-gray-600">{post.time}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Scheduler</h1>
          <p className="text-gray-600 mt-1">Plan and schedule your social media posts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Schedule Post
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={viewMode === 'month' ? goToPreviousMonth : goToPreviousWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={viewMode === 'month' ? goToNextMonth : goToNextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Current Date Display */}
            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-4">
          {viewMode === 'month' ? (
            <>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              {/* Month grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">{renderMonthView()}</div>
            </>
          ) : (
            <div className="overflow-x-auto">{renderWeekView()}</div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-blue-900">Scheduling Range</p>
          <p className="text-sm text-blue-700 mt-1">
            You can schedule posts from {minDate.toLocaleDateString()} to {maxDate.toLocaleDateString()} (30 days before and after today).
          </p>
        </div>
      </div>
    </div>
  );
}
