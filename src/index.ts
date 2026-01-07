export interface EvasiveOptions {
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

interface State {
  currentX: number;
  currentY: number;
  velocityX: number;
  velocityY: number;
  targetX: number;
  targetY: number;
  isReturning: boolean;
  isJumping: boolean;
  isCaught: boolean;
  z: number;
  zVelocity: number;
  jumpStartX: number;
  jumpStartY: number;
  jumpTargetX: number;
  jumpTargetY: number;
  lastJumpTime: number;
  lastTauntTime: number;
}

const DEFAULT_TAUNTS = [
  "LMAOOOOOO",
  "BRO THOUGHT HE HAD ME",
  "I'M FAST AS FUCK BOI",
  "L + RATIO + TOO SLOW",
  "UR SO MADDDD",
  "SKILL ISSUE",
  "NICE TRY LIL BRO",
  "I'M CRYINGGG",
  "NOPE",
  "TOO SLOW",
];

// Physics constants
const GRAVITY = 3200;
const JUMP_VELOCITY = 850;
const HORIZONTAL_LERP = 0.18;
const SPRING_TENSION = 120;
const SPRING_FRICTION = 28;

export function makeEvasive(element: HTMLElement, options: EvasiveOptions = {}) {
  const opts = {
    detectionRadius: options.detectionRadius ?? 140,
    escapeDistance: options.escapeDistance ?? 280,
    edgePadding: options.edgePadding ?? 60,
    taunts: options.taunts ?? DEFAULT_TAUNTS,
    tauntProbability: options.tauntProbability ?? 0.75,
    showShadow: options.showShadow ?? true,
    screenShake: options.screenShake ?? true,
    onEscape: options.onEscape,
    onCatch: options.onCatch,
    caughtText: options.caughtText ?? "Wait... HOW?!",
    caughtDuration: options.caughtDuration ?? 1100,
  };

  // Create wrapper elements
  const wrapper = document.createElement('div');
  const shadow = document.createElement('div');
  const tauntEl = document.createElement('div');

  // Store original content for restoration
  const originalContent = element.innerHTML;
  const originalParent = element.parentElement;
  const originalNextSibling = element.nextSibling;

  // Setup DOM structure
  wrapper.className = 'evasive-wrapper';
  shadow.className = 'evasive-shadow';
  tauntEl.className = 'evasive-taunt';

  // Get element's position before wrapping
  const rect = element.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  // Wrap element
  element.parentElement?.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  wrapper.appendChild(tauntEl);
  document.body.appendChild(shadow);

  // Apply styles
  injectStyles();

  wrapper.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    transform: translate(-50%, -50%);
    z-index: 9999;
    pointer-events: auto;
  `;

  shadow.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY + rect.height / 2 + 10}px;
    width: 180px;
    height: 24px;
    background: radial-gradient(ellipse 50% 45%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.05) 65%, transparent 100%);
    border-radius: 50%;
    transform: translateX(-50%) scale(1);
    pointer-events: none;
    z-index: 9998;
    opacity: 0;
    filter: blur(2px);
  `;

  // State
  const state: State = {
    currentX: 0,
    currentY: 0,
    velocityX: 0,
    velocityY: 0,
    targetX: 0,
    targetY: 0,
    isReturning: false,
    isJumping: false,
    isCaught: false,
    z: 0,
    zVelocity: 0,
    jumpStartX: 0,
    jumpStartY: 0,
    jumpTargetX: 0,
    jumpTargetY: 0,
    lastJumpTime: 0,
    lastTauntTime: 0,
  };

  let animationFrame: number | null = null;
  let jumpAnimFrame: number | null = null;
  let returnTimeout: ReturnType<typeof setTimeout> | null = null;
  let tauntTimeout: ReturnType<typeof setTimeout> | null = null;
  let tauntQueue = [...Array(opts.taunts.length).keys()];
  let lastTauntIndex = -1;

  // Shuffle taunt queue
  function shuffleTauntQueue() {
    for (let i = tauntQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tauntQueue[i], tauntQueue[j]] = [tauntQueue[j], tauntQueue[i]];
    }
  }
  shuffleTauntQueue();

  function getNextTaunt(): string {
    if (tauntQueue.length === 0) {
      tauntQueue = [...Array(opts.taunts.length).keys()];
      shuffleTauntQueue();
    }
    let idx = tauntQueue[0];
    if (idx === lastTauntIndex && tauntQueue.length > 1) {
      for (let i = 1; i < tauntQueue.length; i++) {
        if (tauntQueue[i] !== lastTauntIndex) {
          [tauntQueue[0], tauntQueue[i]] = [tauntQueue[i], tauntQueue[0]];
          idx = tauntQueue[0];
          break;
        }
      }
    }
    tauntQueue.shift();
    lastTauntIndex = idx;
    return opts.taunts[idx];
  }

  function showTaunt() {
    const now = Date.now();
    if (now - state.lastTauntTime > 600) {
      state.lastTauntTime = now;
      tauntEl.textContent = getNextTaunt();
      tauntEl.classList.add('visible');

      if (tauntTimeout) clearTimeout(tauntTimeout);
      tauntTimeout = setTimeout(() => {
        tauntEl.classList.remove('visible');
      }, 1200);
    }
  }

  function distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  function clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
  }

  function getButtonCenter() {
    const r = element.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function updatePosition() {
    wrapper.style.left = `${startX + state.currentX}px`;
    wrapper.style.top = `${startY + state.currentY}px`;
  }

  function updateShadow(height: number = 0) {
    const maxHeight = (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * GRAVITY);
    const normalizedHeight = Math.max(0, Math.min(height / maxHeight, 1));
    const scale = 1 - normalizedHeight * 0.6;
    const opacity = 1 - normalizedHeight * 0.5;

    shadow.style.left = `${startX + state.currentX}px`;
    shadow.style.top = `${startY + state.currentY + element.offsetHeight / 2 + 10}px`;
    shadow.style.transform = `translateX(-50%) scale(${scale})`;
    shadow.style.opacity = String(opacity);
  }

  function springAnimate() {
    const dx = state.targetX - state.currentX;
    const dy = state.targetY - state.currentY;

    state.velocityX += (dx * SPRING_TENSION) / 1000;
    state.velocityY += (dy * SPRING_TENSION) / 1000;
    state.velocityX *= 1 - SPRING_FRICTION / 100;
    state.velocityY *= 1 - SPRING_FRICTION / 100;

    state.currentX += state.velocityX;
    state.currentY += state.velocityY;

    updatePosition();

    const speed = Math.sqrt(state.velocityX ** 2 + state.velocityY ** 2);
    const distToTarget = Math.sqrt(dx ** 2 + dy ** 2);

    if (state.isReturning && speed < 0.1 && distToTarget < 0.5) {
      state.currentX = state.targetX;
      state.currentY = state.targetY;
      state.velocityX = 0;
      state.velocityY = 0;
      state.isReturning = false;
      updatePosition();
      animationFrame = null;
      return;
    }

    if (state.isReturning) {
      animationFrame = requestAnimationFrame(springAnimate);
    }
  }

  function returnToCenter() {
    state.targetX = 0;
    state.targetY = 0;
    state.isReturning = true;

    shadow.style.transition = 'opacity 0.15s ease-out';
    shadow.style.opacity = '0';

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(springAnimate);
    }
  }

  function jumpAnimate(timestamp: number) {
    if (!state.lastJumpTime) state.lastJumpTime = timestamp;
    const delta = Math.min((timestamp - state.lastJumpTime) / 1000, 0.05);
    state.lastJumpTime = timestamp;

    state.zVelocity -= GRAVITY * delta;
    state.z += state.zVelocity * delta;

    const dx = state.jumpTargetX - state.currentX;
    const dy = state.jumpTargetY - state.currentY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const lerpMove = dist * HORIZONTAL_LERP;
    const minMove = 15;
    const moveAmount = Math.max(lerpMove, Math.min(minMove, dist));

    if (dist > 1) {
      const ratio = moveAmount / dist;
      state.currentX += dx * ratio;
      state.currentY += dy * ratio;
    } else {
      state.currentX = state.jumpTargetX;
      state.currentY = state.jumpTargetY;
    }

    const visualOffsetY = state.z * 0.15;
    wrapper.style.left = `${startX + state.currentX}px`;
    wrapper.style.top = `${startY + state.currentY - visualOffsetY}px`;

    if (opts.showShadow) {
      updateShadow(state.z);
    }

    if (state.z <= 0 && state.zVelocity < 0) {
      state.z = 0;
      state.zVelocity = 0;
      state.currentX = state.jumpTargetX;
      state.currentY = state.jumpTargetY;
      state.targetX = state.jumpTargetX;
      state.targetY = state.jumpTargetY;

      updatePosition();

      if (opts.showShadow) {
        shadow.style.transform = 'translateX(-50%) scale(1)';
        shadow.style.opacity = '1';
        setTimeout(() => {
          shadow.style.transition = 'opacity 0.25s ease-out';
          shadow.style.opacity = '0';
        }, 200);
      }

      if (opts.screenShake) {
        wrapper.classList.add('landing');
        setTimeout(() => wrapper.classList.remove('landing'), 200);
      }

      state.isJumping = false;
      state.lastJumpTime = 0;
      jumpAnimFrame = null;

      if (returnTimeout) clearTimeout(returnTimeout);
      returnTimeout = setTimeout(() => returnToCenter(), 450);

      return;
    }

    jumpAnimFrame = requestAnimationFrame(jumpAnimate);
  }

  function startJump(destX: number, destY: number) {
    state.jumpStartX = state.currentX;
    state.jumpStartY = state.currentY;
    state.jumpTargetX = destX;
    state.jumpTargetY = destY;
    state.z = 0;
    state.zVelocity = JUMP_VELOCITY;
    state.lastJumpTime = 0;

    if (opts.showShadow) {
      shadow.style.transition = '';
      shadow.style.opacity = '1';
    }

    if (jumpAnimFrame) cancelAnimationFrame(jumpAnimFrame);
    jumpAnimFrame = requestAnimationFrame(jumpAnimate);
  }

  function escapeFrom(mouseX: number, mouseY: number) {
    if (state.isCaught || state.isJumping) return;

    const buttonCenter = getButtonCenter();
    const dist = distance(mouseX, mouseY, buttonCenter.x, buttonCenter.y);

    if (dist < opts.detectionRadius) {
      state.isReturning = false;

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      if (returnTimeout) {
        clearTimeout(returnTimeout);
        returnTimeout = null;
      }

      state.isJumping = true;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const btnRect = element.getBoundingClientRect();
      const maxX = vw / 2 - btnRect.width / 2 - opts.edgePadding;
      const maxY = vh * 0.25;
      const minY = -vh * 0.55;

      let dx = buttonCenter.x - mouseX;
      let dy = buttonCenter.y - mouseY;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= len;
      dy /= len;

      // Try multiple angles
      const angles = [0, 0.3, -0.3, 0.6, -0.6, 0.9, -0.9, 1.2, -1.2, Math.PI];
      let bestX = state.currentX;
      let bestY = state.currentY;
      let bestDistance = 0;

      for (const angle of angles) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const rdx = dx * cos - dy * sin;
        const rdy = dx * sin + dy * cos;

        let newX = state.currentX + rdx * opts.escapeDistance;
        let newY = state.currentY + rdy * opts.escapeDistance;
        newX = clamp(newX, -maxX, maxX);
        newY = clamp(newY, minY, maxY);

        const moveDist = distance(state.currentX, state.currentY, newX, newY);
        if (moveDist > bestDistance) {
          bestX = newX;
          bestY = newY;
          bestDistance = moveDist;
        }
      }

      startJump(bestX, bestY);
      opts.onEscape?.();

      if (Math.random() < opts.tauntProbability) {
        showTaunt();
      }
    }
  }

  function handleMouseMove(e: MouseEvent) {
    escapeFrom(e.clientX, e.clientY);

    if (returnTimeout) {
      clearTimeout(returnTimeout);
    }

    const buttonCenter = getButtonCenter();
    const dist = distance(e.clientX, e.clientY, buttonCenter.x, buttonCenter.y);

    if (dist > opts.detectionRadius * 2.5) {
      returnTimeout = setTimeout(() => returnToCenter(), 400);
    }
  }

  function handleMouseLeave() {
    if (returnTimeout) clearTimeout(returnTimeout);
    returnTimeout = setTimeout(() => returnToCenter(), 200);
  }

  function handleClick() {
    if (state.isCaught) return;

    state.isCaught = true;
    opts.onCatch?.();

    if (jumpAnimFrame) {
      cancelAnimationFrame(jumpAnimFrame);
      jumpAnimFrame = null;
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    if (returnTimeout) {
      clearTimeout(returnTimeout);
      returnTimeout = null;
    }

    tauntEl.classList.remove('visible');
    state.z = 0;
    state.zVelocity = 0;
    state.isJumping = false;

    element.innerHTML = opts.caughtText;
    element.classList.add('evasive-caught');
    wrapper.classList.add('caught-shake');

    setTimeout(() => {
      returnToCenter();
      shadow.style.transition = 'opacity 0.15s ease-out';
      shadow.style.opacity = '0';
    }, 600);

    setTimeout(() => {
      element.innerHTML = originalContent;
      element.classList.remove('evasive-caught');
      wrapper.classList.remove('caught-shake');
      state.isCaught = false;
    }, opts.caughtDuration);
  }

  // Attach event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
  element.addEventListener('click', handleClick);

  // Return cleanup function
  return function destroy() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
    element.removeEventListener('click', handleClick);

    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (jumpAnimFrame) cancelAnimationFrame(jumpAnimFrame);
    if (returnTimeout) clearTimeout(returnTimeout);
    if (tauntTimeout) clearTimeout(tauntTimeout);

    // Restore original DOM
    shadow.remove();
    wrapper.replaceWith(element);
    element.innerHTML = originalContent;
    element.classList.remove('evasive-caught');
  };
}

