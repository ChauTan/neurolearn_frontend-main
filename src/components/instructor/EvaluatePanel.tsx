'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Star as StarFilled, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';

type ReviewItem = {
  _id: string;
  rating: number;
  comment: string;
  user?: { name?: string; avatar?: { url?: string } };
  createdAt?: string | Date;
};

type EvaluatePanelProps = Readonly<{
  courseId?: string;       // may be empty while loading
  reviews?: ReviewItem[];  // default []
  onReviewAdded?: () => void;
}>;

export default function EvaluatePanel({
  courseId,
  reviews = [],
  onReviewAdded,
}: EvaluatePanelProps) {
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth) as {
    user?: { name?: string; avatar?: { url?: string } };
  };

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const MAX_LENGTH = 150;
  const myAvatarSrc = user?.avatar?.url || '/assets/images/avatar.png';

  const handleSubmit = async () => {
    if (!courseId) {
      toast({
        title: 'Missing information',
        variant: 'destructive',
        description: 'Course ID is required to submit a review.',
      });
      return;
    }
    if (!selectedRating || comment.trim() === '') {
      toast({
        title: 'Validation Error',
        variant: 'destructive',
        description: 'Please provide a rating and a comment.',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/add-review/${courseId}`,
        { rating: selectedRating, review: comment.trim() },
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast({
          title: 'Success',
          variant: 'success',
          description: 'Review submitted successfully.',
        });
        setSelectedRating(null);
        setComment('');
        onReviewAdded?.();
      } else {
        toast({
          title: 'Failed',
          variant: 'destructive',
          description: 'Failed to submit review.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow space-y-6">
      {/* Rating Input */}
      <div className="flex items-start gap-4">
        <Image
          src={myAvatarSrc}
          alt="Your avatar"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-black text-sm font-medium">
            <span>Rate this course:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={`cursor-pointer ${selectedRating && selectedRating >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-black'
                  }`}
                onClick={() => setSelectedRating(star)}
              />
            ))}
          </div>

          <textarea
            rows={3}
            maxLength={MAX_LENGTH}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-[#F7F8FA] rounded-2xl px-4 py-3 text-sm text-black outline-none placeholder-[#D9D9D9]"
          />
          <div className="text-right text-xs text-gray-400">
            {comment.length}/{MAX_LENGTH} characters
          </div>
          <div className="text-right">
            <button
              onClick={handleSubmit}
              disabled={loading} // only disabled while submitting
              className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback header */}
      <div className="flex items-center justify-start gap-4">
        <h3 className="text-base text-black font-semibold">Student Reviews</h3>
        <button
          type="button"
          className="flex items-center gap-2 bg-[#F7F8FA] text-base text-black px-3 py-1 rounded-full"
        >
          Rating
          <ChevronDown size={20} className="text-[#0D0D0D]" />
        </button>
      </div>

      {/* Feedback list */}
      {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((fb) => {
          const name = fb?.user?.name ?? 'Anonymous';
          const avatarSrc = fb?.user?.avatar?.url || '/assets/images/avatar.png';
          const rating = Number(fb?.rating) || 0;
          const created = fb?.createdAt
            ? new Date(fb.createdAt as any).toLocaleDateString()
            : 'N/A';

          return (
            <div
              key={fb?._id ?? Math.random().toString(36)}
              className="flex items-start gap-3 p-4 bg-[#F9FAFB] rounded-xl"
            >
              <Image
                src={avatarSrc}
                alt={`${name}'s avatar`}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-black font-semibold">{name}</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarFilled
                        key={star}
                        size={16}
                        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{created}</div>
                <p className="text-sm mt-1 text-black">{fb?.comment ?? ''}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">No feedback yet.</p>
      )}
    </div>
  );
}
