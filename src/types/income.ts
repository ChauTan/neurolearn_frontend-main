export interface Transaction {
    id: number;
    note: string;
    bank: string;
    amount: string;
    date: string;
    status: 'Pending' | 'Completed';
  }
  
  export interface BalanceOverviewProps {
    totalWithdraw: string;
    serviceFee: string;
    currentBalance: string;
  }
  
  export interface CardInfoProps {
    bankName: string;
    cardHolder: string;
    cardNumber: string;
    cvv: string;
    expiryDate: string;
  }