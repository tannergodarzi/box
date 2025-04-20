"use client";

import styles from "./page.module.css";
import { createTimer, Timer, forceRestartTimer } from "../utilities/timing";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { ProgressBar } from "./components/progressBar";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<Timer | null>(null);
  const playingRef = useRef(false);
  
  // Keep track of the playing state for use in callbacks
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  
  // Create the timer only once
  useEffect(() => {
    const timer = createTimer({
      duration: 4000,
      onUpdate: (progress) => {
        setProgress(Math.ceil(progress * 100));
      },
      onComplete: () => {
        setStep((step) => step < 4 ? step + 1 : 1);
        
        // Use the force restart helper to ensure proper restart
        if (playingRef.current && timerRef.current) {
          forceRestartTimer(timerRef.current);
        }
      },
    });
    
    timerRef.current = timer;
    
    return () => {
      if (timerRef.current) {
        timerRef.current.stop();
      }
    };
  }, []); // Empty dependency array ensures timer is created only once
  
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
    setTimeout(() => {
      setPlaying(true);
    }, 100);
  }, []);
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Box Breather</h1>
        <h2>{`Progress ${progress}%`}</h2>
        <h2>{`Step ${step} of 4`}</h2>
        <div>
          <ProgressBar width={progress * 4} paused={!playing} />
        </div>
        <div className={styles.controls}>
          <button onClick={() => setPlaying(false)} disabled={!playing}>
            Stop
          </button>
          <button onClick={() => setPlaying(true)} disabled={playing}>
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