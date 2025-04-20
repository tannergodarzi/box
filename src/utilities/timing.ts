/**
 * Timer utility using requestAnimationFrame
 * Provides high precision timing for animations and time-sensitive operations
 */

export interface TimerOptions {
  /**
   * The duration of the timer in milliseconds
   */
  duration?: number;
  /**
   * Callback that receives progress value (0 to 1)
   */
  onUpdate?: (progress: number) => void;
  /**
   * Callback when timer completes
   */
  onComplete?: () => void;
}

/**
 * High-precision timer using requestAnimationFrame
 */
export class Timer {
  private startTime: number = 0;
  private rafId: number | null = null;
  private isRunning: boolean = false;
  private duration: number;
  private onUpdate?: (progress: number) => void;
  private onComplete?: () => void;
  private completingCycle: boolean = false;

  constructor(options: TimerOptions = {}) {
    this.duration = options.duration || 1000;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;
  }

  /**
   * Starts the timer
   */
  start(): void {
    console.log('Timer start called, isRunning:', this.isRunning);
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = performance.now();
    this.completingCycle = false;
    this.tick();
    console.log('Timer started at', this.startTime);
  }

  /**
   * Stops the timer
   */
  stop(): void {
    console.log('Timer stop called, isRunning:', this.isRunning);
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this.completingCycle = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Resets and restarts the timer
   */
  restart(): void {
    console.log('Timer restart called, isRunning:', this.isRunning);
    this.stop();
    this.start();
  }

  /**
   * Updates timer on each animation frame
   */
  private tick(): void {
    if (!this.isRunning) {
      console.log('Tick called but timer not running, exiting');
      return;
    }
    
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    if (this.onUpdate) {
      this.onUpdate(progress);
    }
    
    if (progress >= 1 && !this.completingCycle) {
      console.log('Timer cycle complete, progress:', progress);
      this.completingCycle = true;

      if (this.onComplete) {
        console.log('Calling onComplete');
        this.onComplete();
      }
      
      // Check if we're still running (restart might have been called in onComplete)
      if (this.isRunning && this.completingCycle) {
        console.log('Stopping timer after completion');
        this.isRunning = false;
        this.completingCycle = false;
      }
      return;
    }
    
    if (this.isRunning) {
      this.rafId = requestAnimationFrame(() => this.tick());
    }
  }

  /**
   * Gets the current elapsed time in milliseconds
   */
  getElapsedTime(): number {
    if (!this.isRunning) return 0;
    return performance.now() - this.startTime;
  }

  /**
   * Gets the current progress value (0 to 1)
   */
  getProgress(): number {
    if (!this.isRunning) return 0;
    return Math.min((performance.now() - this.startTime) / this.duration, 1);
  }
  
  /**
   * Returns whether the timer is currently running
   */
  isPlaying(): boolean {
    return this.isRunning;
  }
}

/**
 * Creates and returns a new timer instance
 */
export function createTimer(options: TimerOptions = {}): Timer {
  return new Timer(options);
}

/**
 * Helper function to force restart a timer safely
 * This ensures proper cleanup and restart sequence
 */
export function forceRestartTimer(timer: Timer): void {
  if (!timer) return;
  console.log('Force restarting timer');
  
  // Use setTimeout to ensure async nature
  setTimeout(() => {
    timer.stop();
    setTimeout(() => {
      timer.start();
    }, 5);
  }, 5);
}