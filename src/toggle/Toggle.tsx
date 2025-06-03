type ToggleProps = {
  onToggle: () => void;
  isActive: boolean;
};
const Toggle: React.FC<ToggleProps> = ({ onToggle, isActive }) => {
  return (
    <div
      className={`toggle-container ${isActive && "active"}`}
      onClick={onToggle}
    >
      <div className="toggle"></div>
    </div>
  );
};

export default Toggle;
