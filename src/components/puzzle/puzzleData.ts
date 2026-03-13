import { PuzzleLevel, BlockDefinition } from './types';

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  { type: 'move', label: 'Move Forward', icon: '➡️', color: 'bg-secondary' },
  { type: 'turnLeft', label: 'Turn Left', icon: '↩️', color: 'bg-success' },
  { type: 'turnRight', label: 'Turn Right', icon: '↪️', color: 'bg-badge' },
  { type: 'repeat', label: 'Repeat 3×', icon: '🔄', color: 'bg-primary', isContainer: true },
  { type: 'ifClear', label: 'If Path Clear', icon: '❓', color: 'bg-star', isContainer: true },
];

export const LEVEL: PuzzleLevel = {
  grid: [
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'start', 'empty', 'empty', 'wall',  'empty'],
    ['empty', 'wall',  'wall',  'empty', 'wall',  'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'wall',  'empty', 'wall',  'wall',  'empty'],
    ['empty', 'empty', 'empty', 'empty', 'goal',  'empty'],
  ],
  start: { row: 1, col: 1 },
  startDirection: 'down',
  goal: { row: 5, col: 4 },
};

export const CELL_SIZE = 56;
export const GRID_ROWS = 6;
export const GRID_COLS = 6;
