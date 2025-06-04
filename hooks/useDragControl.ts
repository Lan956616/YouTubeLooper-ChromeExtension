import { useEffect, useState } from "react";
import { formatTime } from "../utils/formatTime";
import type { TimeControlType } from "./useTimeInputControl";
export const useDragControl = (
  duration: number,
  progressBarRef: React.RefObject<HTMLDivElement | null>,
  startControl: TimeControlType,
  endControl: TimeControlType
) => {
  const [isDraggingLeft, setIsDraggingLeft] = useState<boolean>(false);
  const [isDraggingRight, setIsDraggingRight] = useState<boolean>(false);
  const handleMouseDown = (side: string) => {
    if (isDraggingRight || isDraggingLeft) {
      return;
    }
    if (side === "left") {
      setIsDraggingLeft(true);
    } else if (side === "right") {
      setIsDraggingRight(true);
    }
  };
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
  return {
    isDraggingLeft,
    isDraggingRight,
    handleMouseDown,
  };
};
