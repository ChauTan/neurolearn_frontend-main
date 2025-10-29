import React from 'react';

type AnswerOptionData = {
  id?: string;
  _id?: string;
  optionId?: string;
  value?: string | number;
  text?: string;
};

type OptionItemProps = {
  option: AnswerOptionData;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  isMultipleAnswer?: boolean; // checkbox khi true
};

export const OptionItem: React.FC<OptionItemProps> = ({
  option,
  isSelected,
  onSelect,
  isMultipleAnswer = false,
}) => {
  // 🔑 Chuẩn hóa ID cho chắc ăn
  const optionId = React.useMemo(() => String(option?.id ?? option?._id ?? option?.optionId ?? option?.value ?? ''), [option]);


  const handleActivate = () => {
    if (!optionId) return; // Không có ID thì bỏ qua
    onSelect(optionId);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivate();
        }
      }}
      className="relative w-full py-1 pl-4 pr-6 rounded-xl cursor-pointer transition-colors duration-200 bg-white shadow-sm hover:bg-gray-50 select-none"
    >
      {/* Thanh xanh khi chọn — thêm pointer-events-none để không chặn click */}
      {isSelected && (
        <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] w-2.5 rounded-xl bg-[#3858F8]" />
      )}

      <div className="flex items-center justify-between py-1 px-4">
        {/* Text: tự xuống dòng khi dài */}
        <div
          className={`flex-grow flex items-center min-h-[2.75rem] ${isSelected ? 'text-[#0D0D0D]' : 'text-[#6B6B6B]'
            } text-base font-medium leading-5 whitespace-normal break-words hyphens-auto`}
        >
          {option?.text ?? ''}
        </div>

        {/* Nút chọn: checkbox cho multiple, radio cho single */}
        {isMultipleAnswer ? (
          <div
            className={`w-6 h-6 rounded border-[1.5px] flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-[#3858F8] bg-[#3858F8]' : 'border-[#D9D9D9] bg-white'
              }`}
          >
            {isSelected && (

              <svg
                className="w-4 h-4 text-white pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        ) : (
          <div
              className={`w-6 h-6 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-[#3858F8]' : 'border-[#D9D9D9]'
                }`}
          >
              {isSelected && <div className="w-4 h-4 rounded-full bg-[#3858F8]" />}
          </div>
        )}
      </div>
    </div>
  );
};
