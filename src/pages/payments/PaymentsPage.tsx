import React, { useState, useEffect } from 'react';
import {
  ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Wallet,
  CreditCard, Clock, CheckCircle2, XCircle, TrendingUp,
  Send, Plus, Minus, RefreshCw, ChevronDown, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  getWallet, getTransactionsForUser, addTransaction, Transaction
} from '../../data/payments';
import { users } from '../../data/users';
import toast from 'react-hot-toast';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const StatusIcon: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
  if (status === 'completed') return <CheckCircle2 size={16} className="text-green-500" />;
  if (status === 'pending') return <Clock size={16} className="text-yellow-500" />;
  return <XCircle size={16} className="text-red-500" />;
};

const statusBadge: Record<Transaction['status'], 'success' | 'warning' | 'error'> = {
  completed: 'success', pending: 'warning', failed: 'error',
};

const typeIcon: Record<Transaction['type'], React.ReactNode> = {
  deposit: <ArrowDownCircle size={18} className="text-green-500" />,
  withdraw: <ArrowUpCircle size={18} className="text-red-500" />,
  transfer: <ArrowLeftRight size={18} className="text-blue-500" />,
  deal_funding: <TrendingUp size={18} className="text-purple-500" />,
};

type ModalType = 'deposit' | 'withdraw' | 'transfer' | 'fund_deal' | null;

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(user ? getWallet(user.id) : null);
  const [txList, setTxList] = useState<Transaction[]>(user ? getTransactionsForUser(user.id) : []);
  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dealStep, setDealStep] = useState(1);
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  if (!user || !wallet) return null;

  const otherUsers = users.filter(u => u.id !== user.id);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    addTransaction({
      type: 'deposit', amount: parseFloat(amount), currency: 'USD',
      senderId: 'external', senderName: 'Bank Account ****4892',
      receiverId: user.id, receiverName: user.name,
      status: 'completed', description: description || 'Bank transfer deposit',
    });
    setWallet({ ...getWallet(user.id) });
    setTxList([...getTransactionsForUser(user.id)]);
    toast.success(`${fmt(parseFloat(amount))} deposited successfully!`);
    setModal(null); setAmount(''); setDescription('');
    setIsLoading(false);
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(amount);
    if (!amount || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (amt > wallet.balance) { toast.error('Insufficient balance'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    addTransaction({
      type: 'withdraw', amount: amt, currency: 'USD',
      senderId: user.id, senderName: user.name,
      receiverId: 'external', receiverName: 'Bank Account ****4892',
      status: 'completed', description: description || 'Withdrawal to bank',
    });
    setWallet({ ...getWallet(user.id) });
    setTxList([...getTransactionsForUser(user.id)]);
    toast.success(`${fmt(amt)} withdrawn successfully!`);
    setModal(null); setAmount(''); setDescription('');
    setIsLoading(false);
  };

  const handleTransfer = async () => {
    const amt = parseFloat(amount);
    if (!amount || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (amt > wallet.balance) { toast.error('Insufficient balance'); return; }
    if (!recipient) { toast.error('Select a recipient'); return; }
    const recv = users.find(u => u.id === recipient);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    addTransaction({
      type: 'transfer', amount: amt, currency: 'USD',
      senderId: user.id, senderName: user.name,
      receiverId: recipient, receiverName: recv?.name || 'Unknown',
      status: 'completed', description: description || 'P2P Transfer',
    });
    setWallet({ ...getWallet(user.id) });
    setTxList([...getTransactionsForUser(user.id)]);
    toast.success(`${fmt(amt)} sent to ${recv?.name}!`);
    setModal(null); setAmount(''); setRecipient(''); setDescription('');
    setIsLoading(false);
  };

  const handleFundDeal = async () => {
    const amt = parseFloat(amount);
    if (!amount || amt <= 0) { toast.error('Enter a valid amount'); return; }
    if (amt > wallet.balance) { toast.error('Insufficient balance'); return; }
    if (!selectedEntrepreneur) { toast.error('Select a startup to fund'); return; }
    const recv = users.find(u => u.id === selectedEntrepreneur);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    addTransaction({
      type: 'deal_funding', amount: amt, currency: 'USD',
      senderId: user.id, senderName: user.name,
      receiverId: selectedEntrepreneur, receiverName: recv?.name || 'Entrepreneur',
      status: 'pending', description: description || 'Investment funding',
    });
    setWallet({ ...getWallet(user.id) });
    setTxList([...getTransactionsForUser(user.id)]);
    toast.success(`Investment of ${fmt(amt)} initiated! Pending confirmation.`);
    setModal(null); setAmount(''); setSelectedEntrepreneur(''); setDescription(''); setDealStep(1);
    setIsLoading(false);
  };

  const filteredTx = filterType === 'all' ? txList : txList.filter(t => t.type === filterType);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Wallet</h1>
        <p className="text-gray-600">Manage your funds, transactions, and deal investments</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0">
          <CardBody>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet size={18} className="text-primary-200" />
                  <p className="text-primary-200 text-sm font-medium">Available Balance</p>
                </div>
                <h2 className="text-4xl font-bold tracking-tight">{fmt(wallet.balance)}</h2>
                {wallet.pendingBalance > 0 && (
                  <p className="text-primary-200 text-sm mt-1">
                    <Clock size={12} className="inline mr-1" />
                    {fmt(wallet.pendingBalance)} pending
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                  <CreditCard size={28} className="text-white" />
                </div>
                <p className="text-primary-200 text-xs mt-2">Nexus Wallet</p>
                <p className="text-white text-sm font-mono">**** **** **** {user.id.slice(-4).padStart(4, '0')}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setModal('deposit')}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <Plus size={14} /> Deposit
              </button>
              <button
                onClick={() => setModal('withdraw')}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <Minus size={14} /> Withdraw
              </button>
              <button
                onClick={() => setModal('transfer')}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <Send size={14} /> Transfer
              </button>
              {user.role === 'investor' && (
                <button
                  onClick={() => setModal('fund_deal')}
                  className="flex-1 bg-yellow-400/90 hover:bg-yellow-300 text-yellow-900 text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <TrendingUp size={14} /> Fund Deal
                </button>
              )}
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowDownCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Received</p>
                  <p className="text-lg font-bold text-gray-900">
                    {fmt(txList.filter(t => t.receiverId === user.id && t.status === 'completed').reduce((s, t) => s + t.amount, 0))}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ArrowUpCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Sent</p>
                  <p className="text-lg font-bold text-gray-900">
                    {fmt(txList.filter(t => t.senderId === user.id && t.status === 'completed').reduce((s, t) => s + t.amount, 0))}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShieldCheck size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Security Status</p>
                  <p className="text-sm font-semibold text-green-600">Verified ✓</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            <div className="flex gap-2 flex-wrap">
              {['all', 'deposit', 'withdraw', 'transfer', 'deal_funding'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    filterType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'deal_funding' ? 'Deal Funding' :
                   type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {filteredTx.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3">Description</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3 hidden sm:table-cell">Sender</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3 hidden sm:table-cell">Receiver</th>
                    <th className="text-right text-xs font-semibold text-gray-500 pb-3">Amount</th>
                    <th className="text-center text-xs font-semibold text-gray-500 pb-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 pb-3 hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTx.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {typeIcon[tx.type]}
                          <span className="text-xs text-gray-500 hidden lg:inline capitalize">
                            {tx.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 max-w-[150px]">
                        <p className="text-sm text-gray-800 truncate">{tx.description}</p>
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-600 truncate max-w-[120px]">{tx.senderName}</p>
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-600 truncate max-w-[120px]">{tx.receiverName}</p>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-sm font-semibold ${
                          tx.receiverId === user.id ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.receiverId === user.id ? '+' : '-'}{fmt(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant={statusBadge[tx.status]}>
                          <StatusIcon status={tx.status} />
                          <span className="ml-1 capitalize">{tx.status}</span>
                        </Badge>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        <p className="text-xs text-gray-500">
                          {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Deposit Modal */}
            {modal === 'deposit' && (
              <>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                  <ArrowDownCircle size={28} className="mb-2" />
                  <h3 className="text-xl font-bold">Deposit Funds</h3>
                  <p className="text-green-100 text-sm">Add money to your Nexus wallet</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input
                        type="number" value={amount} onChange={e => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[1000, 5000, 10000, 50000].map(a => (
                        <button key={a} onClick={() => setAmount(String(a))}
                          className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 rounded-md transition-colors">
                          {fmt(a)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                      <CreditCard size={18} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Bank Account</p>
                        <p className="text-xs text-gray-500">****4892 – Checking</p>
                      </div>
                      <ChevronDown size={16} className="ml-auto text-gray-400" />
                    </div>
                  </div>
                  <Input label="Note (optional)" value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Description..." fullWidth />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setModal(null)} fullWidth>Cancel</Button>
                    <Button onClick={handleDeposit} isLoading={isLoading} fullWidth>Deposit Now</Button>
                  </div>
                </div>
              </>
            )}

            {/* Withdraw Modal */}
            {modal === 'withdraw' && (
              <>
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <ArrowUpCircle size={28} className="mb-2" />
                  <h3 className="text-xl font-bold">Withdraw Funds</h3>
                  <p className="text-red-100 text-sm">Available: {fmt(wallet.balance)}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input
                        type="number" value={amount} onChange={e => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
                      <CreditCard size={18} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Bank Account</p>
                        <p className="text-xs text-gray-500">****4892 – Checking</p>
                      </div>
                    </div>
                  </div>
                  <Input label="Note (optional)" value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Reason for withdrawal..." fullWidth />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setModal(null)} fullWidth>Cancel</Button>
                    <Button variant="error" onClick={handleWithdraw} isLoading={isLoading} fullWidth>Withdraw</Button>
                  </div>
                </div>
              </>
            )}

            {/* Transfer Modal */}
            {modal === 'transfer' && (
              <>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <ArrowLeftRight size={28} className="mb-2" />
                  <h3 className="text-xl font-bold">Transfer Funds</h3>
                  <p className="text-blue-100 text-sm">Send money to another Nexus user</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                    <select value={recipient} onChange={e => setRecipient(e.target.value)}
                      className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">Select recipient...</option>
                      {otherUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00" />
                    </div>
                  </div>
                  <Input label="Note (optional)" value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="What's this for?" fullWidth />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setModal(null)} fullWidth>Cancel</Button>
                    <Button onClick={handleTransfer} isLoading={isLoading} fullWidth>Send</Button>
                  </div>
                </div>
              </>
            )}

            {/* Fund Deal Modal - Multi-step */}
            {modal === 'fund_deal' && (
              <>
                <div className="bg-gradient-to-r from-purple-600 to-primary-700 p-6 text-white">
                  <TrendingUp size={28} className="mb-2" />
                  <h3 className="text-xl font-bold">Fund a Deal</h3>
                  <p className="text-purple-200 text-sm">Step {dealStep} of 3 — Investment flow</p>
                  <div className="flex gap-1 mt-3">
                    {[1, 2, 3].map(s => (
                      <div key={s} className={`h-1 flex-1 rounded-full ${s <= dealStep ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {dealStep === 1 && (
                    <>
                      <h4 className="font-semibold text-gray-800">Select Startup to Fund</h4>
                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {users.filter(u => u.role === 'entrepreneur').map(u => (
                          <div key={u.id}
                            onClick={() => setSelectedEntrepreneur(u.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedEntrepreneur === u.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{u.name}</p>
                              <p className="text-xs text-gray-500">{(u as any).startupName}</p>
                            </div>
                            {selectedEntrepreneur === u.id && <CheckCircle2 size={18} className="ml-auto text-purple-500" />}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setModal(null)} fullWidth>Cancel</Button>
                        <Button onClick={() => selectedEntrepreneur ? setDealStep(2) : toast.error('Select a startup')} fullWidth>
                          Next →
                        </Button>
                      </div>
                    </>
                  )}
                  {dealStep === 2 && (
                    <>
                      <h4 className="font-semibold text-gray-800">Investment Amount</h4>
                      <div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Investment amount" />
                        </div>
                        <div className="flex gap-2 mt-2">
                          {[25000, 50000, 100000, 500000].map(a => (
                            <button key={a} onClick={() => setAmount(String(a))}
                              className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 rounded-md">
                              {fmt(a)}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Input label="Investment memo" value={description} onChange={e => setDescription(e.target.value)}
                        placeholder="e.g., Seed round funding..." fullWidth />
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setDealStep(1)} fullWidth>Back</Button>
                        <Button onClick={() => amount && parseFloat(amount) > 0 ? setDealStep(3) : toast.error('Enter amount')} fullWidth>
                          Review →
                        </Button>
                      </div>
                    </>
                  )}
                  {dealStep === 3 && (
                    <>
                      <h4 className="font-semibold text-gray-800">Confirm Investment</h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">To</span>
                          <span className="font-medium">{users.find(u => u.id === selectedEntrepreneur)?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Startup</span>
                          <span className="font-medium">{(users.find(u => u.id === selectedEntrepreneur) as any)?.startupName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Amount</span>
                          <span className="font-bold text-purple-700 text-base">{fmt(parseFloat(amount))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Memo</span>
                          <span className="font-medium">{description || '—'}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between text-sm">
                          <span className="text-gray-500">Remaining balance</span>
                          <span className="font-medium text-gray-800">{fmt(wallet.balance - parseFloat(amount || '0'))}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                        <ShieldCheck size={14} className="text-yellow-600" />
                        This is a simulation. No real funds will be transferred.
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setDealStep(2)} fullWidth>Back</Button>
                        <Button onClick={handleFundDeal} isLoading={isLoading} fullWidth>
                          Confirm Investment
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
