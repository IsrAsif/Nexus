import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import VideoCallUI from '../../components/videocall/VideoCallUI';

interface ScheduledCall {
  id: number;
  title: string;
  with: string;
  role: 'Investor' | 'Entrepreneur';
  date: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'live' | 'ended';
}

const SCHEDULED: ScheduledCall[] = [
  { id:1, title:'Series A Investment Discussion', with:'Ahmad Raza',    role:'Investor',     date:'2026-04-18', time:'10:00 AM', duration:'60 min', status:'live'      },
  { id:2, title:'Product Demo & Partnership',     with:'Sarah Johnson', role:'Entrepreneur', date:'2026-04-20', time:'2:00 PM',  duration:'45 min', status:'scheduled' },
  { id:3, title:'Due Diligence Review',           with:'Carlos Rivera', role:'Investor',     date:'2026-04-25', time:'11:00 AM', duration:'90 min', status:'scheduled' },
  { id:4, title:'Quarterly Portfolio Review',     with:'Maria Lopez',   role:'Entrepreneur', date:'2026-04-15', time:'3:00 PM',  duration:'30 min', status:'ended'     },
];

export const VideoCallPage: React.FC = () => {
  const [activeCall, setActiveCall] = useState<ScheduledCall | null>(null);

  if (activeCall) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveCall(null)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            ← Back to calls
          </button>
        </div>
        <VideoCallUI
          meetingTitle={activeCall.title}
          onEndCall={() => setActiveCall(null)}
        />
      </div>
    );
  }

  const statusBadge = (s: ScheduledCall['status']) => {
    if (s === 'live')      return <Badge variant="error"   rounded>🔴 Live</Badge>;
    if (s === 'scheduled') return <Badge variant="primary" rounded>Scheduled</Badge>;
    return                        <Badge variant="gray"    rounded>Ended</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Calls</h1>
          <p className="text-gray-600 mt-1">Connect with investors and entrepreneurs face-to-face</p>
        </div>
        <Button leftIcon={<Video size={18}/>} onClick={() => setActiveCall(SCHEDULED[0])}>
          Start Instant Call
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Scheduled', value: SCHEDULED.filter(c=>c.status==='scheduled').length, color:'text-primary-600',   bg:'bg-primary-50   border-primary-100'   },
          { label:'Live Now',  value: SCHEDULED.filter(c=>c.status==='live').length,      color:'text-red-600',       bg:'bg-red-50       border-red-100'        },
          { label:'Completed', value: SCHEDULED.filter(c=>c.status==='ended').length,     color:'text-gray-500',      bg:'bg-gray-50      border-gray-200'       },
        ].map(s => (
          <Card key={s.label} className={`border ${s.bg}`}>
            <CardBody>
              <div className="text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Call list */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Scheduled Calls</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {SCHEDULED.map(call => (
            <div key={call.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
              <Avatar
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(call.with)}&background=EFF6FF&color=1D4ED8`}
                alt={call.with}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-semibold text-gray-900">{call.title}</p>
                  {statusBadge(call.status)}
                </div>
                <p className="text-xs text-gray-500">
                  with <span className="font-medium text-gray-700">{call.with}</span>
                  <span className="mx-1.5">·</span>
                  <Badge variant={call.role === 'Investor' ? 'primary' : 'secondary'} size="sm">{call.role}</Badge>
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={11}/> {call.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11}/> {call.time}</span>
                  <span>{call.duration}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {call.status === 'live' && (
                  <Button size="sm" variant="error" onClick={() => setActiveCall(call)}
                    leftIcon={<Video size={14}/>}>
                    Join Now
                  </Button>
                )}
                {call.status === 'scheduled' && (
                  <Button size="sm" variant="outline" onClick={() => setActiveCall(call)}
                    leftIcon={<Video size={14}/>}>
                    Join
                  </Button>
                )}
                {call.status === 'ended' && (
                  <Button size="sm" variant="ghost" disabled>Ended</Button>
                )}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};
