import React, { useState } from 'react';
import { Check, X, Clock, Send, User, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

type Status = 'pending' | 'accepted' | 'declined';

interface Request {
  id: number;
  from: string;
  role: 'Investor' | 'Entrepreneur';
  title: string;
  date: string;
  time: string;
  message: string;
  status: Status;
  direction: 'incoming' | 'outgoing';
}

const INITIAL_REQUESTS: Request[] = [
  {
    id: 1, from: 'Ahmad Raza', role: 'Investor', title: 'Investment Pitch',
    date: '2026-04-18', time: '10:00 AM',
    message: 'Would love to discuss your startup growth potential and explore investment options.',
    status: 'pending', direction: 'incoming',
  },
  {
    id: 2, from: 'Sarah Johnson', role: 'Entrepreneur', title: 'Partnership Discussion',
    date: '2026-04-20', time: '2:00 PM',
    message: 'Interested in exploring a joint venture opportunity in the fintech space.',
    status: 'pending', direction: 'incoming',
  },
  {
    id: 3, from: 'You', role: 'Investor', title: 'Portfolio Review',
    date: '2026-04-22', time: '11:00 AM',
    message: 'Sent a meeting request for portfolio review.',
    status: 'pending', direction: 'outgoing',
  },
  {
    id: 4, from: 'Carlos Rivera', role: 'Entrepreneur', title: 'Funding Round',
    date: '2026-04-15', time: '3:00 PM',
    message: 'Discussed Series A funding details.',
    status: 'accepted', direction: 'incoming',
  },
];

const MeetingRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [showSendForm, setShowSendForm] = useState(false);
  const [newRequest, setNewRequest] = useState({ to: '', title: '', date: '', time: '', message: '' });

  const updateStatus = (id: number, status: Status) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  const sendRequest = () => {
    if (!newRequest.to || !newRequest.title || !newRequest.date) return;
    setRequests(prev => [...prev, {
      id: Date.now(), from: 'You', role: 'Investor',
      title: newRequest.title, date: newRequest.date,
      time: newRequest.time, message: newRequest.message,
      status: 'pending', direction: 'outgoing',
    }]);
    setNewRequest({ to: '', title: '', date: '', time: '', message: '' });
    setShowSendForm(false);
  };

  const filtered = requests.filter(r => filter === 'all' || r.direction === filter);

  const statusBadge = (status: Status) => {
    if (status === 'accepted') return <Badge variant="success">Accepted</Badge>;
    if (status === 'declined') return <Badge variant="error">Declined</Badge>;
    return <Badge variant="warning">Pending</Badge>;
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Meeting Requests</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage incoming and outgoing requests</p>
        </div>
        <Button onClick={() => setShowSendForm(true)} leftIcon={<Send size={16} />}>
          Send Request
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(['all', 'incoming', 'outgoing'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize
              ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(req => (
          <Card key={req.id}>
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar name={req.from} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-gray-900">{req.from}</span>
                      <Badge variant={req.role === 'Investor' ? 'primary' : 'secondary'}>
                        {req.role}
                      </Badge>
                      {statusBadge(req.status)}
                      {req.direction === 'outgoing' && (
                        <span className="text-xs text-gray-400">↑ Sent by you</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{req.title}</p>
                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">{req.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {req.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {req.time}
                      </span>
                    </div>
                  </div>
                </div>
                {req.direction === 'incoming' && req.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="primary"
                      onClick={() => updateStatus(req.id, 'accepted')}
                      leftIcon={<Check size={13} />}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline"
                      onClick={() => updateStatus(req.id, 'declined')}
                      leftIcon={<X size={13} />}>
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card>
            <CardBody>
              <div className="text-center py-12 text-gray-400">
                <Send size={36} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No requests found</p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Send Request Modal */}
      {showSendForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Send Meeting Request</h3>
              <button onClick={() => setShowSendForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Send To</label>
                <input type="text" placeholder="Name or email"
                  value={newRequest.to}
                  onChange={e => setNewRequest(p => ({ ...p, to: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input type="text" placeholder="e.g. Investment Discussion"
                  value={newRequest.title}
                  onChange={e => setNewRequest(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={newRequest.date}
                    onChange={e => setNewRequest(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={newRequest.time}
                    onChange={e => setNewRequest(p => ({ ...p, time: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                <textarea placeholder="Add a note..." rows={3}
                  value={newRequest.message}
                  onChange={e => setNewRequest(p => ({ ...p, message: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowSendForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={sendRequest}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRequests;
