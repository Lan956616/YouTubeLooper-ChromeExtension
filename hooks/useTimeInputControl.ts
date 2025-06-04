import { useRef, useState } from "react";
import { formatTime } from "../utils/formatTime";
type BaseState = {
  time: string;
  input: string;
  position: number;
};
export const useTimeInputControl = (
  initialTime: number,
  duration: number,
  isStart: boolean,
  getOtherTime: () => number,
  setIsLimitZoned: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const prevTimeRef = useRef<number>(initialTime);
  const [timeState, setTimeState] = useState<BaseState>({
    input: formatTime(initialTime),
    time: formatTime(initialTime),
    position: (initialTime / duration) * 100,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeState((prev) => ({
      ...prev,
      input: e.target.value,
    }));
  };
  const onBlur = () => {
    const formattedPrev = formatTime(prevTimeRef.current);
    if (timeState.input === formattedPrev) return;
    const parsedValue = Number(timeState.input);
    let value =
      isNaN(parsedValue) || timeState.input === ""
        ? prevTimeRef.current
        : parsedValue;
    const min = isStart ? 0 : getOtherTime() + duration * 0.03;
    const max = isStart ? getOtherTime() - duration * 0.03 : duration;
    value = Math.min(Math.max(value, min), max);
    prevTimeRef.current = value;
    const formatted = formatTime(value);
    setTimeState({
      input: formatted,
      time: formatted,
      position: (value / duration) * 100,
    });
    setIsLimitZoned(true);
  };
  return {
    prevTimeRef,
    timeState,
    setTimeState,
    handleChange,
    onBlur,
  };
};
