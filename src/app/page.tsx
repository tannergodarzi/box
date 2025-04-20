"use client";

import styles from "./page.module.css";
import { createTimer, Timer } from "../utilities/timing";
import { useLayoutEffect, useRef, useState } from "react";
import { ProgressBar } from "./components/progressBar";

export default function Home() {
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(1)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<null | Timer>(null);
  
  timerRef.current = createTimer({
    duration: 4000,
    onUpdate: (progress) => {
      setProgress(Math.ceil(progress * 100));
    },
    onComplete: () => {
      setStep((step) => {
        if (step < 4) {
          return step + 1
        } else {
          return 1
        }
      })
      if (timerRef.current) {
        timerRef.current.restart();
      }
    },
  });
  
  useLayoutEffect(() => {
    if (timerRef.current) {
      setPlaying(true)
      timerRef.current?.start();
    }
  }, []);

  function handleOnButtonClickStop() {
    if (timerRef.current) {
      setPlaying(false);
      timerRef.current?.stop();
    }
  }

  function handleOnButtonClickStart() {
    if (timerRef.current) {
      setPlaying(true);
      timerRef.current?.start();
    }
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
          >
            Stop
          </button>
          <button
            onClick={handleOnButtonClickStart}
          >
            Restart
          </button>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>Box Breather © 2025</p>
      </footer>
    </div>
  );
}