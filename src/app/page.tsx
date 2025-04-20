"use client";

import styles from "./page.module.css";
import { createTimer, Timer } from "../utilities/timing";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { ProgressBar } from "./components/progressBar";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<Timer | null>(null);
  
  // Create the timer only once
  useEffect(() => {
    timerRef.current = createTimer({
      duration: 4000,
      onUpdate: (progress) => {
        setProgress(Math.ceil(progress * 100));
      },
      onComplete: () => {
        setStep((step) => {
          return step < 4 ? step + 1 : 1;
        });
        // Check the current playing state when deciding to restart
        if (timerRef.current) {
          // Only restart if still playing (check current state)
          const isCurrentlyPlaying = timerRef.current.isPlaying();
          if (isCurrentlyPlaying) {
            timerRef.current.restart();
          }
        }
      },
    });
    
    return () => {
      // Cleanup on unmount
      if (timerRef.current) {
        timerRef.current.stop();
      }
    };
  }, []);
  
  // Handle play state changes
  useEffect(() => {
    if (!timerRef.current) return;
    
    if (playing) {
      timerRef.current.start();
    } else {
      timerRef.current.stop();
    }
  }, [playing]);
  
  // Start automatically on mount
  useLayoutEffect(() => {
    setPlaying(true);
  }, []);

  function handleOnButtonClickStop() {
    setPlaying(false);
  }

  function handleOnButtonClickStart() {
    setPlaying(true);
  }
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Box Breather</h1>
        <h2>{`Progress ${progress}%`}</h2>
        <h2>{`Step ${step}`}</h2>
        <div>
          <ProgressBar width={progress * 4} paused={!playing} />
        </div>
        <div className={styles.controls}>
          <button
            onClick={handleOnButtonClickStop}
            disabled={!playing}
          >
            Stop
          </button>
          <button
            onClick={handleOnButtonClickStart}
            disabled={playing}
          >
            Start
          </button>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>Box Breather © 2025</p>
      </footer>
    </div>
  );
}