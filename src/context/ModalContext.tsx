'use client';

import React, { createContext, useContext, useState } from 'react';

// 1. Định nghĩa loại hợp lệ cho modal
export type ModalType = 'login' | 'signup' | 'forgotPassword' | 'verifyCode' | 'newPassword' | 'verifyResetCode' | 'addBankCard' | 'actionConfirm' | 'addEditSection' | 'addEditLesson' | 'pickQuizToAdd' | 'groupSettings' | 'createChat' | 'createQuiz' | null;

// 2. Interface context
interface ModalContextType {
  showModal: (type: ModalType, data?: any) => void;
  hideModal: () => void;
  modalType: ModalType;
  modalData?: any;
}

// 3. Tạo context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// 4. Provider
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const showModal = (type: ModalType, data?: any) => {
    setModalType(type);
    setModalData(data || null);
  };

  const hideModal = () => {
    setModalType(null);
    setModalData(null);
  };


  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalType, modalData }}>
      {children}
    </ModalContext.Provider>
  );
};

// 5. Custom hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
