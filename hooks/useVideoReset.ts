import { useEffect } from "react";
import { formatTime } from "../utils/formatTime";
import type { TimeControlType } from "../hooks/useTimeInputControl";
type UseVideoResetProps = {
  videoId: string;
  duration: number;
  setIsLoop: (v: boolean) => void;
  setIsLimitTimed: (v: boolean) => void;
  setIsLimitZoned: (v: boolean) => void;
  startControl: TimeControlType;
  endControl: TimeControlType;
  setLoopCount: React.Dispatch<React.SetStateAction<number>>;
  setMaxLoopCount: React.Dispatch<React.SetStateAction<string | number>>;
  prevMaxLoop: React.RefObject<number>;
};
export const useVideoReset = ({
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
}: UseVideoResetProps) => {
  useEffect(() => {
    // Disable all loop features
    setIsLoop(false);
    setIsLimitTimed(false);
    setIsLimitZoned(false);
    // Reset start and end time state
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
    // Reset loop counters
    setLoopCount(0);
    setMaxLoopCount(10);
    prevMaxLoop.current = 10;
  }, [videoId]);
};
