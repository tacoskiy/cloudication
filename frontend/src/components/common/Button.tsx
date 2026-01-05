import Icon from "./Icon";
import { type IconName } from "./Icon/paths";

interface ButtonProps {
  icon?: IconName;
  label?: string;
  className?: string;
  onClick?: () => void;
}

const Button = ({ icon, label, className, onClick }:ButtonProps) => {
  return (
    <button onClick={onClick} className={`${className} cursor-pointer bg-accent-success text-text-invert rounded-full flex gap-3 active:brightness-125 ${label ? "px-4 py-3" : "p-3"}`}>
      {icon && <Icon name={icon!} size={24}/>}
      {label && <p>{label}</p>}
    </button>
  );
}

export default Button;