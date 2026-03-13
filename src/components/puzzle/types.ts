export type Direction = 'up' | 'down' | 'left' | 'right';

export type CellType = 'empty' | 'wall' | 'start' | 'goal';

export interface Position {
  row: number;
  col: number;
}

export interface RobotState {
  position: Position;
  direction: Direction;
}

export interface CodeBlock {
  id: string;
  type: 'move' | 'turnLeft' | 'turnRight' | 'repeat' | 'ifClear';
  label: string;
  icon: string;
  color: string;
  children?: CodeBlock[];
}

export interface BlockDefinition {
  type: CodeBlock['type'];
  label: string;
  icon: string;
  color: string;
  isContainer?: boolean;
}

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

export interface PuzzleLevel {
  grid: CellType[][];
  start: Position;
  startDirection: Direction;
  goal: Position;
}
