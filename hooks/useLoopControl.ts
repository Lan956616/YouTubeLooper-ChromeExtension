import { useState, useRef } from "react";
export const useLoopControl = () => {
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [loopCount, setLoopCount] = useState<number>(0);
  const [isLimitTimed, setIsLimitTimed] = useState<boolean>(false);
  const [maxLoopCount, setMaxLoopCount] = useState<number | string>(10);
  const prevMaxLoop = useRef<number>(10);
  const handleMaxLoopChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMaxLoopCount(e.target.value);
  const handleMaxLoopBlur = () => {
    if (maxLoopCount === prevMaxLoop.current) {
      return;
    }
    const parsedValue: number = Number(maxLoopCount);
    let value: number =
      isNaN(parsedValue) || maxLoopCount === ""
        ? prevMaxLoop.current
        : parsedValue;
    value = Math.min(Math.max(value, 2), 100);
    prevMaxLoop.current = value;
    setMaxLoopCount(value);
    setIsLimitTimed(true);
  };
  const toggleLoop = () => {
    setIsLoop((prev) => {
      const newIsLoop = !prev;
      if (newIsLoop) {
        setLoopCount(0);
      }
      return newIsLoop;
    });
  };
  return {
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
  };
};
