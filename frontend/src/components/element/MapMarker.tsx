type Props = {
  title: string;
  selected?: boolean;
  onClick?: () => void;
};

export function MapMarker({ title, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-lg text-xs font-medium
        shadow-md transition
        ${selected ? "bg-blue-600 text-white scale-110" : "bg-white text-black"}
      `}
    >
      {title}
    </button>
  );
}
