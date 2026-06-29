/** @fileoverview Keyboard finger-to-key mapping and color assignments */

export const FINGER_COLORS = {
  leftPinky: '#8338EC',
  leftRing: '#4895EF',
  leftMiddle: '#88D8B0',
  leftIndex: '#FFBE0B',
  rightIndex: '#FB5607',
  rightMiddle: '#88D8B0',
  rightRing: '#4895EF',
  rightPinky: '#8338EC',
  thumbs: '#A388EE',
};

export const FINGER_NAMES = {
  leftPinky: 'Left Pinky',
  leftRing: 'Left Ring',
  leftMiddle: 'Left Middle',
  leftIndex: 'Left Index',
  rightIndex: 'Right Index',
  rightMiddle: 'Right Middle',
  rightRing: 'Right Ring',
  rightPinky: 'Right Pinky',
  thumbs: 'Thumbs',
};

const buildFingerMap = () => {
  const map = {};
  const assign = (keys, finger, hand) => {
    keys.forEach((key) => {
      map[key.toLowerCase()] = { finger, hand, color: FINGER_COLORS[finger] };
      map[key.toUpperCase()] = { finger, hand, color: FINGER_COLORS[finger] };
    });
  };

  assign(['q', 'a', 'z', '1', '!'], 'leftPinky', 'left');
  assign(['w', 's', 'x', '2', '@'], 'leftRing', 'left');
  assign(['e', 'd', 'c', '3', '#'], 'leftMiddle', 'left');
  assign(['r', 'f', 'v', 't', 'g', 'b', '4', '5', '$', '%'], 'leftIndex', 'left');
  assign(['y', 'h', 'n', 'u', 'j', 'm', '6', '7', '^', '&'], 'rightIndex', 'right');
  assign(['i', 'k', '8', '*', ','], 'rightMiddle', 'right');
  assign(['o', 'l', '9', '(', '.'], 'rightRing', 'right');
  assign(['p', ';', ':', '/', '?', '0', ')', '[', ']', '{', '}', "'", '"', '\\', '|', '-', '_', '=', '+'], 'rightPinky', 'right');
  map[' '] = { finger: 'thumbs', hand: 'both', color: FINGER_COLORS.thumbs };

  return map;
};

/** Complete mapping from key character to { finger, hand, color } */
export const FINGER_MAP = buildFingerMap();

/** Get finger info for a key character */
export const getFingerForKey = (key) => FINGER_MAP[key] || { finger: 'unknown', hand: 'unknown', color: 'var(--text-muted)' };

/** Get color for a key character */
export const getColorForKey = (key) => (FINGER_MAP[key]?.color) || 'var(--text-muted)';

/** Standard QWERTY keyboard layout for SVG rendering */
export const KEYBOARD_LAYOUT = [
  { row: 0, keys: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'] },
  { row: 1, keys: ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'] },
  { row: 2, keys: ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'] },
  { row: 3, keys: ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'] },
  { row: 4, keys: ['Space'] },
];
