"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import styles from "@/app/styles/timer.module.css";

const Timer = React.forwardRef(({ level, onStart, onStop }: any, ref) => {
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  console.log(level);

  const timerRef: any = useRef(null);
  const maxTimeKey = `maxTime_${level}`;

  console.log(maxTimeKey);

  useEffect(() => {
    const savedTime = localStorage.getItem(maxTimeKey);
    console.log(savedTime);
    if (savedTime) {
      setMaxTime(parseFloat(savedTime));
    } else {
      setMaxTime(0);
    }
  }, [maxTimeKey]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setCurrentTime(now - startTime);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRunning, startTime]);

  const startTimer = () => {
    setStartTime(Date.now());
    setIsRunning(true);
    onStart();
  };

  const stopTimer = () => {
    setIsRunning(false);
    saveMaxTime();
    onStop();
  };

  const saveMaxTime = () => {
    const savedTime = localStorage.getItem(maxTimeKey);
    const currentSeconds = currentTime / 1000;
    if (!savedTime || currentSeconds > parseFloat(savedTime)) {
      localStorage.setItem(maxTimeKey, currentSeconds.toString());
      setMaxTime(currentSeconds);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentTime(0);
    clearInterval(timerRef.current);
  };

  const formatTime = (time: number) => {
    const formattedSeconds = Math.floor(time / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    const formattedCentiseconds =
      centiseconds < 10 ? `0${centiseconds}` : `${centiseconds}`;
    return `${formattedSeconds}:${formattedCentiseconds}`;
  };

  useImperativeHandle(ref, () => ({
    startTimer,
    stopTimer,
    resetTimer,
  }));

  return (
    <div className={styles.timerContainer}>
      <h1>Tiempo: {formatTime(currentTime)}</h1>
      <p>
        Récord - Nivel {level}: {formatTime(maxTime * 1000)} segundos.
      </p>
    </div>
  );
});

export default Timer;
