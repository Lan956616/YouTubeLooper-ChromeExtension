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
type AppProps = { videoId: string; duration: number; isDark: boolean };

const App = ({ videoId, duration, isDark }: AppProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const isJumpingRef = useRef<boolean>(false);
  const [isLimitZoned, setIsLimitZoned] = useState<boolean>(false);
  const [isDraggingLeft, setIsDraggingLeft] = useState<boolean>(false);
  const [isDraggingRight, setIsDraggingRight] = useState<boolean>(false);

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
  const dragControl = {
    handleMouseDown: (side: string) => {
      if (isDraggingRight || isDraggingLeft) {
        return;
      }
      if (side === "left") {
        setIsDraggingLeft(true);
      } else if (side === "right") {
        setIsDraggingRight(true);
      }
    },
  };

  //1.組件初次渲染時 找到影片更新ref值
  useEffect(() => {
    videoRef.current = document.querySelector(".html5-video-container video");
  }, []);
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
  //3.根據循環模式監聽影片播放
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    const resetVideo = (newTime: number, shouldPlay: boolean) => {
      if (videoRef.current === null) {
        return;
      }
      isJumpingRef.current = true;
      videoRef.current.pause();
      videoRef.current.currentTime = newTime;
      setTimeout(() => {
        isJumpingRef.current = false;
        if (shouldPlay && videoRef.current) {
          videoRef.current.play();
        }
      }, 250);
    };
    const handleTimeUpdate = () => {
      //若 循環按鈕沒被按開 或 影片正在跳轉時間時return
      if (!isLoop || isJumpingRef.current || !videoRef.current) {
        return;
      }
      const userStartTime = startControl.prevTimeRef.current;
      const userEndTime = endControl.prevTimeRef.current;
      const userLimitTime = prevMaxLoop.current;
      const currentTime = videoRef.current.currentTime;
      //開啟 區間播放模式 或 限定次數＋區間模式 時
      if (isLimitZoned) {
        if (currentTime < userStartTime) {
          resetVideo(userStartTime, true);
          return;
        }
        if (currentTime >= userEndTime - 0.5) {
          setLoopCount((prev) => {
            const shouldContinue = !isLimitTimed || prev + 1 < userLimitTime;
            resetVideo(userStartTime, shouldContinue);
            return prev + 1;
          });
          return;
        }
      }
      //開啟無限循環模式 或 限定次數循環模式 時
      if (!isLimitZoned && currentTime >= duration - 0.5) {
        setLoopCount((prev) => {
          const shouldContinue = !isLimitTimed || prev + 1 < userLimitTime;
          resetVideo(0, shouldContinue);
          return prev + 1;
        });
        return;
      }
    };
    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      if (!videoRef.current) {
        return;
      }
      videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isLoop, isLimitTimed, isLimitZoned, duration]);
  //4.拉桿滑動功能
  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  };
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingLeft && !isDraggingRight) {
        return;
      }
      const progressBar = progressBarRef.current;
      if (!progressBar) {
        return;
      }
      const rect = progressBar.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const percentage = Math.min(
        Math.max((offsetX / rect.width) * 100, 0),
        100
      );
      const newPercentage = isDraggingLeft
        ? Math.min(percentage, endControl.timeState.position - 3)
        : Math.max(percentage, startControl.timeState.position + 3);
      const newTime = (newPercentage / 100) * duration;
      if (isDraggingLeft) {
        startControl.prevTimeRef.current = newTime;
        startControl.setTimeState({
          time: formatTime(newTime),
          input: formatTime(newTime),
          position: newPercentage,
        });
      } else if (isDraggingRight) {
        endControl.prevTimeRef.current = newTime;
        endControl.setTimeState({
          time: formatTime(newTime),
          input: formatTime(newTime),
          position: newPercentage,
        });
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    duration,
    startControl.timeState.position,
    endControl.timeState.position,
    isDraggingLeft,
    isDraggingRight,
  ]);
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
          onMouseDown={dragControl.handleMouseDown}
          isDraggingLeft={isDraggingLeft}
          isDraggingRight={isDraggingRight}
        />
      </Container>
    </div>
  );
};

export default App;
