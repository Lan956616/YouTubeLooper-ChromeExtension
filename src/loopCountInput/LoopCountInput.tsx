import Toggle from "../toggle/Toggle";
import { handleKeyDown } from "../../utils/handleKeyDown";
type InputProps = {
  isActive: boolean;
  onToggle: () => void;
  maxLoopCount: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};
const LoopCountInput: React.FC<InputProps> = ({
  isActive,
  onToggle,
  maxLoopCount,
  onChange,
  onBlur,
}) => {
  return (
    <div className="loop-count-input">
      <Toggle onToggle={onToggle} isActive={isActive} />
      <div className="setting-area">
        循環播放
        <input
          type="number"
          className="input small"
          value={maxLoopCount}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          onFocus={(event) => event.currentTarget.select()}
          onDoubleClick={(event) => event.currentTarget.select()}
        />
        次
      </div>
    </div>
  );
};

export default LoopCountInput;
