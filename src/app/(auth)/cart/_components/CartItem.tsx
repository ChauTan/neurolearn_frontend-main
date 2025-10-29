import Image from 'next/image';

interface CartItemProps {
  course: any;
  onRemove: (courseId: string) => void;
  onPackageChange: (courseId: string, newIndex: number) => void;
  showPackageSelector?: boolean;
}

const formatVND = (amount: number): string => {
  return `${amount.toLocaleString('en-US')} VND`;
};

export function CartItem({
  course,
  onRemove,
  onPackageChange,
  showPackageSelector,
}: CartItemProps) {
  // Sử dụng selectedPackageIndex từ props thay vì state local
  const selectedPackageIndex = typeof course.selectedPackageIndex === 'number'
    ? course.selectedPackageIndex
    : 0;

  const handlePackageChange = (courseId: string, newIndex: number) => {
    onPackageChange(courseId, newIndex);
  };

  // Nếu có package thì lấy package đang chọn
  const selectedPackage =
    course?.coursePackage && course.coursePackage.length > 0 && selectedPackageIndex >= 0 && selectedPackageIndex < course.coursePackage.length
      ? course.coursePackage[selectedPackageIndex]
      : null;

  // Giá đơn vị
  const unitPrice = showPackageSelector && selectedPackage ? selectedPackage.price || 0 : course?.price || 0;

  // Tổng giá (quantity = 1 khi không có package)
  const totalPrice = showPackageSelector ? unitPrice : unitPrice * 1;

  return (
    <div className="grid grid-cols-1 items-center gap-4 px-6 py-4 md:grid-cols-6">
      {/* --- Product Details --- */}
      <div className="col-span-1 flex items-center gap-4 md:col-span-3">
        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded">
          <Image src={course?.thumbnail?.url} alt={course?.name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{course?.name}</h3>
          <button
            onClick={() => onRemove(course?._id)}
            className="mt-1 text-sm font-medium hover:cursor-pointer text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>

      {/* --- Package Selector --- */}
      {showPackageSelector && course?.coursePackage && course.coursePackage.length > 0 && (
        <div className="flex items-center justify-start gap-2 md:justify-center">
          <div className="w-full max-w-sm min-w-[100px] relative">
            <select
              value={selectedPackageIndex}
              onChange={e => handlePackageChange(course._id, parseInt(e.target.value))}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
            >
              {course.coursePackage.map((pkg: any, index: number) => (
                <option key={index} value={index}>
                  {pkg.package}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </div>
        </div>
      )}

      {/* --- Unit Price --- */}
      <div className="text-right font-semibold text-gray-900">
        {unitPrice > 0 ? formatVND(unitPrice) : 'Free'}
      </div>

      {/* --- Total Price --- */}
      <div className="text-right font-semibold text-gray-900">
        {totalPrice > 0 ? formatVND(totalPrice) : 'Free'}
      </div>
    </div>
  );
}
