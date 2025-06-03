import type { BaseState } from "@/App";

type ProgressBarProps = {
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  startState: BaseState;
  endState: BaseState;
  onMouseDown: (side: string) => void;
  isDraggingLeft: boolean;
  isDraggingRight: boolean;
};
const ProgressBar: React.FC<ProgressBarProps> = ({
  progressBarRef,
  isActive,
  startState,
  endState,
  onMouseDown,
  isDraggingLeft,
  isDraggingRight,
}) => {
  return (
    <div className="progress-bar" ref={progressBarRef}>
      <div
        className={`limited-progress-bar ${isActive && "active"}`}
        style={{
          left: `${startState.position}% `,
          right: `${100 - endState.position}% `,
        }}
      ></div>
      <div
        className={`progress-dot ${isDraggingLeft && "active"}`}
        style={{
          left: `${startState.position}% `,
        }}
        onMouseDown={() => {
          onMouseDown("left");
        }}
      >
        <div className="time-display">{startState.time}</div>
      </div>
      <div
        className={`progress-dot ${isDraggingRight && "active"}`}
        style={{
          left: `${endState.position}% `,
        }}
        onMouseDown={() => {
          onMouseDown("right");
        }}
      >
        <div className="time-display">{endState.time}</div>
      </div>
    </div>
  );
};

export default ProgressBar;
