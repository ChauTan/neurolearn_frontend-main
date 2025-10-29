'use client';

import { useState } from 'react';
import { ChevronDown, Play, X } from 'lucide-react';
import Image from 'next/image';
import { ILesson, ISection } from '@/types/course';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

// Video Modal Component
const VideoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  lessonTitle: string;
}> = ({ isOpen, onClose, videoUrl, lessonTitle }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/80 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-900">{lessonTitle}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <ReactPlayer
              url={videoUrl}
              controls
              width="100%"
              height="100%"
              playing={true}
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload',
                    disablePictureInPicture: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default function CourseContent({
  sections,
  showVideo = true, // 👈 thêm cờ
}: {
  sections: ISection[];
  showVideo?: boolean;
}) {
  const [openSections, setOpenSections] = useState<number[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const toggleSection = (index: number) => {
    setOpenSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleLessonClick = (lesson: ILesson) => {
    if (!showVideo) return; // 👈 không cho mở modal nếu tắt
    if (lesson.videoUrl?.url) {
      setSelectedVideo({
        url: lesson.videoUrl.url,
        title: lesson.title,
      });
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="max-w-full mx-auto text-[#131836]">
      <h2 className="text-3xl font-semibold mb-4">Course content</h2>

      {sections.map((section, sectionKey) => {
        const totalLessons = section.lessons?.length || 0;

        return (
          <div
            key={sectionKey}
            className="rounded-xl bg-[#F9F9F9] w-full mb-6 overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleSection(sectionKey)}
              className="flex justify-between h-[80px] items-center w-full px-4 py-3 text-left text-xl font-bold bg-[#ECECEC] focus:outline-none focus:ring-0 focus:border-none"
            >
              <div>{section.title}</div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-normal whitespace-nowrap">
                  {totalLessons} lectures
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openSections.includes(sectionKey) ? 'rotate-180' : ''
                    }`}
                />
              </div>
            </button>

            {openSections.includes(sectionKey) && (
              <div className="text-sm">
                {section.lessons?.map((lesson: ILesson, idx: number) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition-colors ${showVideo && lesson.videoUrl?.url
                      ? 'cursor-pointer group'
                      : ''
                      }`}
                    onClick={() =>
                      showVideo && lesson.videoUrl?.url && handleLessonClick(lesson)
                    }
                    title={
                      showVideo && lesson.videoUrl?.url
                        ? 'Click to watch video'
                        : 'No video available'
                    }
                  >
                    <div className="flex items-center gap-2 h-[40px]">
                      <span className="p-2">
                        {lesson.videoUrl?.url ? (
                          <Play className="w-5 h-5 text-blue-600 group-hover:text-blue-800 transition-colors" />
                        ) : (
                            <Image
                              src={`/assets/icons/number-${idx + 1}.svg`}
                              alt={`number ${idx + 1}`}
                              width={20}
                              height={20}
                            />
                        )}
                      </span>
                      <span className="text-[#3A3C45] text-xl">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#3A3C45]">
                      {lesson.isFree && (
                        <span className="bg-[#3858F8] text-white text-xs px-2 py-0.5 rounded">
                          Preview
                        </span>
                      )}
                      {lesson.videoUrl?.url && showVideo && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                          Video
                        </span>
                      )}
                      <span>
                        {lesson.videoLength ? `${lesson.videoLength}m` : '--'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Video Modal */}
      {showVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={closeVideoModal}
          videoUrl={selectedVideo?.url || ''}
          lessonTitle={selectedVideo?.title || ''}
        />
      )}
    </div>
  );
}
