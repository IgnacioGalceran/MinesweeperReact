"use client";
import React, { useState, useEffect, useRef, useImperativeHandle } from "react";

const Timer = React.forwardRef(({ level, onStart, onStop }: any, ref) => {
  const [seconds, setSeconds] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef: any = useRef(null);
  const maxTimeKey = `maxTime_${level}`;

  useEffect(() => {
    const savedTime = localStorage.getItem(maxTimeKey);
    if (savedTime) {
      setMaxTime(parseInt(savedTime, 10));
    }
  }, [maxTimeKey]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
  }, [isRunning]);

  const startTimer = () => {
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
    if (!savedTime || seconds > parseInt(savedTime, 10)) {
      localStorage.setItem(maxTimeKey, seconds.toString());
      setMaxTime(seconds);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    clearInterval(timerRef.current);
    localStorage.removeItem(maxTimeKey);
    setMaxTime(0);
  };

  useImperativeHandle(ref, () => ({
    startTimer,
    stopTimer,
    resetTimer,
  }));

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        Tiempo: {formatTime(seconds)}
      </h1>
      <p>
        Tiempo máximo - nivel {level}: {formatTime(maxTime)} seconds
      </p>
    </div>
  );
});

export default Timer;
