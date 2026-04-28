import React, { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Slot {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const INITIAL_SLOTS: Slot[] = [
  { id: 1, day: 'Monday', startTime: '09:00', endTime: '11:00', recurring: true },
  { id: 2, day: 'Wednesday', startTime: '14:00', endTime: '16:00', recurring: true },
  { id: 3, day: 'Friday', startTime: '10:00', endTime: '12:00', recurring: false },
];

const AvailabilitySlots: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [showForm, setShowForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday', startTime: '09:00', endTime: '10:00', recurring: false,
  });

  const addSlot = () => {
    setSlots(prev => [...prev, { id: Date.now(), ...newSlot }]);
    setNewSlot({ day: 'Monday', startTime: '09:00', endTime: '10:00', recurring: false });
    setShowForm(false);
  };

  const removeSlot = (id: number) => setSlots(prev => prev.filter(s => s.id !== id));

  const toggleRecurring = (id: number) =>
    setSlots(prev => prev.map(s => s.id === id ? { ...s, recurring: !s.recurring } : s));

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Availability Slots</h2>
          <p className="text-sm text-gray-500 mt-0.5">Set when you're available for meetings</p>
        </div>
        <Button onClick={() => setShowForm(true)} leftIcon={<Plus size={16} />}>
          Add Slot
        </Button>
      </div>

      {DAYS_OF_WEEK.map(day => {
        const daySlots = slots.filter(s => s.day === day);
        if (!daySlots.length) return null;
        return (
          <Card key={day}>
            <CardHeader>
              <h3 className="text-sm font-semibold text-primary-700">{day}</h3>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-2">
                {daySlots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Clock size={15} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <Badge variant={slot.recurring ? 'success' : 'default'}>
                        {slot.recurring ? 'Recurring' : 'One-time'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleRecurring(slot.id)}
                        className="text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => removeSlot(slot.id)}
                        className="text-gray-300 hover:text-error-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        );
      })}

      {slots.length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-12 text-gray-400">
              <Clock size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No availability slots set</p>
              <p className="text-xs mt-1">Add slots so others can book meetings with you</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Add Slot Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Add Availability Slot</h3>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={newSlot.day}
                  onChange={e => setNewSlot(p => ({ ...p, day: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start</label>
                  <input type="time" value={newSlot.startTime}
                    onChange={e => setNewSlot(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">End</label>
                  <input type="time" value={newSlot.endTime}
                    onChange={e => setNewSlot(p => ({ ...p, endTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newSlot.recurring}
                  onChange={e => setNewSlot(p => ({ ...p, recurring: e.target.checked }))}
                  className="w-4 h-4 accent-primary-600"
                />
                <span className="text-sm text-gray-700">Recurring every week</span>
              </label>
              <div className="flex gap-3 mt-1">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={addSlot}>Add Slot</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySlots;