// Inject required styles
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.textContent = `
    .evasive-wrapper {
      pointer-events: auto;
    }

    .evasive-wrapper.landing {
      animation: evasive-squash 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .evasive-wrapper.caught-shake {
      animation: evasive-shake 0.5s ease-out;
    }

    .evasive-taunt {
      position: absolute;
      bottom: calc(100% + 16px);
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Rounded', sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: #000;
      background: #E9E9EB;
      padding: 10px 16px;
      border-radius: 18px;
      border-bottom-right-radius: 4px;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
    }

    .evasive-taunt.visible {
      opacity: 1;
    }

    .evasive-caught {
      background: linear-gradient(180deg, #34d058 0%, #22863a 100%) !important;
    }

    @keyframes evasive-squash {
      0% { transform: translate(-50%, -50%) scale(1, 1); }
      10% { transform: translate(-50%, -50%) scale(1.15, 0.85); }
      30% { transform: translate(-50%, -50%) scale(0.9, 1.1) translateY(-8px); }
      50% { transform: translate(-50%, -50%) scale(1, 1) translateY(-12px); }
      70% { transform: translate(-50%, -50%) scale(0.95, 1.05) translateY(-6px); }
      85% { transform: translate(-50%, -50%) scale(1.1, 0.9); }
      100% { transform: translate(-50%, -50%) scale(1, 1); }
    }

    @keyframes evasive-shake {
      0%, 100% { transform: translate(-50%, -50%) translateX(0) rotate(0); }
      10% { transform: translate(-50%, -50%) translateX(-8px) rotate(-3deg); }
      20% { transform: translate(-50%, -50%) translateX(8px) rotate(3deg); }
      30% { transform: translate(-50%, -50%) translateX(-6px) rotate(-2deg); }
      40% { transform: translate(-50%, -50%) translateX(6px) rotate(2deg); }
      50% { transform: translate(-50%, -50%) translateX(-4px) rotate(-1deg); }
      60% { transform: translate(-50%, -50%) translateX(4px) rotate(1deg); }
      70% { transform: translate(-50%, -50%) translateX(-2px) rotate(0); }
      80% { transform: translate(-50%, -50%) translateX(2px) rotate(0); }
    }
  `;
  document.head.appendChild(style);
}

export default makeEvasive;
