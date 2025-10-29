'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronDown, UploadCloud, Plus, ArrowLeft, Minus } from 'lucide-react';
import { ManualCreationDetails, AICreationDetails } from '../../../../../types/quiz';

type ModalStep = 'initialStep' | 'aiForm';

export interface CreateQuizModalPanelProps {
  onClose: () => void;
  onSubmit: (details: ManualCreationDetails | AICreationDetails) => void;
  isBusy?: boolean;
}

/**
 * Chỉ render phần PANEL (không overlay).
 * Dùng bên trong ModalContainer.
 */
export const CreateQuizModalPanel: React.FC<CreateQuizModalPanelProps> = ({ onClose, onSubmit, isBusy }) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('initialStep');

  // Bước 1
  const [examTitle, setExamTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [creationModeSelection, setCreationModeSelection] = useState<'manual' | 'ai'>('manual');

  // Bước 2 (AI)
  const [aiScannedFile, setAiScannedFile] = useState<File | null>(null);
  const [aiDifficultyLevel, setAiDifficultyLevel] = useState('Easy');
  const [aiTopic, setAiTopic] = useState('');
  const [aiQuestionTypes, setAiQuestionTypes] = useState([{ type: 'multiple-choice', count: 1 }]);

  const resetInitialStepFields = () => {
    setExamTitle('');
    setDuration('');
    setCreationModeSelection('manual');
  };
  const resetAiFormFields = () => {
    setAiScannedFile(null);
    setAiDifficultyLevel('Easy');
    setAiTopic('');
    setAiQuestionTypes([{ type: 'multiple-choice', count: 1 }]);
  };
  const resetForms = useCallback(() => {
    resetInitialStepFields();
    resetAiFormFields();
    setCurrentStep('initialStep');
  }, []);

  // Reset khi mount panel (mỗi lần ModalContainer mở loại modal này)
  useEffect(() => {
    resetForms();
  }, [resetForms]);

  const handleClose = () => {
    if (isBusy) return; // prevent closing while busy
    resetForms();
    onClose();
  };

  const handleInitialStepSubmit = () => {
    if (!examTitle.trim()) {
      alert('Please enter an Exam Title.');
      return;
    }
    if (creationModeSelection === 'manual') {
      onSubmit({ mode: 'manual', examTitle, duration });
      // closing handled by container
    } else {
      setCurrentStep('aiForm');
    }
  };

  const handleAiFormSubmit = () => {
    if (!examTitle.trim() && !aiScannedFile && !aiTopic.trim()) {
      alert('Please provide an Exam Title, scan a document, or enter a topic for AI mode.');
      return;
    }
    if (aiQuestionTypes.reduce((s, qt) => s + qt.count, 0) === 0) {
      alert('Please specify the number of questions to generate.');
      return;
    }
    onSubmit({
      mode: 'ai',
      examTitle,
      documentFile: aiScannedFile,
      difficultyLevel: aiDifficultyLevel,
      topic: aiTopic,
      questionConfigs: aiQuestionTypes,
    });
    // closing handled by container after async completes
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File is too large! Maximum 10MB.');
        event.currentTarget.value = '';
        return;
      }
      setAiScannedFile(file);
    }
  };

  const handleAiQuestionTypeChange = (
    index: number,
    field: 'type' | 'count',
    value: string | number
  ) => {
    const next = [...aiQuestionTypes];
    const current = { ...next[index] };
    if (field === 'type') current.type = value as string;
    else current.count = Math.max(1, Number(value));
    next[index] = current;
    setAiQuestionTypes(next);
  };

  const addAiQuestionTypeConfig = () => {
    if (aiQuestionTypes.length < 5) {
      setAiQuestionTypes([...aiQuestionTypes, { type: 'multiple-choice', count: 1 }]);
    } else {
      alert('Maximum of 5 question type configurations reached.');
    }
  };

  // ====== UI parts ======
  const renderInitialStep = () => (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create A Test</h2>

        <div className="w-[390px] h-[160px] mx-auto rounded-lg bg-blue-50 flex items-center justify-center mb-4">
          <Image src="/assets/create-quiz/Rectangle 576.png" alt="Create Test Icon" width={390} height={160} />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="modalExamTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Exam Title
          </label>
          <input
            id="modalExamTitle"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="Your course title"
            disabled={isBusy}
            className="w-full text-gray-700 px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="modalDuration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="relative">
            <select
              id="modalDuration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={isBusy}
              className="w-full text-gray-700 appearance-none px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white disabled:bg-gray-100"
            >
              <option value="" disabled>Select timer</option>
              <option value="15 Min">15 Minutes</option>
              <option value="30 Min">30 Minutes</option>
              <option value="45 Min">45 Minutes</option>
              <option value="60 Min">1 Hour</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => !isBusy && setCreationModeSelection('manual')}
            disabled={isBusy}
            className={`p-4 border rounded-xl text-left transition-all duration-200 ${creationModeSelection === 'manual'
              ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-white'
              } ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="mb-4 rounded-md">
                <Image src="/assets/create-quiz/message-edit.svg" alt="Create Test" width={65} height={65} />
              </div>
              <div className={`w-5 h-5 justify-center rounded-full border-2 flex items-center ${creationModeSelection === 'manual' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                {creationModeSelection === 'manual' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
            <h3 className="font-semibold text-sm text-gray-800">Create manually</h3>
            <p className="text-xs text-gray-500">Build your test the way you want</p>
          </button>

          <button
            onClick={() => !isBusy && setCreationModeSelection('ai')}
            disabled={isBusy}
            className={`p-4 border rounded-xl text-left transition-all duration-200 ${creationModeSelection === 'ai'
              ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-white'
              } ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="rounded-md mb-4">
                <Image src="/assets/create-quiz/magicpen.svg" alt="Create Test" width={65} height={65} />
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${creationModeSelection === 'ai' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                {creationModeSelection === 'ai' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
            <h3 className="font-semibold text-sm text-gray-800">Create with AI</h3>
            <p className="text-xs text-gray-500">Auto-generate your test with AI assistance</p>
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={handleClose} disabled={isBusy} className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Cancel
        </button>
        <button type="button" onClick={handleInitialStepSubmit} disabled={isBusy} className="w-full sm:w-1/2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {creationModeSelection === 'manual' ? 'Create Test' : 'Next'}
        </button>
      </div>
    </>
  );

  const renderAiForm = () => (
    <>
      <div className="flex items-center mb-6">
        <button onClick={() => { if (!isBusy) { setCurrentStep('initialStep'); resetAiFormFields(); } }} className={`p-1.5 mr-2 text-gray-500 rounded-md ${isBusy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Create with AI</h2>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-280px)] sm:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <div>
          <label htmlFor="aiFormExamTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Exam Title
          </label>
          <input
            id="aiFormExamTitle"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="e.g., Mid-term UI/UX Exam"
            disabled={isBusy}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scan From document <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <label htmlFor="aiScanDoc" className={`mt-1 flex justify-center px-4 py-5 border-2 border-gray-300 border-dashed rounded-lg ${isBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-blue-400 bg-gray-50 hover:bg-blue-50'} transition-colors`}>
            <div className="text-center">
              <UploadCloud size={28} className="mx-auto text-gray-400" />
              <div className="flex flex-col text-sm text-gray-600 mt-1">
                <span className="font-medium text-blue-600">{aiScannedFile ? aiScannedFile.name : 'Choose folder/File'}</span>
                {!aiScannedFile && <span className="text-gray-500">or drag and drop</span>}
              </div>
              {!aiScannedFile && <p className="text-xs text-gray-500 mt-0.5">PDF, DOCX, TXT up to 10MB</p>}
            </div>
            <input id="aiScanDoc" name="aiScanDoc" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" disabled={isBusy} />
          </label>
          {aiScannedFile && <p className="mt-1 text-xs text-green-600">Selected: {aiScannedFile.name}</p>}
        </div>

        <div>
          <label htmlFor="aiDifficultyLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <div className="relative">
            <select
              id="aiDifficultyLevel"
              value={aiDifficultyLevel}
              onChange={(e) => setAiDifficultyLevel(e.target.value)}
              disabled={isBusy}
              className="w-full appearance-none px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white disabled:bg-gray-100"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="aiTopic" className="block text-sm font-medium text-gray-700 mb-1">
            Topic <span className="text-gray-400 text-xs">(Required if no document)</span>
          </label>
          <input
            id="aiTopic"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="e.g., History of Ancient Rome, JavaScript Basics"
            disabled={isBusy}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
          />
        </div>

        {aiQuestionTypes.map((config, index) => (
          <div key={index} className="space-y-1 p-3 border border-gray-200 rounded-lg bg-white">
            <label className="block text-xs font-medium text-gray-600">Question Type #{index + 1}</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <select
                  value={config.type}
                  onChange={(e) => handleAiQuestionTypeChange(index, 'type', e.target.value)}
                  disabled={isBusy}
                  className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white disabled:bg-gray-100"
                >
                  <option value="multiple-choice">Multiple choice</option>
                  <option value="single-choice">Single choice</option>
                </select>
                <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button type="button" onClick={() => handleAiQuestionTypeChange(index, 'count', config.count - 1)} className="p-1.5 px-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={config.count <= 1 || isBusy}>
                  <Minus size={14} />
                </button>
                <input readOnly value={config.count} className="w-10 text-center border-l border-r border-gray-300 text-sm py-1.5 bg-white" />
                <button type="button" onClick={() => handleAiQuestionTypeChange(index, 'count', config.count + 1)} className="p-1.5 px-2.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={isBusy}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addAiQuestionTypeConfig} disabled={isBusy} className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium py-1.5 px-2 rounded-md hover:bg-blue-50 disabled:opacity-50">
          <Plus size={14} className="mr-1" /> Add type quiz
        </button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={() => !isBusy && setCurrentStep('initialStep')} disabled={isBusy} className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Back
        </button>
        <button type="button" onClick={handleAiFormSubmit} disabled={isBusy} className="w-full sm:w-1/2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {isBusy ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate'
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <button onClick={handleClose} disabled={isBusy} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50" aria-label="Close modal">
        <X size={20} />
      </button>

      {currentStep === 'initialStep' ? renderInitialStep() : renderAiForm()}
    </div>
  );
};

/**
 * Default export — Giữ nguyên cách dùng cũ (có overlay riêng + isOpen).
 * Dùng ở nơi KHÔNG có ModalContainer.
 */
interface CreateQuizModalProps extends CreateQuizModalPanelProps {
  isOpen: boolean;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ isOpen, onClose, onSubmit, isBusy }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={isBusy ? undefined : onClose}>
      <CreateQuizModalPanel onClose={onClose} onSubmit={onSubmit} isBusy={isBusy} />
    </div>
  );
};

export default CreateQuizModal;
