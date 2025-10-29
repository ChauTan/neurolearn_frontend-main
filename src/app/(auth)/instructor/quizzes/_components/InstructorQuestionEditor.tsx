// InstructorQuestionEditor.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react'; // useCallback instead of useMemo
import QuizAnswerOption from './QuizAnswerOption';
import ToggleSwitch from './ToggleSwitch';
import { QuestionData, AnswerOptionData } from '../../../../../types/quiz';

import { debounce } from 'lodash'; // Thêm lodash để sử dụng debounce
// import Image from 'next/image';
import QuestionOptionsMenu from './QuestionOptionsMenu';

interface InstructorQuestionEditorProps {
  questionToLoad?: QuestionData | null;
  onQuestionDataChange?: (updatedData: QuestionData) => void;
  onDeleteQuestion?: (questionId: string) => void;
}

const initialOptionsDataForEditor: AnswerOptionData[] = [
  { id: 'default_opt1_editor', text: 'Default Option A' },
  { id: 'default_opt2_editor', text: 'Default Option B' },
];

// Helper function for shallow equality
function shallowEqual(objA: any, objB: any) {
  if (objA === objB) return true;
  if (!objA || !objB) return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
}

const InstructorQuestionEditor: React.FC<InstructorQuestionEditorProps> = ({
  questionToLoad,
  onQuestionDataChange,
  onDeleteQuestion,
}) => {
  const [internalId, setInternalId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState<string>('New Question');
  const [isQuestionRequired, setIsQuestionRequired] = useState<boolean>(true);
  const [questionImageFile, setQuestionImageFile] = useState<File | null>(null);
  const [questionImageUrl, setQuestionImageUrl] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [questionTypeLocal, setQuestionTypeLocal] = useState<'single-choice' | 'multiple-choice'>(
    'single-choice'
  );
  const [options, setOptions] = useState<AnswerOptionData[]>(initialOptionsDataForEditor);
  const [correctAnswerIds, setCorrectAnswerIds] = useState<string[]>([]);
  const [isMultipleAnswerLocal, setIsMultipleAnswerLocal] = useState<boolean>(false);
  const [isAnswerWithImage, setIsAnswerWithImage] = useState<boolean>(false);
  const [points, setPoints] = useState<string>('01');


  const [menuOpenQuestionId, setMenuOpenQuestionId] = useState<string | null>(null);
  // Effect để tải dữ liệu câu hỏi mới khi `questionToLoad` (từ props) thay đổi
  useEffect(() => {
    if (questionToLoad) {
      // Only update if questionToLoad is different from current state
      if (
        internalId !== questionToLoad.id ||
        questionText !== questionToLoad.title ||
        isQuestionRequired !== questionToLoad.isRequired ||
        questionNumber !== questionToLoad.questionNumber ||
        questionTypeLocal !== questionToLoad.questionType ||
        !shallowEqual(options, questionToLoad.options || []) ||
        !shallowEqual(correctAnswerIds, questionToLoad.correctAnswerIds || []) ||
        isMultipleAnswerLocal !== questionToLoad.choicesConfig.isMultipleAnswer ||
        isAnswerWithImage !== questionToLoad.choicesConfig.isAnswerWithImageEnabled ||
        points !== questionToLoad.points ||
        (typeof questionToLoad.questionImage === 'string'
          ? questionImageUrl !== questionToLoad.questionImage
          : questionImageUrl !== null)
      ) {
        setInternalId(questionToLoad.id);
        setQuestionText(questionToLoad.title);
        setIsQuestionRequired(questionToLoad.isRequired);
        setQuestionNumber(questionToLoad.questionNumber);
        setQuestionTypeLocal(questionToLoad.questionType);
        setOptions(questionToLoad.options || []);
        setCorrectAnswerIds(questionToLoad.correctAnswerIds || []);
        setIsMultipleAnswerLocal(questionToLoad.choicesConfig.isMultipleAnswer);
        setIsAnswerWithImage(questionToLoad.choicesConfig.isAnswerWithImageEnabled);
        setPoints(questionToLoad.points);
        setQuestionImageFile(null);
        if (typeof questionToLoad.questionImage === 'string') {
          setQuestionImageUrl(questionToLoad.questionImage);
        } else {
          setQuestionImageUrl(null);
        }
      }
    } else {
      setInternalId(null);
      setQuestionText('Select or add a new question.');
      setOptions(initialOptionsDataForEditor);
      setCorrectAnswerIds([]);
      setIsMultipleAnswerLocal(false);
      setQuestionTypeLocal('single-choice');
      setIsAnswerWithImage(false);
      setPoints('01');
      setIsQuestionRequired(true);
      setQuestionImageFile(null);
      setQuestionImageUrl(null);
    }
  }, [questionToLoad]);

  // Refactor debounced function to use useCallback
  const debouncedOnQuestionDataChange = useCallback(
    debounce((data: QuestionData) => {
      if (onQuestionDataChange) {
        onQuestionDataChange(data);
      }
    }, 500),
    [onQuestionDataChange]
  );

  // useEffect để theo dõi state nội bộ và gọi hàm debounced
  useEffect(() => {
    if (internalId) {
      const currentData: QuestionData = {
        id: internalId,
        questionNumber,
        title: questionText,
        questionType: questionTypeLocal,
        questionImage: questionImageFile || questionImageUrl,
        choicesConfig: {
          isMultipleAnswer: isMultipleAnswerLocal,
          isAnswerWithImageEnabled: isAnswerWithImage,
        },
        options,
        correctAnswerIds,
        points,
        isRequired: isQuestionRequired,
      };
      debouncedOnQuestionDataChange(currentData);
    }
    // Cleanup debounce on unmount or before rerun
    return () => {
      debouncedOnQuestionDataChange.cancel();
    };
  }, [
    internalId,
    questionNumber,
    questionText,
    questionTypeLocal,
    questionImageFile,
    questionImageUrl,
    isMultipleAnswerLocal,
    isAnswerWithImage,
    options,
    correctAnswerIds,
    points,
    isQuestionRequired,
    debouncedOnQuestionDataChange,
  ]);

  // Các hàm handler giờ chỉ cập nhật state nội bộ. useEffect ở trên sẽ xử lý việc gọi onQuestionDataChange.
  const handleSetQuestionText = (text: string) => setQuestionText(text);
  const handleSetIsQuestionRequired = (checked: boolean) => setIsQuestionRequired(checked);
  // const handleSetIsAnswerWithImage = (checked: boolean) => setIsAnswerWithImage(checked);

  const handleToggleMultipleAnswerInternal = (checked: boolean) => {
    setIsMultipleAnswerLocal(checked);
    setQuestionTypeLocal(checked ? 'multiple-choice' : 'single-choice');
    if (!checked && correctAnswerIds.length > 1) {
      setCorrectAnswerIds([correctAnswerIds[0]]);
    }
  };

  const handleOptionTextChange = (id: string, newText: string) => {
    setOptions(prev => prev.map(opt => (opt.id === id ? { ...opt, text: newText } : opt)));
  };
  const handleDeleteOption = (id: string) => {
    setOptions(prev => prev.filter(opt => opt.id !== id));
    setCorrectAnswerIds(prev => prev.filter(correctId => correctId !== id));
  };
  const handleMarkCorrect = (id: string) => {
    if (isMultipleAnswerLocal) {
      setCorrectAnswerIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
    } else {
      setCorrectAnswerIds([id]);
    }
  };
  const handleAddOption = () => {
    const key = `opt_${Date.now()}_editor`;
    setOptions(prev => [...prev, { id: key, text: 'New Option' }]);
  };
  const handlePointsValueChange = (value: string) => {
    if (/^\d{0,2}$/.test(value)) {
      setPoints(value);
    }
  };
  const handlePointsValueBlur = (currentValue: string) => {
    let finalValue = currentValue;
    if (currentValue.length === 1) {
      finalValue = `0${currentValue}`;
    } else if (currentValue.length === 0) {
      finalValue = '00';
    }
    setPoints(finalValue);
  };
  // const handleLocalQuestionImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     if (file.size > 10 * 1024 * 1024) {
  //       alert('File size too large! Maximum 10MB.');
  //       event.target.value = '';
  //       return;
  //     }
  //     setQuestionImageFile(file);
  //     setQuestionImageUrl(null);
  //   }
  // };

  if (!internalId) {
    return (
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Please select a question from the sidebar or add a new one.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl  w-full mx-auto">
      <div className="flex items-center justify-between mb-4 text-black pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <span className="text-base font-medium text-gray-800 capitalize">
            {questionTypeLocal.replace('-', ' ')}
          </span>
        </div>
        <div className="flex relative items-center space-x-3">
          <span className="text-xs sm:text-sm text-gray-600">Required</span>
          <ToggleSwitch
            id={`req-${internalId}`}
            checked={isQuestionRequired}
            onChange={handleSetIsQuestionRequired}
            activeColor="bg-green-500"
          />
          <button
            className="text-gray-400 hover:text-gray-600 p-1"
            onClick={e => {
              e.stopPropagation();
              setMenuOpenQuestionId(prev =>
                prev === questionToLoad?.id ? null : questionToLoad?.id ?? null
              );
            }}
            title="More options">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            {menuOpenQuestionId === questionToLoad?.id && (
              <QuestionOptionsMenu
                onDuplicate={() => {
                  console.log('Duplicate', questionToLoad?.id);
                  setMenuOpenQuestionId(null);
                }}
                onDelete={() => {
                  if (questionToLoad?.id && onDeleteQuestion) {
                    onDeleteQuestion(questionToLoad.id);
                  }
                  setMenuOpenQuestionId(null);
                }}
              />
            )}
          </button>
        </div>
      </div>
      <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
        {' '}
        Question {questionNumber}{' '}
      </h4>
      <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
        <textarea
          value={questionText}
          onChange={e => handleSetQuestionText(e.target.value)}
          placeholder="Ví dụ: Trong các nguyên tắc thiết kế trực quan..."
          className="flex-grow w-full p-3  border border-gray-300 rounded-md resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] text-sm text-black"
        />
        {/* <div
          className="w-full md:w-48 md:flex-shrink-0 h-25 md:min-h-[100px] flex flex-col items-center justify-center p-3 border-2 border-dashed border-blue-300 rounded-md bg-blue-50 text-center cursor-pointer hover:bg-blue-100 group transition-colors"
          onClick={() => document.getElementById(`questionImageUpload-${internalId}`)?.click()}
        >
          <input
            type="file"
            id={`questionImageUpload-${internalId}`}
            className="hidden"
            accept="image/*"
            onChange={handleLocalQuestionImageChange}
          />
          {questionImageUrl && !questionImageFile && (
            <div className="relative w-full max-w-[150px] h-20 mb-2">
              <Image
                src={questionImageUrl}
                alt="Question Preview"
                layout="fill" // Hoặc width/height cố định
                objectFit="contain" // Maintain ratio and display full image
                className="rounded-md" // Thêm class nếu muốn bo góc ảnh
              />
            </div>
          )}
          {questionImageFile && (
            <div className="relative w-full max-w-[150px] h-20 mb-2">
              <Image
                src={URL.createObjectURL(questionImageFile)}
                alt="New Question Image Preview"
                layout="fill"
                objectFit="contain"
                className="rounded-md"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(questionImageFile))} // Free memory after image loads
              />
            </div>
          )}
          {!questionImageUrl && !questionImageFile && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-400 group-hover:text-blue-500 mb-1.5 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
          <p className="text-xs text-black group-hover:text-blue-600">
            {' '}
            Drag and drop or <br /> <span className="font-semibold text-blue-500">
              Choose File
            </span>{' '}
            to upload{' '}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">(Max 10MB)</p>
          {questionImageFile && (
            <p className="text-xs text-green-600 mt-1 truncate w-full px-2">
              {' '}
              New: {questionImageFile.name}{' '}
            </p>
          )}
        </div> */}
      </div>
      <>
        <div className="flex items-center space-x-3 gap-2 mb-5 text-sm border-t border-gray-200 pt-4">
          <span className="font-semibold text-gray-700">Choices</span>
          <span className="text-gray-600 font-semibold">|</span>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600 font-semibold">Multiple answer</span>
            <ToggleSwitch
              id={`multipleAnswerToggle-${internalId}`}
              checked={isMultipleAnswerLocal}
              onChange={handleToggleMultipleAnswerInternal}
            />
          </div>
          {/* <div className="flex items-center">
            <span className="mr-2 text-gray-600 font-semibold">Answer with image</span>
            <ToggleSwitch
              id={`answerWithImageToggle-${internalId}`}
              checked={isAnswerWithImage}
              onChange={handleSetIsAnswerWithImage}
              activeColor="bg-green-500"
            />
          </div> */}
        </div>
        <div className="space-y-1 mb-5">
          {options.map(option => (
            <QuizAnswerOption
              key={option.id}
              id={option.id}
              text={option.text}
              isCorrectAnswer={correctAnswerIds.includes(option.id)}
              uniqueQuestionId={internalId || 'default_opts_group'}
              onSelect={handleMarkCorrect}
              onTextChange={handleOptionTextChange}
              onDelete={handleDeleteOption}
              inputType={isMultipleAnswerLocal ? 'checkbox' : 'radio'}
            />
          ))}
        </div>
      </>
      <div className="flex cursor-pointer items-center gap-8 pt-4 border-t border-gray-200 justify-between">
        <button
          onClick={handleAddOption}
          className="flex border cursor-pointer border-amber-50 bg-[#eceaea] py-2 px-3 rounded-3xl items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
          Add answer
        </button>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={points}
            onChange={e => handlePointsValueChange(e.target.value)}
            onBlur={e => handlePointsValueBlur(e.target.value)}
            className="w-14 text-sm font-semibold text-gray-800 text-center bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-300 focus:rounded-sm p-0 m-0"
            maxLength={2}
            placeholder="00"
          />
          <span className="text-gray-300 mx-1.5 text-sm">|</span>
          <span className="text-sm text-gray-600 mr-2">Points</span>
          <button className="text-gray-400 hover:text-gray-500 p-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.566.379-1.566 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.566 2.6 1.566 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.566-.379-1.566-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorQuestionEditor;
