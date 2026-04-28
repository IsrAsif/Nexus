import React, { useState, useRef, useEffect } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  Monitor, MonitorOff, MessageSquare, Users, Maximize2,
  MoreVertical, X, Settings
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface Participant {
  id: string;
  name: string;
  role: 'Investor' | 'Entrepreneur';
  muted: boolean;
  videoOff: boolean;
}

interface VideoCallUIProps {
  onEndCall?: () => void;
  meetingTitle?: string;
  participants?: Participant[];
}

const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: '1', name: 'Ahmad Raza',    role: 'Investor',     muted: false, videoOff: false },
  { id: '2', name: 'Sarah Johnson', role: 'Entrepreneur', muted: true,  videoOff: false },
  { id: '3', name: 'Carlos Rivera', role: 'Investor',     muted: false, videoOff: true  },
];

const CHAT_MESSAGES = [
  { id: 1, from: 'Ahmad Raza',    text: 'Can everyone see my screen?',           time: '10:02 AM' },
  { id: 2, from: 'Sarah Johnson', text: 'Yes, we can see it clearly!',            time: '10:03 AM' },
  { id: 3, from: 'Carlos Rivera', text: 'Let\'s proceed with the pitch deck.',    time: '10:04 AM' },
  { id: 4, from: 'Ahmad Raza',    text: 'Great. Moving to slide 3 now.',          time: '10:05 AM' },
];

