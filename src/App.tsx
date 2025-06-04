import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/formatTime";
import RepeatButton from "./repeatButton/RepeatButton";
import Container from "./container/Container";
import LoopCountDisplay from "./loopCountDisplay/LoopCountDisplay";
import LoopCountInput from "./loopCountInput/LoopCountInput";
import LoopRangeInput from "./loopRangeInput/LoopRangeInput";
import ProgressBar from "./progressBar/ProgressBar";
import { useLoopControl } from "../hooks/useLoopControl";
import { useTimeInputControl } from "../hooks/useTimeInputControl";
import { useDragControl } from "../hooks/useDragControl";
import { useVideoWatcher } from "../hooks/useVideoWatcher";
import { useVideoReset } from "../hooks/useVideoReset";
type AppProps = { videoId: string; duration: number; isDark: boolean };
const App = ({ videoId, duration, isDark }: AppProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isLimitZoned, setIsLimitZoned] = useState<boolean>(false);

  // On initial render, find the video element and assign it to the ref
  useEffect(() => {
    videoRef.current = document.querySelector(".html5-video-container video");
  }, []);
  const {
    isLoop,
    setIsLoop,
    loopCount,
    setLoopCount,
    isLimitTimed,
    setIsLimitTimed,
    maxLoopCount,
    setMaxLoopCount,
    handleMaxLoopChange,
    handleMaxLoopBlur,
    toggleLoop,
    prevMaxLoop,
  } = useLoopControl();
  const startControl = useTimeInputControl(
    0,
    duration,
    true,
    () => endControl.prevTimeRef.current,
    setIsLimitZoned
  );
  const endControl = useTimeInputControl(
    duration,
    duration,
    false,
    () => startControl.prevTimeRef.current,
    setIsLimitZoned
  );
  useVideoReset({
    videoId,
    duration,
    setIsLoop,
    setIsLimitTimed,
    setIsLimitZoned,
    startControl,
    endControl,
    setLoopCount,
    setMaxLoopCount,
    prevMaxLoop,
  });
  const { handleMouseDown, isDraggingLeft, isDraggingRight } = useDragControl(
    duration,
    progressBarRef,
    startControl,
    endControl
  );
  useVideoWatcher(
    videoRef,
    duration,
    isLoop,
    isLimitZoned,
    isLimitTimed,
    startControl,
    endControl,
    prevMaxLoop,
    setLoopCount
  );

  return (
    <div className="app-component">
      <RepeatButton isLoop={isLoop} onClick={toggleLoop} />
      <Container isDark={isDark}>
        <LoopCountDisplay loopCount={loopCount} />
        <LoopCountInput
          isActive={isLimitTimed}
          onToggle={() => {
            setIsLimitTimed(!isLimitTimed);
          }}
          maxLoopCount={maxLoopCount}
          onChange={handleMaxLoopChange}
          onBlur={handleMaxLoopBlur}
        />
        <LoopRangeInput
          isActive={isLimitZoned}
          onToggle={() => {
            setIsLimitZoned(!isLimitZoned);
          }}
          startInput={{
            value: startControl.timeState.input,
            onChange: startControl.handleChange,
            onBlur: startControl.onBlur,
          }}
          endInput={{
            value: endControl.timeState.input,
            onChange: endControl.handleChange,
            onBlur: endControl.onBlur,
          }}
        />
        <ProgressBar
          isActive={isLimitZoned}
          progressBarRef={progressBarRef}
          startState={startControl.timeState}
          endState={endControl.timeState}
          onMouseDown={handleMouseDown}
          isDraggingLeft={isDraggingLeft}
          isDraggingRight={isDraggingRight}
        />
      </Container>
    </div>
  );
};

export default App;
