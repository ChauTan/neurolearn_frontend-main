// Helper component for ToggleSwitch
interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeColor?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  activeColor = 'bg-green-500' /* Màu xanh lá khi active mặc định */,
}) => {
  const bgColor = checked ? activeColor : 'bg-gray-300'; // Màu xám khi không active
  const knobPosition = checked ? 'translate-x-5' : 'translate-x-0'; // Cho track w-10 và knob w-4

  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only" // Ẩn checkbox mặc định
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        {/* Phần track của toggle */}
        <div
          className={`block w-11 h-6 rounded-full transition-colors duration-150 ease-in-out ${bgColor}`}
        ></div>
        {/* Phần knob (nút trượt) của toggle */}
        <div
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-150 ease-in-out transform ${knobPosition}`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
