import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface Meeting {
  id: number;
  date: string;
  title: string;
  time: string;
  with: string;
  type: 'investor' | 'entrepreneur';
}

const INITIAL_MEETINGS: Meeting[] = [
  { id: 1, date: '2026-04-14', title: 'Pitch Review', time: '10:00 AM', with: 'Ali Khan', type: 'investor' },
  { id: 2, date: '2026-04-16', title: 'Due Diligence', time: '2:00 PM', with: 'Sara Ahmed', type: 'entrepreneur' },
  { id: 3, date: '2026-04-21', title: 'Partnership Call', time: '11:00 AM', with: 'John Smith', type: 'investor' },
  { id: 4, date: '2026-04-28', title: 'Contract Review', time: '3:30 PM', with: 'Maria Lopez', type: 'entrepreneur' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const MeetingCalendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '', time: '', with: '', type: 'investor' as 'investor' | 'entrepreneur',
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const formatDate = (day: number) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const getMeetingsForDay = (day: number) =>
    meetings.filter(m => m.date === formatDate(day));

  const handleAddMeeting = () => {
    if (!selectedDate || !newMeeting.title || !newMeeting.time || !newMeeting.with) return;
    setMeetings(prev => [...prev, { id: Date.now(), date: selectedDate, ...newMeeting }]);
    setNewMeeting({ title: '', time: '', with: '', type: 'investor' });
    setShowAddModal(false);
  };

  const selectedMeetings = selectedDate ? meetings.filter(m => m.date === selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-base font-semibold text-gray-900">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateStr = formatDate(day);
                const dayMeetings = getMeetingsForDay(day);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`relative min-h-[56px] p-1 rounded-lg border text-left transition-all
                      ${isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                    <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-0.5
                      ${isToday ? 'bg-primary-600 text-white' : 'text-gray-700'}
                    `}>
                      {day}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      {dayMeetings.slice(0, 2).map(m => (
                        <div key={m.id} className={`text-[9px] px-1 py-0.5 rounded truncate font-medium
                          ${m.type === 'investor'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-secondary-100 text-secondary-700'}
                        `}>
                          {m.title}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <span className="text-[9px] text-gray-400">+{dayMeetings.length - 2}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500" /> Investor
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary-500" /> Entrepreneur
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Side Panel */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {selectedDate
                  ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long', month: 'short', day: 'numeric',
                    })
                  : 'Select a date'}
              </h3>
              {selectedDate && (
                <Button
                  size="sm"
                  onClick={() => setShowAddModal(true)}
                  leftIcon={<Plus size={14} />}
                >
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {!selectedDate && (
              <p className="text-sm text-gray-400 text-center py-8">
                Click a date to view or add meetings
              </p>
            )}
            {selectedDate && selectedMeetings.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No meetings this day</p>
            )}
            <div className="flex flex-col gap-2">
              {selectedMeetings.map(m => (
                <div key={m.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">with {m.with}</p>
                    <p className="text-xs text-primary-600 mt-1 font-medium">{m.time}</p>
                  </div>
                  <button
                    onClick={() => setMeetings(prev => prev.filter(x => x.id !== m.id))}
                    className="text-gray-300 hover:text-error-500 transition-colors ml-2"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Stats */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">This Month</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {meetings.filter(m =>
                    m.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)
                  ).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total</p>
              </div>
              <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-secondary-600">3</p>
                <p className="text-xs text-gray-500 mt-1">Confirmed</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Add Meeting</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Meeting Title</label>
                <input
                  type="text" placeholder="e.g. Pitch Review"
                  value={newMeeting.title}
                  onChange={e => setNewMeeting(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">With (Name)</label>
                <input
                  type="text" placeholder="e.g. John Smith"
                  value={newMeeting.with}
                  onChange={e => setNewMeeting(p => ({ ...p, with: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time" value={newMeeting.time}
                  onChange={e => setNewMeeting(p => ({ ...p, time: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newMeeting.type}
                  onChange={e => setNewMeeting(p => ({ ...p, type: e.target.value as 'investor' | 'entrepreneur' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="investor">Investor Meeting</option>
                  <option value="entrepreneur">Entrepreneur Meeting</option>
                </select>
              </div>
              <div className="flex gap-3 mt-1">
                <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleAddMeeting}>Add Meeting</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingCalendar;
