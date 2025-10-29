import React from 'react';
import Image from 'next/image';

export const TotalRevenueIcon: React.FC = () => (
  <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center relative">
    <Image
      src="/assets/revenue/total-revenue.png"
      alt="Total Revenue"
      fill
      className="object-contain"
      sizes="36px"
    />
  </div>
);

export const TotalWithdrawIcon: React.FC = () => (
  <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center relative">
    <Image
      src="/assets/revenue/total-withdraw.png"
      alt="Total Withdraw"
      fill
      className="object-contain"
      sizes="36px"
    />
  </div>
);

export const ServiceFeeIcon: React.FC = () => (
  <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center relative">
    <Image
      src="/assets/revenue/service-fee.png"
      alt="Service Fee"
      fill
      className="object-contain"
      sizes="36px"
    />
  </div>
);

export const CurrentBalanceIcon: React.FC = () => (
  <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center relative">
    <Image
      src="/assets/revenue/current-balance.png"
      alt="Current Balance"
      fill
      className="object-contain"
      sizes="36px"
    />
  </div>
);