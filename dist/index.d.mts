interface EvasiveOptions {
    /** Distance at which button detects cursor (default: 140) */
    detectionRadius?: number;
    /** How far button jumps away (default: 280) */
    escapeDistance?: number;
    /** Padding from viewport edges (default: 60) */
    edgePadding?: number;
    /** Array of taunt messages to show (default: built-in taunts) */
    taunts?: string[];
    /** Probability of showing taunt (0-1, default: 0.75) */
    tauntProbability?: number;
    /** Enable jump shadow effect (default: true) */
    showShadow?: boolean;
    /** Enable screen shake on landing (default: true) */
    screenShake?: boolean;
    /** Callback when button escapes */
    onEscape?: () => void;
    /** Callback when button is caught (clicked) */
    onCatch?: () => void;
    /** Text to show when caught (default: "Wait... HOW?!") */
    caughtText?: string;
    /** Duration of caught state in ms (default: 1100) */
    caughtDuration?: number;
}
declare function makeEvasive(element: HTMLElement, options?: EvasiveOptions): () => void;

export { type EvasiveOptions, makeEvasive as default, makeEvasive };
