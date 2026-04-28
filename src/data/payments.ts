export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'deal_funding';
  amount: number;
  currency: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  timestamp: string;
  dealId?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  pendingBalance: number;
  transactions: Transaction[];
}

// Mock wallet balances
export const wallets: Record<string, Wallet> = {
  e1: {
    userId: 'e1',
    balance: 125000,
    currency: 'USD',
    pendingBalance: 50000,
    transactions: [],
  },
  e2: { userId: 'e2', balance: 87500, currency: 'USD', pendingBalance: 0, transactions: [] },
  e3: { userId: 'e3', balance: 43200, currency: 'USD', pendingBalance: 12000, transactions: [] },
  e4: { userId: 'e4', balance: 15000, currency: 'USD', pendingBalance: 0, transactions: [] },
  e5: { userId: 'e5', balance: 220000, currency: 'USD', pendingBalance: 75000, transactions: [] },
  i1: { userId: 'i1', balance: 5800000, currency: 'USD', pendingBalance: 200000, transactions: [] },
  i2: { userId: 'i2', balance: 3100000, currency: 'USD', pendingBalance: 0, transactions: [] },
  i3: { userId: 'i3', balance: 9400000, currency: 'USD', pendingBalance: 500000, transactions: [] },
  i4: { userId: 'i4', balance: 1250000, currency: 'USD', pendingBalance: 0, transactions: [] },
  i5: { userId: 'i5', balance: 7600000, currency: 'USD', pendingBalance: 300000, transactions: [] },
};

export const transactions: Transaction[] = [
  {
    id: 'tx1',
    type: 'deal_funding',
    amount: 500000,
    currency: 'USD',
    senderId: 'i1',
    senderName: 'Michael Chen',
    receiverId: 'e1',
    receiverName: 'Sarah Johnson (TechWave AI)',
    status: 'completed',
    description: 'Series A funding – TechWave AI',
    timestamp: '2024-03-10T10:30:00Z',
    dealId: 'd1',
  },
  {
    id: 'tx2',
    type: 'deposit',
    amount: 250000,
    currency: 'USD',
    senderId: 'external',
    senderName: 'Bank Wire Transfer',
    receiverId: 'i1',
    receiverName: 'Michael Chen',
    status: 'completed',
    description: 'Capital deposit',
    timestamp: '2024-03-08T09:15:00Z',
  },
  {
    id: 'tx3',
    type: 'deal_funding',
    amount: 200000,
    currency: 'USD',
    senderId: 'i2',
    senderName: 'Jennifer Park',
    receiverId: 'e3',
    receiverName: 'Maya Patel (HealthPulse)',
    status: 'pending',
    description: 'Seed round – HealthPulse',
    timestamp: '2024-03-12T14:00:00Z',
    dealId: 'd3',
  },
  {
    id: 'tx4',
    type: 'withdraw',
    amount: 75000,
    currency: 'USD',
    senderId: 'e1',
    senderName: 'Sarah Johnson',
    receiverId: 'external',
    receiverName: 'Bank Account ****4892',
    status: 'completed',
    description: 'Operational expenses withdrawal',
    timestamp: '2024-03-05T16:45:00Z',
  },
  {
    id: 'tx5',
    type: 'transfer',
    amount: 30000,
    currency: 'USD',
    senderId: 'i3',
    senderName: 'Robert Kim',
    receiverId: 'i1',
    receiverName: 'Michael Chen',
    status: 'completed',
    description: 'Co-investor transfer – deal split',
    timestamp: '2024-03-01T11:20:00Z',
  },
  {
    id: 'tx6',
    type: 'deal_funding',
    amount: 1000000,
    currency: 'USD',
    senderId: 'i3',
    senderName: 'Robert Kim',
    receiverId: 'e5',
    receiverName: 'Emma Rodriguez (EduTech)',
    status: 'completed',
    description: 'Series B – EduTech Platform',
    timestamp: '2024-02-28T13:00:00Z',
    dealId: 'd5',
  },
  {
    id: 'tx7',
    type: 'deposit',
    amount: 150000,
    currency: 'USD',
    senderId: 'external',
    senderName: 'Wire Transfer',
    receiverId: 'e5',
    receiverName: 'Emma Rodriguez',
    status: 'failed',
    description: 'Investor deposit – failed compliance check',
    timestamp: '2024-03-11T08:00:00Z',
  },
];

export function getWallet(userId: string): Wallet {
  if (!wallets[userId]) {
    wallets[userId] = { userId, balance: 10000, currency: 'USD', pendingBalance: 0, transactions: [] };
  }
  return wallets[userId];
}

export function getTransactionsForUser(userId: string): Transaction[] {
  return transactions.filter(t => t.senderId === userId || t.receiverId === userId);
}

export function addTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
  const newTx: Transaction = {
    ...tx,
    id: `tx${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  transactions.unshift(newTx);

  // Update wallet balances
  if (tx.type === 'deposit' && wallets[tx.receiverId]) {
    wallets[tx.receiverId].balance += tx.amount;
  } else if (tx.type === 'withdraw' && wallets[tx.senderId]) {
    wallets[tx.senderId].balance -= tx.amount;
  } else if ((tx.type === 'transfer' || tx.type === 'deal_funding')) {
    if (wallets[tx.senderId]) wallets[tx.senderId].balance -= tx.amount;
    if (wallets[tx.receiverId]) wallets[tx.receiverId].balance += tx.amount;
  }

  return newTx;
}