export const VideoCallUI: React.FC<VideoCallUIProps> = ({
  onEndCall,
  meetingTitle = 'Investment Discussion',
  participants = DEFAULT_PARTICIPANTS,
}) => {
  const [callActive,    setCallActive]    = useState(false);
  const [micOn,         setMicOn]         = useState(true);
  const [videoOn,       setVideoOn]       = useState(true);
  const [screenShare,   setScreenShare]   = useState(false);
  const [showChat,      setShowChat]      = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [callDuration,  setCallDuration]  = useState(0);
  const [newMessage,    setNewMessage]    = useState('');
  const [messages,      setMessages]      = useState(CHAT_MESSAGES);
  const [fullscreen,    setFullscreen]    = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callActive]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const startCall = () => { setCallActive(true); setVideoOn(true); setMicOn(true); };

  const endCall = () => {
    setCallActive(false);
    setScreenShare(false);
    onEndCall?.();
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(p => [...p, {
      id: Date.now(), from: 'You', text: newMessage.trim(),
      time: new Date().toLocaleTimeString('en-US',{ hour:'2-digit', minute:'2-digit' }),
    }]);
    setNewMessage('');
  };

  // ─── Pre-call lobby ───────────────────────────────────────────────────────
  if (!callActive) {
    return (
      <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div>
            <h2 className="text-white font-semibold text-lg">{meetingTitle}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{participants.length} participants waiting</p>
          </div>
          <Badge variant="warning">Lobby</Badge>
        </div>

        {/* Preview area */}
        <div className="relative bg-gray-800 h-72 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">Y</span>
            </div>
            <p className="text-white font-medium">Your camera preview</p>
            <p className="text-gray-400 text-sm mt-1">Make sure your camera and mic are working</p>
          </div>
          {/* Participant thumbnails */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {participants.slice(0,3).map(p => (
              <div key={p.id} className="w-16 h-12 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                <span className="text-white text-xs font-medium">{p.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-call controls */}
        <div className="flex items-center justify-between px-6 py-5 bg-gray-800/50">
          <div className="flex gap-3">
            <button onClick={() => setMicOn(p => !p)}
              className={`p-3 rounded-full transition-colors ${micOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}>
              {micOn ? <Mic size={18}/> : <MicOff size={18}/>}
            </button>
            <button onClick={() => setVideoOn(p => !p)}
              className={`p-3 rounded-full transition-colors ${videoOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}>
              {videoOn ? <Video size={18}/> : <VideoOff size={18}/>}
            </button>
            <button className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              <Settings size={18}/>
            </button>
          </div>
          <button
            onClick={startCall}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors shadow-lg"
          >
            <Phone size={18}/> Join Call
          </button>
        </div>
      </div>
    );
  }

  // ─── Active call ──────────────────────────────────────────────────────────
  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-700 flex flex-col ${fullscreen ? 'fixed inset-0 z-50 rounded-none' : 'max-w-5xl mx-auto'}`}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-medium text-sm">{meetingTitle}</span>
          <span className="text-gray-400 text-sm font-mono">{formatTime(callDuration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Live</Badge>
          <button onClick={() => setFullscreen(p => !p)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={16}/>
          </button>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video grid */}
        <div className="flex-1 bg-gray-900 p-3 grid grid-cols-2 gap-3 auto-rows-fr min-h-[420px]">

          {/* Main / local video */}
          <div className="col-span-2 row-span-1 relative bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 min-h-[200px]">
            {videoOn && !screenShare ? (
              <div className="w-full h-full bg-gradient-to-br from-primary-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xl font-bold">Y</span>
                  </div>
                  <p className="text-white text-sm font-medium">You (Camera On)</p>
                </div>
              </div>
            ) : screenShare ? (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <Monitor size={48} className="text-primary-400 mx-auto mb-2"/>
                  <p className="text-white font-medium">Screen Share Active</p>
                  <p className="text-gray-400 text-sm mt-1">Your screen is being shared</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff size={40} className="text-gray-500 mx-auto mb-2"/>
                <p className="text-gray-400 text-sm">Your camera is off</p>
              </div>
            )}
            {/* Self label */}
            <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
              <span className="text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded">You</span>
              {!micOn && <MicOff size={12} className="text-red-400"/>}
            </div>
          </div>

          {/* Participant tiles */}
          {participants.map(p => (
            <div key={p.id} className="relative bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-700">
              {p.videoOff ? (
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-1">
                    <span className="text-white text-sm font-bold">{p.name[0]}</span>
                  </div>
                  <p className="text-gray-300 text-xs">{p.name.split(' ')[0]}</p>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary-900 to-gray-800 flex items-center justify-center min-h-[100px]">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-secondary-600 flex items-center justify-center mx-auto mb-1">
                      <span className="text-white text-sm font-bold">{p.name[0]}</span>
                    </div>
                    <p className="text-gray-300 text-xs">{p.name.split(' ')[0]}</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1">
                <span className="text-white text-xs bg-black/50 px-1.5 py-0.5 rounded">{p.name.split(' ')[0]}</span>
                {p.muted && <MicOff size={10} className="text-red-400"/>}
              </div>
              <div className="absolute top-1.5 right-1.5">
                <Badge variant={p.role === 'Investor' ? 'primary' : 'secondary'} size="sm">{p.role}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Chat panel */}
        {showChat && (
          <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <span className="text-white font-medium text-sm">Meeting Chat</span>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                <X size={16}/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`flex flex-col gap-0.5 ${m.from === 'You' ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-500">{m.from} · {m.time}</span>
                  <div className={`px-3 py-2 rounded-lg text-sm max-w-[200px] ${
                    m.from === 'You'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-700 flex gap-2">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white text-sm px-3 py-2 rounded-lg outline-none placeholder-gray-400 border border-gray-600 focus:border-primary-500 transition-colors"
              />
              <button onClick={sendMessage}
                className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium">
                Send
              </button>
            </div>
          </div>
        )}

        {/* Participants panel */}
        {showParticipants && (
          <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <span className="text-white font-medium text-sm">Participants ({participants.length + 1})</span>
              <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">
                <X size={16}/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {/* Self */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">Y</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">You (Host)</p>
                </div>
                <div className="flex gap-1">
                  {!micOn && <MicOff size={13} className="text-red-400"/>}
                  {!videoOn && <VideoOff size={13} className="text-red-400"/>}
                </div>
              </div>
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-secondary-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{p.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.name}</p>
                    <p className="text-gray-400 text-xs">{p.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {p.muted    && <MicOff   size={13} className="text-red-400"/>}
                    {p.videoOff && <VideoOff size={13} className="text-red-400"/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-t border-gray-700 flex-shrink-0">

        {/* Left controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => setMicOn(p => !p)}
            className={`p-3 rounded-full transition-colors flex flex-col items-center gap-0.5 ${micOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}>
            {micOn ? <Mic size={18}/> : <MicOff size={18}/>}
          </button>
          <button onClick={() => setVideoOn(p => !p)}
            className={`p-3 rounded-full transition-colors ${videoOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}>
            {videoOn ? <Video size={18}/> : <VideoOff size={18}/>}
          </button>
          <button onClick={() => setScreenShare(p => !p)}
            className={`p-3 rounded-full transition-colors ${screenShare ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
            {screenShare ? <MonitorOff size={18}/> : <Monitor size={18}/>}
          </button>
        </div>

        {/* Center — end call */}
        <button onClick={endCall}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors shadow-lg">
          <PhoneOff size={18}/> End Call
        </button>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowChat(p => !p); setShowParticipants(false); }}
            className={`p-3 rounded-full transition-colors relative ${showChat ? 'bg-primary-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
            <MessageSquare size={18}/>
          </button>
          <button onClick={() => { setShowParticipants(p => !p); setShowChat(false); }}
            className={`p-3 rounded-full transition-colors ${showParticipants ? 'bg-primary-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
            <Users size={18}/>
          </button>
          <button className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
            <MoreVertical size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallUI;
