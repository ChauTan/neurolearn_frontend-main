import React from 'react';
import Image from 'next/image';
import { CardInfoProps } from '@/types/income';
import { useGetMyCreditCardQuery, useGetBankInfoQuery } from '@/lib/redux/features/bank/bankApi';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/lib/redux/store';

interface CreditCardProps extends CardInfoProps {
  bankLogo?: string;
}

const CreditCardUI: React.FC<CreditCardProps> = ({
  bankName,
  bankLogo,
  cardHolder,
  cardNumber,
}) => {
  return (
    <div className="w-full max-w-[340px] h-[200px] rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
      {/* Background - Using custom card image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/revenue/custom-card.png"
          alt="Card background"
          fill
          className="object-cover"
          sizes="(max-width: 340px) 100vw, 340px"
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col p-5 text-white">
        {/* Top row: Bank name on left, card icon on right */}
        <div className="flex justify-between items-start mb-4">
          {/* Bank name */}
          <div className="text-xl font-bold drop-shadow-sm">{bankName}</div>

          {/* Card icon - positioned at top right */}
          <div className="w-8 h-8 relative">
            <Image
              src="/assets/revenue/icon-card.png"
              alt="Card icon"
              fill
              className="object-contain"
              sizes="(max-width: 32px) 100vw, 32px"
            />
          </div>
        </div>

        {/* Bank logo - positioned below bank name */}
        {bankLogo && (
          <div className="mb-6">
            <div className="relative h-10 w-20 bg-white rounded-md p-2 shadow-sm">
              <Image
                src={bankLogo}
                alt={bankName}
                fill
                className="object-contain"
                sizes="(max-width: 80px) 100vw, 80px"
              />
            </div>
          </div>
        )}

        {/* Card holder name - positioned in middle */}
        <div className="flex-grow flex items-center">
          <div className="text-lg uppercase tracking-wider font-medium drop-shadow-sm">
            {cardHolder}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-end">
          {/* Card number */}
          <div className="flex-1">
            <div className="text-sm font-mono tracking-[0.15em] opacity-90 mb-1 font-medium">
              {cardNumber}
            </div>
          </div>
        </div>

        {/* Payment network - Mastercard logo positioned at bottom right */}
        <div className="absolute bottom-4 right-5">
          <div className="flex">
            <div className="w-7 h-7 rounded-full bg-red-500"></div>
            <div className="w-7 h-7 rounded-full bg-orange-400 -ml-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Data-connected component that fetches from API
export const CreditCard: React.FC = () => {
  // Get auth state to check if user is logged in
  // const { user } = useSelector((state: RootState) => state.auth);

  // Fetch user's credit card info
  const {
    data: creditCardData,
    isLoading,
    error
  } = useGetMyCreditCardQuery();

  // Fetch bank info để map shortName thành fullName và lấy logo
  const { data: bankInfoData } = useGetBankInfoQuery();

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[340px] h-[200px] rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

      // Show no card state - display friendly UI when no card exists
  if (error || !creditCardData?.data) {
    return (
      <div className="w-full max-w-[340px] h-[200px] rounded-2xl overflow-hidden shadow-lg relative bg-gradient-to-br from-gray-100 to-gray-200 border-dashed border-gray-300">
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-gray-500">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">No Card Added</p>
            <p className="text-xs text-gray-500">Add your first card to get started</p>
          </div>
        </div>
      </div>
    );
  }

  const card = creditCardData.data;

  // Format card number for display (show all digits as provided by API)
  const formattedCardNumber = card.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

  // Lấy logo từ bank info nếu có
  const getBankLogo = (shortName: string): string | undefined => {
    if (!bankInfoData?.data) return undefined;

    const bank = bankInfoData.data.find(b => b.shortName === shortName);
    return bank ? bank.bankLogoUrl : undefined;
  };

          // Use the UI component with real data - display shortName directly
        return (
          <CreditCardUI
            bankName={card.cardType} // Display shortName directly
      bankLogo={getBankLogo(card.cardType)}
      cardHolder={card.name}
      cardNumber={formattedCardNumber}
      cvv="***"
      expiryDate="12/28"
    />
  );
};