# evasive-button

Make any button evade the cursor.

## Installation

```bash
npm install evasive-button
```

## Usage

```js
import { makeEvasive } from 'evasive-button';

const button = document.querySelector('#my-button');
const destroy = makeEvasive(button);

// Later, to cleanup:
destroy();
```

## Options

```js
makeEvasive(element, {
  // Detection & Movement
  detectionRadius: 140,    // Distance at which button detects cursor
  escapeDistance: 280,     // How far button jumps away
  edgePadding: 60,         // Padding from viewport edges

  // Taunts
  taunts: ['NOPE', 'TOO SLOW', 'SKILL ISSUE'],  // Custom taunts
  tauntProbability: 0.75,  // Chance of showing taunt (0-1)

  // Effects
  showShadow: true,        // Show jump shadow
  screenShake: true,       // Shake on landing

  // Caught state
  caughtText: 'Wait... HOW?!',  // Text when caught
  caughtDuration: 1100,    // How long caught state lasts (ms)

  // Callbacks
  onEscape: () => {},      // Called when button escapes
  onCatch: () => {},       // Called when button is caught
});
```

## Default Taunts

The button comes with these built-in taunts:
- "LMAOOOOOO"
- "BRO THOUGHT HE HAD ME"
- "I'M FAST AS FUCK BOI"
- "L + RATIO + TOO SLOW"
- "UR SO MADDDD"
- "SKILL ISSUE"
- "NICE TRY LIL BRO"
- "I'M CRYINGGG"
- "NOPE"
- "TOO SLOW"

## License

MIT
