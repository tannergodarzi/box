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

export class Timer {
  private startTime: number = 0;
  private rafId: number | null = null;
  private isRunning: boolean = false;
  private duration: number;
  private onUpdate?: (progress: number) => void;
  private onComplete?: () => void;

  constructor(options: TimerOptions = {}) {
    this.duration = options.duration || 1000;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;
  }

  /**
   * Starts the timer
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = performance.now();
    this.tick();
  }

  /**
   * Stops the timer
   */
  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Resets and restarts the timer
   */
  restart(): void {
    this.stop();
    this.start();
  }

  /**
   * Updates timer on each animation frame
   */
  private tick(): void {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    if (this.onUpdate) {
      this.onUpdate(progress);
    }
    
    if (progress >= 1) {
      this.isRunning = false;
      if (this.onComplete) {
        this.onComplete();
      }
      return;
    }
    
    this.rafId = requestAnimationFrame(() => this.tick());
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
}

/**
 * Creates and returns a new timer instance
 */
export function createTimer(options: TimerOptions = {}): Timer {
  return new Timer(options);
}