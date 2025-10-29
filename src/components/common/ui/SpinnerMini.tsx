// components/SpinnerMini.tsx (hoặc đường dẫn của bạn)
import React from 'react';

interface SpinnerMiniProps {
  /**
   * Đường kính của spinner. Có thể là số (pixels) hoặc chuỗi (ví dụ: "1.5em").
   * @default "1.25em" (co giãn theo kích thước chữ, ~20px nếu font-size là 16px)
   */
  size?: number | string;
  /**
   * Màu của phần hoạt động (đang xoay) của spinner.
   * Mặc định là "currentColor" để kế thừa màu chữ hiện tại.
   * @default "currentColor"
   */
  color?: string;
  /**
   * Màu của phần rãnh (phần tĩnh, thường nhạt hơn của vòng spinner).
   * @default "rgba(0, 0, 0, 0.1)" (Light dark color, suitable for light background)
   * Nếu dùng trên nền tối, hãy cân nhắc đổi thành "rgba(255, 255, 255, 0.2)"
   */
  trackColor?: string;
  /**
   * Độ dày của vòng spinner. Có thể là số (pixels) hoặc chuỗi (ví dụ: "0.125em").
   * @default "0.125em" (co giãn theo kích thước chữ, ~2px nếu font-size là 16px)
   */
  thickness?: number | string;
  /**
   * Tốc độ animation tính bằng giây.
   * @default 0.75
   */
  speed?: number;
  /**
   * Tùy chọn: các class CSS bổ sung.
   */
  className?: string;
  /**
   * Tùy chọn: style inline.
   */
  style?: React.CSSProperties;
  /**
    * Hidden text for screen readers (e.g., "Loading...").
 * @default "Loading..."
   */
  screenReaderText?: string;
}

export default function SpinnerMini({
  size = '1.25em',
  color = 'currentColor',
  trackColor = 'rgba(0, 0, 0, 0.1)', // Mặc định cho nền sáng
  thickness = '0.125em',
  speed = 0.75,
  className = '',
  style = {},
      screenReaderText = 'Loading...',
}: SpinnerMiniProps) {
  const currentSize = typeof size === 'number' ? `${size}px` : size;
  const currentThickness = typeof thickness === 'number' ? `${thickness}px` : thickness;

  const spinnerStyle: React.CSSProperties = {
    width: currentSize,
    height: currentSize,
    borderWidth: currentThickness,
    borderStyle: 'solid',
    borderColor: trackColor, // Màu của rãnh (phần tĩnh)
    borderTopColor: color, // Màu của phần đang xoay
    animationDuration: `${speed}s`,
    ...style, // Cho phép ghi đè bằng style inline
  };

  return (
    <div
      className={`spinner-mini-enhanced ${className}`}
      style={spinnerStyle}
      role="status" // Thuộc tính ARIA cho biết đây là một trạng thái đang cập nhật
      aria-live="polite" // Thông báo cho trình đọc màn hình một cách lịch sự
    >
      {screenReaderText && <span className="visually-hidden">{screenReaderText}</span>}
    </div>
  );
}
