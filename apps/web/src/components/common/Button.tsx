import Icon from "./Icon";
import { type IconName } from "./Icon/paths";

interface ButtonProps {
  icon?: IconName;
  label?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ icon, label, className, onClick, disabled }: ButtonProps) => {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`${className} select-none ${
        disabled ? "cursor-not-allowed grayscale-[0.5] opacity-60" : "cursor-pointer active:brightness-98 active:scale-95 transition-transform duration-200"
      } bg-brand-accent text-surface rounded-full flex gap-3 justify-center items-center ${label ? "px-4 py-3" : "p-3"}`}
    >
      {icon && <Icon name={icon!} size={24} />}
      {label && <p>{label}</p>}
    </button>
  );
};

export default Button;