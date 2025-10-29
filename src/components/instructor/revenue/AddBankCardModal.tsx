import React, { useState, useMemo } from 'react';
import { useGetBankInfoQuery, useAddCreditCardMutation } from '@/lib/redux/features/bank/bankApi';
import { BankInfo as ApiBankInfo } from '@/types/creditCard';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useToast } from '@/hooks/use-toast';

interface BankInfo {
    id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
    logo: string;
    short_name: string;
}

// Define a type for API errors
interface ApiError {
  data?: {
    message?: string;
    // other error data fields
  };
  status?: number;
  // other error fields
}

interface AddBankCardModalProps {
  onClose: () => void;
}

const AddBankCardModal = ({ onClose }: AddBankCardModalProps) => {
  const { toast } = useToast();
  // Visibility and backdrop are handled by the global ModalContainer.
  // Keep only minimal state inside this component.
  const [cardNumber, setCardNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankShortName, setBankShortName] = useState(''); // Thêm state để lưu shortName
  const [nameCard, setNameCard] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredBanks, setFilteredBanks] = useState<BankInfo[]>([]);
  const [submitError, setSubmitError] = useState<string>('');

  // Get auth state to check if user is logged in
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: bankApiData, isLoading, error } = useGetBankInfoQuery();
  const [addCreditCard, { isLoading: isAddingCard }] = useAddCreditCardMutation();
  const bankList = useMemo<BankInfo[]>(() => {
      if (!bankApiData?.data) return [];
      return bankApiData.data.map((apiBank: ApiBankInfo) => ({
          id: apiBank.bin, 
          name: apiBank.name,
          code: apiBank.bin, 
          bin: apiBank.bin,
          shortName: apiBank.shortName,
          logo: apiBank.bankLogoUrl,
          short_name: apiBank.shortName,
      }));
  }, [bankApiData]);

  const closeModal = () => onClose();

  const handleSubmit = async () => {
    if (!cardNumber || !bankName || !nameCard) {
      toast({ title: 'Missing information', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    // Check if user is authenticated (for session-based auth, check user object)
    if (!user || (typeof user === 'object' && !(user as { _id?: string })?._id)) {
      setSubmitError('Please login to add a credit card.');
      toast({ title: 'Authentication required', description: 'Please login to add a credit card.', variant: 'destructive' });
      return;
    }

    setSubmitError('');

    try {
      await addCreditCard({
        name: nameCard,
        accountNumber: cardNumber,
        cardType: bankShortName || bankName
      }).unwrap();

      toast({ title: 'Card added', description: 'Your bank card has been added successfully.', variant: 'success' });
      closeModal();
    } catch (e: unknown) {
      console.error('Error adding card:', e);

      // Type check and cast the error object
      let errorMessage = 'Failed to add card. Please try again.';
      if (typeof e === 'object' && e !== null) {
        const error = e as ApiError;
        if (error.data && typeof error.data.message === 'string') {
          errorMessage = error.data.message;
        }
      }

      setSubmitError(errorMessage);
      toast({ title: 'Add card failed', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleBankNameChange = (value: string) => {
    setBankName(value);
    setBankShortName(''); // Reset shortName khi user nhập tay

    if (value.trim() === '') {
      setFilteredBanks([]);
      setShowSuggestions(false);
      return;
    }

    const searchValue = value.toLowerCase();
    const filtered = bankList.filter(bank => {
      const matchName = bank.name?.toLowerCase().includes(searchValue);
      const matchShortName = bank.shortName?.toLowerCase().includes(searchValue);
      const matchShortName2 = bank.short_name?.toLowerCase().includes(searchValue);
      const matchCode = bank.code?.toLowerCase().includes(searchValue);
      
      return matchName || matchShortName || matchShortName2 || matchCode;
    });

    setFilteredBanks(filtered);
    setShowSuggestions(true);
  };

  const handleBankSelect = (bank: BankInfo) => {
            setBankName(bank.name); // Display full name in UI
    setBankShortName(bank.shortName); // Lưu shortName để gửi lên server
    setShowSuggestions(false);
  };

  const handleBankInputFocus = () => {
    if (bankName && filteredBanks.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBankInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div 
        className="bg-white rounded-xl w-full shadow-sm"
        style={{
          maxWidth: '28rem',
          padding: '24px',
          margin: 'auto',
        }}
      >
        <h2 id="modal-title" className="text-xl font-bold mb-6 text-center">
          Add Bank Card
        </h2>



        {/* Authentication status indicator */}
        {(!user || (typeof user === 'object' && !(user as { _id?: string })?._id)) && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-600">⚠️ Please login to add a credit card.</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm border border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Enter your card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="bankName" className="block text-sm font-medium mb-1">
              Bank Name
            </label>
            <input
              id="bankName"
              type="text"
              className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm border border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Enter or select bank name"
              value={bankName}
              onChange={(e) => handleBankNameChange(e.target.value)}
              onFocus={handleBankInputFocus}
              onBlur={handleBankInputBlur}
              required
            />
            
            {showSuggestions && filteredBanks.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                {filteredBanks.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 w-full text-left"
                    onClick={() => handleBankSelect(bank)}
                  >
                    <div className="w-12 h-12 relative mr-4 flex-shrink-0">
                      <Image
                        src={bank.logo}
                        alt={bank.shortName}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                                {bank.shortName}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-1">
                        {bank.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 p-3">
                <span className="text-sm text-gray-500">Loading banks...</span>
              </div>
            )}

            {error && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 p-3">
                <span className="text-sm text-red-500">Error loading banks</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="nameCard" className="block text-sm font-medium mb-1">
              Card Holder Name
            </label>
            <input
              id="nameCard"
              type="text"
              className="w-full rounded-lg bg-gray-50 px-4 py-3 text-sm border border-gray-200 focus:border-blue-500 outline-none"
              placeholder="Enter card holder name"
              value={nameCard}
              onChange={(e) => setNameCard(e.target.value)}
              required
            />
          </div>

          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              disabled={isAddingCard}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isAddingCard}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isAddingCard && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isAddingCard ? 'Adding...' : 'Add Card'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddBankCardModal;