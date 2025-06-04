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
type AppProps = { videoId: string; duration: number; isDark: boolean };
const App = ({ videoId, duration, isDark }: AppProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isLimitZoned, setIsLimitZoned] = useState<boolean>(false);
  //1.組件初次渲染時 找到影片更新ref值
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

  //2.當影片改變時
  useEffect(() => {
    //關閉所有循環功能
    setIsLoop(false);
    setIsLimitTimed(false);
    setIsLimitZoned(false);
    //初始化入＋出點時間
    startControl.setTimeState({
      time: "0:00",
      input: "0:00",
      position: 0,
    });
    endControl.setTimeState({
      time: formatTime(duration),
      input: formatTime(duration),
      position: 100,
    });
    startControl.prevTimeRef.current = 0;
    endControl.prevTimeRef.current = duration;
    //初始化已播放次數
    setLoopCount(0);
    //初始化限定播放次數
    setMaxLoopCount(10);
    prevMaxLoop.current = 10;
  }, [videoId]);

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
