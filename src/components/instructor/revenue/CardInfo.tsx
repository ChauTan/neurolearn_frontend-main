import React from 'react';
import { Copy } from 'lucide-react';
import { CardInfoProps } from '@/types/income';
import { useGetMyCreditCardQuery } from '@/lib/redux/features/bank/bankApi';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/lib/redux/store';

// UI Component - keeps the existing beautiful design
const CardInfoUI: React.FC<CardInfoProps> = ({
  bankName,
  cardHolder,
  cardNumber,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="mt-6 w-full">
      <h3 className="text-2xl font-semibold leading-none text-stone-950">Card Information</h3>
      <div className="bg-white rounded-xl shadow-md p-5 mt-3">
        <div className="w-full space-y-6">
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <p className="text-xs font-medium leading-none text-neutral-500">Bank</p>
              <p className="mt-2 text-base font-semibold leading-none text-black">{bankName}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium leading-none text-neutral-500">Card name</p>
              <p className="mt-2 text-base font-semibold leading-none text-black">{cardHolder}</p>
            </div>
          </div>
          
          <div className="flex gap-6 items-end">
            <div className="flex-1">
              <p className="text-xs font-medium leading-none text-neutral-500">Card number</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-base font-semibold leading-none text-black">{cardNumber}</p>
                <button
                  onClick={() => copyToClipboard(cardNumber)}
                  className="flex items-center gap-1 py-1 px-2 text-xs font-medium text-blue-600 bg-white rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Data-connected component that fetches from API
export const CardInfo: React.FC = () => {
  // Get auth state to check if user is logged in
  // const { user } = useSelector((state: RootState) => state.auth);

  // Fetch user's credit card info
  const {
    data: creditCardData,
    isLoading,
    error
  } = useGetMyCreditCardQuery();



  // Show loading state
  if (isLoading) {
    return (
      <section className="mt-6 w-full">
        <h3 className="text-2xl font-semibold leading-none text-stone-950">Card Information</h3>
        <div className="bg-white rounded-xl shadow-md p-5 mt-3 animate-pulse">
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-8 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

      // Show no card state - display friendly UI when no card exists
  if (error || !creditCardData?.data) {
    return (
      <section className="mt-6 w-full">
        <h3 className="text-2xl font-semibold leading-none text-stone-950">Card Information</h3>
        <div className="bg-white rounded-xl shadow-md p-5 mt-3 border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Card Information</h4>
            <p className="text-sm text-gray-500 mb-4">Add your first credit card to view details here</p>
            <div className="text-xs text-gray-400">
              Click &quot;Add Card&quot; button above to get started
            </div>
          </div>
        </div>
      </section>
    );
  }

  const card = creditCardData.data;

  // Use the UI component with real data - display shortName directly
  return (
    <CardInfoUI
      bankName={card.cardType} // Display shortName directly
      cardHolder={card.name}
      cardNumber={card.accountNumber}
      cvv="***" // API doesn't provide CVV for security
      expiryDate="12/28"
    />
  );
};
