import { useEffect, useRef } from "react";
import type { TimeControlType } from "./useTimeInputControl";
export const useVideoWatcher = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  duration: number,
  isLoop: boolean,
  isLimitZoned: boolean,
  isLimitTimed: boolean,
  startControl: TimeControlType,
  endControl: TimeControlType,
  prevMaxLoop: React.RefObject<number>,
  setLoopCount: React.Dispatch<React.SetStateAction<number>>
) => {
  const isJumpingRef = useRef<boolean>(false);
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
      // Skip if looping is off, or video is currently seeking
      if (!isLoop || isJumpingRef.current || !videoRef.current) {
        return;
      }
      const userStartTime = startControl.prevTimeRef.current;
      const userEndTime = endControl.prevTimeRef.current;
      const userLimitTime = prevMaxLoop.current;
      const currentTime = videoRef.current.currentTime;
      // Zone-based looping
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
      // Full-length looping
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
};
