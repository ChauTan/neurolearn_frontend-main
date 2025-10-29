'use client';

import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { redirect } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useModal } from '@/context/ModalContext';

interface CourseCardProps {
  course: {
    _id: string;
    name?: string;
    description?: string;
    price?: number;
    estimatedPrice?: number;
    isFree?: boolean;
    durationText?: string;
    totalLessons?: number;
    purchased?: number;
  };
}

export default function CourseCard({ course }: { course: CourseCardProps['course'] }) {
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const { showModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const discount =
    typeof course.estimatedPrice === 'number' && typeof course.price === 'number'
      ? Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100)
      : 0;
  useEffect(() => {
    if (!course._id) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/${course._id}/is-purchased`, {
        withCredentials: true,
      })
      .then(res => {
        setIsPurchased(res.data.isPurchased);
      })
      .catch(err => {
        console.error('Check purchased error:', err);
      });
  }, [course._id]);

  const checkCourseExistInCart = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/cart/cart-items`, {
        withCredentials: true,
      });
      const cartItems = response.data.cart.items;
      return cartItems.some((item: any) => item?.courseId._id === course._id);
    } catch (error) {
      console.error('Error checking cart:', error);
      return false;
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'You are not login now!',
        description: 'Please login to continue.',
        duration: 3000,
      });
      showModal('login');
      return;
    }

    if (!course._id) {
      toast({
        variant: 'destructive',
        title: 'CourseId not found!',
      });
      return;
    }

    try {
      const alreadyExists = await checkCourseExistInCart();

      if (alreadyExists) {
        toast({
          variant: 'destructive',
          title: 'This course is already in your cart',
          description: 'You can check it in your cart.',
          duration: 3000,
        });
        return;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/cart/add-to-cart`,
        { courseId: course._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast({
          variant: 'success',
          title: 'Course added to your cart!',
          description: 'You can check it in your cart.',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to add course to cart',
        description: 'Please try again later.',
      });
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'You are not logged in!',
        description: 'Please login to buy the course.',
        duration: 3000,
      });
      redirect('/');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/payment/create-payment-link`,
        {
          amount: course.price,
          description: `Buy course from Academix`,
          courseIds: [course._id],
          licenseQuantities: {
            [course._id]: 1,
          },
        },
        { withCredentials: true }
      );

      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to initiate payment.',
        });
      }
    } catch (error) {
      console.error('Buy now error:', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong.',
        description: 'Unable to create payment link.',
      });
    }
  };

  return (
    <div className="w-[395px] bg-white rounded-2xl max-w-full mx-auto">
      <div className="flex justify-between items-start">
        {/* LEFT: Giá gốc và tên khóa */}
        <div className="bg-white rounded-t-2xl pl-4 pt-4">
          <div className="w-[250px] h-[50px] space-y-2">
            <p className="text-xl text-black">Full course</p>
            {course.estimatedPrice && (
              <div className="text-xl text-gray-400 line-through">
                {course.estimatedPrice.toLocaleString()} VNĐ
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Tag giảm giá */}
        {discount > 0 && (
          <div className="w-[145px] h-[75px] bg-[#F7F8FA] flex items-center justify-center rounded-bl-2xl">
            <span className="bg-[#3858F8] text-white text-base font-medium rounded-full w-[86px] h-[30px] flex items-center justify-center">
              {discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Course includes */}
      <div className="text-black pb-4">
        <div className="text-sm space-y-4 px-4">
          <div className="text-4xl text-[#3858F8] mt-2">
            {course.isFree ? 'Free' : `${(course.price ?? 0).toLocaleString()} VNĐ`}
          </div>

          <div className="text-black text-2xl">Course includes</div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/play.svg" alt="Play" width={20} height={20} />
            {course.durationText || '0h 0m'} video on-demand
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/article.svg" alt="Article" width={20} height={20} />
            {course.totalLessons || 0} lessons
          </div>
          <div className="flex items-center gap-3">
            <Image src="/assets/icons/download-file.svg" alt="Download" width={20} height={20} />
            Downloadable resources
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/document.svg" alt="Document" width={20} height={20} />
            Practice test
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/upload-file.svg" alt="Upload" width={20} height={20} />
            Practical sharing article
          </div>

          <div className="flex items-center gap-3">
            <Image src="/assets/icons/completion.svg" alt="Certificate" width={20} height={20} />
            Certificate of Completion
          </div>
        </div>
      </div>

      {isPurchased ? (
        <button
          className="w-[calc(100%-32px)] h-14 mx-4 my-4 text-center text-xl text-white font-bold rounded-lg bg-green-600 hover:bg-green-700 transition"
          onClick={() => redirect(`/watch-course/${course._id}`)}
        >
          Go to course
        </button>
      ) : (
        <>
          <div className="flex items-center gap-2 px-4 h-[60px]">
            <button
              onClick={addToCart}
              className="flex-1 h-14 bg-[#3858F8] text-white text-xl rounded-lg hover:bg-blue-700 transition"
            >
              Add to cart
            </button>
            <Image
              src="/assets/icons/bookmark.svg"
              alt="Bookmark"
              className="bg-[#ECECEC] h-14 w-14 rounded-md p-2"
              width={30}
              height={30}
            />
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-[calc(100%-32px)] h-14 mx-4 my-4 text-center text-xl text-[#3858F8] font-bold rounded-lg bg-[#ECECEC] hover:bg-gray-200 transition"
          >
            Buy now
          </button>
        </>
      )}

      <Dialog as={Fragment} open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
              Do you want to buy this course?
            </Dialog.Title>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleBuyNow();
                }}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
