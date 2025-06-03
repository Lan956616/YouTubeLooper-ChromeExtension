import Toggle from "../toggle/Toggle";
import { handleKeyDown } from "../../utils/handleKeyDown";
type InputState = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};
type RangeInputProps = {
  isActive: boolean;
  onToggle: () => void;
  startInput: InputState;
  endInput: InputState;
};
const LoopRangeInput: React.FC<RangeInputProps> = ({
  isActive,
  onToggle,
  startInput,
  endInput,
}) => {
  return (
    <div className="loop-range-input">
      <Toggle onToggle={onToggle} isActive={isActive} />
      <div className="setting-area">
        在
        <input
          type="text"
          className="input"
          value={startInput.value}
          onChange={startInput.onChange}
          onBlur={startInput.onBlur}
          onKeyDown={handleKeyDown}
          onFocus={(event) => event.target.select()}
          onDoubleClick={(event) => event.currentTarget.select()}
        />
        -
        <input
          type="text"
          className="input"
          value={endInput.value}
          onChange={endInput.onChange}
          onBlur={endInput.onBlur}
          onKeyDown={handleKeyDown}
          onFocus={(event) => event.target.select()}
          onDoubleClick={(event) => event.currentTarget.select()}
        />
        間循環播放
      </div>
    </div>
  );
};

export default LoopRangeInput;
