import { useState, useCallback, useRef } from 'react';
import { RobotState, CodeBlock, Direction, Position, ExecutionStatus, CellType } from './types';
import { LEVEL } from './puzzleData';

const DIRECTION_DELTAS: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const TURN_LEFT: Record<Direction, Direction> = {
  up: 'left', left: 'down', down: 'right', right: 'up',
};

const TURN_RIGHT: Record<Direction, Direction> = {
  up: 'right', right: 'down', down: 'left', left: 'up',
};

function isWalkable(grid: CellType[][], pos: Position): boolean {
  if (pos.row < 0 || pos.row >= grid.length || pos.col < 0 || pos.col >= grid[0].length) return false;
  return grid[pos.row][pos.col] !== 'wall';
}

export function useGameEngine() {
  const [robot, setRobot] = useState<RobotState>({
    position: { ...LEVEL.start },
    direction: LEVEL.startDirection,
  });
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setRobot({ position: { ...LEVEL.start }, direction: LEVEL.startDirection });
    setStatus('idle');
    setActiveBlockId(null);
    setErrorMessage(null);
  }, []);

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const executeBlocks = useCallback(async (blocks: CodeBlock[]) => {
    abortRef.current = false;
    setStatus('running');
    setErrorMessage(null);

    let currentRobot: RobotState = {
      position: { ...LEVEL.start },
      direction: LEVEL.startDirection,
    };
    setRobot({ ...currentRobot });

    const runBlock = async (block: CodeBlock): Promise<boolean> => {
      if (abortRef.current) return false;
      setActiveBlockId(block.id);
      await delay(400);

      switch (block.type) {
        case 'move': {
          const delta = DIRECTION_DELTAS[currentRobot.direction];
          const next: Position = {
            row: currentRobot.position.row + delta.row,
            col: currentRobot.position.col + delta.col,
          };
          if (!isWalkable(LEVEL.grid, next)) {
            setErrorMessage('🚧 Oops! The robot hit a wall!');
            setStatus('error');
            return false;
          }
          currentRobot = { ...currentRobot, position: next };
          setRobot({ ...currentRobot });
          break;
        }
        case 'turnLeft':
          currentRobot = { ...currentRobot, direction: TURN_LEFT[currentRobot.direction] };
          setRobot({ ...currentRobot });
          break;
        case 'turnRight':
          currentRobot = { ...currentRobot, direction: TURN_RIGHT[currentRobot.direction] };
          setRobot({ ...currentRobot });
          break;
        case 'repeat':
          for (let i = 0; i < 3; i++) {
            if (block.children) {
              for (const child of block.children) {
                const ok = await runBlock(child);
                if (!ok) return false;
              }
            }
          }
          break;
        case 'ifClear': {
          const delta = DIRECTION_DELTAS[currentRobot.direction];
          const ahead: Position = {
            row: currentRobot.position.row + delta.row,
            col: currentRobot.position.col + delta.col,
          };
          if (isWalkable(LEVEL.grid, ahead) && block.children) {
            for (const child of block.children) {
              const ok = await runBlock(child);
              if (!ok) return false;
            }
          }
          break;
        }
      }

      // Check win
      if (currentRobot.position.row === LEVEL.goal.row && currentRobot.position.col === LEVEL.goal.col) {
        setStatus('success');
        setActiveBlockId(null);
        return false; // stop further execution
      }
      return true;
    };

    for (const block of blocks) {
      const ok = await runBlock(block);
      if (!ok) return;
    }

    if (status !== 'success' && !abortRef.current) {
      // finished but didn't reach goal
      if (currentRobot.position.row !== LEVEL.goal.row || currentRobot.position.col !== LEVEL.goal.col) {
        setErrorMessage("🤔 The robot didn't reach the star. Try again!");
        setStatus('error');
      }
    }
    setActiveBlockId(null);
  }, []);

  return { robot, status, activeBlockId, errorMessage, reset, executeBlocks };
}
