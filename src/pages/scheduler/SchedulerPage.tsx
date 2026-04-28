import React, { useState } from 'react';
import MeetingCalendar from '../../components/calendar/MeetingCalendar';
import MeetingRequests from '../../components/calendar/MeetingRequests';
import AvailabilitySlots from '../../components/calendar/AvailabilitySlots';
import ConfirmedMeetings from '../../components/calendar/ConfirmedMeetings';

const tabs = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'availability', label: 'Availability' },
  { id: 'requests', label: 'Requests' },
  { id: 'confirmed', label: 'Confirmed' },
];

export const SchedulerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Scheduler</h1>
          <p className="text-gray-600 mt-1">
            Manage your availability, send and receive meeting requests
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'calendar' && <MeetingCalendar />}
        {activeTab === 'availability' && <AvailabilitySlots />}
        {activeTab === 'requests' && <MeetingRequests />}
        {activeTab === 'confirmed' && <ConfirmedMeetings />}
      </div>
    </div>
  );
};
