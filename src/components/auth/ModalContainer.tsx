'use client';

import { useEffect, useState } from 'react';
import { useModal } from '@/context/ModalContext';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPassword';
import VerifyCodeForm from './VerifyCodeForm';
import NewPasswordForm from './NewPasswordForm';
import VerifyResetCodeForm from './VerifyResetCode';
import AddBankCardModal from '../instructor/revenue/AddBankCardModal';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import GroupChatModal from '@/components/chat/GroupChatModal';
import CreateChatModal from '@/components/chat/CreateChatModal';
import ActionModal from '../../app/(auth)/instructor/courses/create-course/_components/ActionModal';
import AddEditSection from '@/app/(auth)/instructor/courses/create-course/_components/step2/AddEditSection';
import AddEditLessonModal from '@/app/(auth)/instructor/courses/create-course/_components/step2/AddEditLesson';
import PickQuizToAddModal from '@/app/(auth)/instructor/courses/create-course/_components/step2/PickQuizToAddModal';
import CreateQuizModal from '@/app/(auth)/instructor/quizzes/_components/CreateQuizModal';


export default function ModalContainer() {
  const { modalType, hideModal, modalData } = useModal();
  // Busy state dedicated for createQuiz modal flow
  const [createQuizBusy, setCreateQuizBusy] = useState(false);
  const renderModalContent = () => {
    switch (modalType) {
      case 'login':
        return <LoginForm key="login" onClose={hideModal} />;
      case 'signup':
        return <SignUpForm key="signup" onClose={hideModal} />;
      case 'forgotPassword':
        return <ForgotPasswordForm key="forgotPassword" onClose={hideModal} />;
      case 'verifyCode':
        return <VerifyCodeForm key="verifyCode" onClose={hideModal} />;
      case 'newPassword':
        return <NewPasswordForm key="newPassword" onClose={hideModal} />;
      case 'verifyResetCode':
        return <VerifyResetCodeForm key="verifyResetCode" onClose={hideModal} />;
      case 'addBankCard':
        return <AddBankCardModal key="addBankCard" onClose={hideModal} />;
      case 'actionConfirm':
        return (
          <ActionModal
            isOpen
            onClose={hideModal}
            onConfirm={() => {
              modalData?.onConfirm?.();  // gọi callback từ ngoài
              hideModal();
            }}
            title={modalData?.title || "Confirm Action"}
            description={modalData?.description}
            confirmText={modalData?.confirmText || "Confirm"}
            cancelText={modalData?.cancelText || "Cancel"}
            variant={modalData?.variant || "default"}
          />
        );
      case 'addEditSection':
        return (
          <AddEditSection
            key="addEditSection"
            courseId={modalData?.courseId}
            mode={modalData?.mode || 'add'}
            initialData={modalData?.initialData}
            onSubmit={(data) => {
              modalData?.onSubmit?.(data);
              hideModal();
            }}
            onClose={hideModal}
          />
        );
      case 'addEditLesson':
        return (
          <AddEditLessonModal
            key="addEditLesson"
            lesson={modalData?.lesson}
            onSubmit={modalData?.onSubmit}
            onClose={hideModal}
          />
        );
      case 'pickQuizToAdd':
        return (
          <PickQuizToAddModal
            key="pickQuizToAdd"
            courseId={modalData?.courseId} // optional
            onSubmit={modalData?.onSubmit}
            onClose={hideModal}
          />
        );
      case 'groupSettings':
        return (
          <GroupChatModal
            key="groupSettings"
            isOpen
            onClose={hideModal}
            chatName={modalData?.chatName}
            currentMembers={modalData?.currentMembers || []}
            onUpdateGroupName={modalData?.onUpdateGroupName}
            onAddMembers={modalData?.onAddMembers}
            onRemoveMember={modalData?.onRemoveMember}
            currentUserId={modalData?.currentUserId}
          />
        );
      case 'createChat':
        return (
          <CreateChatModal
            key="createChat"
            open
            onClose={hideModal}
            currentUserId={modalData?.currentUserId}
            onChatCreated={modalData?.onChatCreated}
          />
        );
      case 'createQuiz':
        return (
          <CreateQuizModal
            key="createQuiz"
            isOpen
            onClose={createQuizBusy ? () => { } : hideModal}
            isBusy={createQuizBusy}
            onSubmit={async (details) => {
              try {
                setCreateQuizBusy(true);
                // Support both sync and async submitters
                await Promise.resolve(modalData?.onSubmit?.(details));
                hideModal();
              } finally {
                setCreateQuizBusy(false);
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => e.key === 'Escape' && hideModal();
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, [hideModal]);

  return (
    <AnimatePresence mode="sync">
      {modalType && (
        <motion.div
          layout
          key="modal-backdrop"
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ backdropFilter: 'blur(10px)' }}
          exit={{ backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'transparent' }}
          onClick={hideModal}
        >
          <motion.div
            key="modal"
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
              transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              mass: 0.8,
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              transformOrigin: 'center center',
              willChange: 'opacity, transform',
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full rounded-3xl flex items-center justify-center min-h-fit ${modalType === 'createChat' || modalType === 'groupSettings'
              ? 'max-w-md'
              : 'max-w-5xl'
              }`}
          >
            {renderModalContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
