import React from 'react';
import { Calendar, Clock, Video, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface Meeting {
  id: number;
  title: string;
  with: string;
  role: 'Investor' | 'Entrepreneur';
  date: string;
  time: string;
  duration: string;
  location: 'Video Call' | 'In Person' | 'Phone';
  notes?: string;
}

const CONFIRMED: Meeting[] = [
  {
    id: 1, title: 'Series A Investment Discussion', with: 'Ahmad Raza', role: 'Investor',
    date: '2026-04-18', time: '10:00 AM', duration: '60 min', location: 'Video Call',
    notes: 'Prepare pitch deck and financial projections.',
  },
  {
    id: 2, title: 'Product Demo & Partnership', with: 'Sarah Johnson', role: 'Entrepreneur',
    date: '2026-04-20', time: '2:00 PM', duration: '45 min', location: 'Video Call',
  },
  {
    id: 3, title: 'Due Diligence Review', with: 'Carlos Rivera', role: 'Investor',
    date: '2026-04-25', time: '11:00 AM', duration: '90 min', location: 'In Person',
    notes: 'Bring all legal documents and contracts.',
  },
  {
    id: 4, title: 'Quarterly Portfolio Review', with: 'Maria Lopez', role: 'Entrepreneur',
    date: '2026-04-28', time: '3:00 PM', duration: '30 min', location: 'Phone',
  },
];

const ConfirmedMeetings: React.FC = () => {
  const now = new Date();
  const upcoming = CONFIRMED.filter(m => new Date(m.date) >= now);
  const past = CONFIRMED.filter(m => new Date(m.date) < now);

  const locationBadge = (loc: Meeting['location']) => {
    if (loc === 'Video Call') return <Badge variant="primary"><Video size={10} className="mr-1" />{loc}</Badge>;
    if (loc === 'In Person') return <Badge variant="success"><MapPin size={10} className="mr-1" />{loc}</Badge>;
    return <Badge variant="warning"><Clock size={10} className="mr-1" />{loc}</Badge>;
  };

  const MeetingCard = ({ m }: { m: Meeting }) => (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar name={m.with} size="md" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-sm font-semibold text-gray-900">{m.title}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                with <span className="font-medium text-gray-700">{m.with}</span>
                <span className="mx-1.5">·</span>
                <Badge variant={m.role === 'Investor' ? 'primary' : 'secondary'}>{m.role}</Badge>
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap mb-2">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(m.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {m.time} · {m.duration}
                </span>
                {locationBadge(m.location)}
              </div>
              {m.notes && (
                <div className="bg-accent-50 border border-accent-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-accent-700">📝 {m.notes}</p>
                </div>
              )}
            </div>
          </div>
          {m.location === 'Video Call' && (
            <Button size="sm" leftIcon={<Video size={13} />} rightIcon={<ExternalLink size={13} />}>
              Join
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Confirmed Meetings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Your scheduled and confirmed meetings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: CONFIRMED.length, variant: 'primary' },
          { label: 'Upcoming', value: upcoming.length, variant: 'success' },
          { label: 'Completed', value: past.length, variant: 'default' },
        ].map(s => (
          <Card key={s.label}>
            <CardBody>
              <div className="text-center">
                <p className={`text-3xl font-bold ${
                  s.variant === 'primary' ? 'text-primary-600'
                    : s.variant === 'success' ? 'text-secondary-600'
                    : 'text-gray-500'
                }`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-secondary-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-500 inline-block" />
            Upcoming ({upcoming.length})
          </h3>
          {upcoming.map(m => <MeetingCard key={m.id} m={m} />)}
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="space-y-3 opacity-60">
          <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            Completed ({past.length})
          </h3>
          {past.map(m => <MeetingCard key={m.id} m={m} />)}
        </div>
      )}
    </div>
  );
};

export default ConfirmedMeetings;
