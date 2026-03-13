import { RobotState, ExecutionStatus } from './types';
import { LEVEL, CELL_SIZE } from './puzzleData';
import { cn } from '@/lib/utils';

const DIRECTION_ROTATION: Record<string, number> = {
  up: 0, right: 90, down: 180, left: 270,
};

interface PuzzleGridProps {
  robot: RobotState;
  status: ExecutionStatus;
}

export function PuzzleGrid({ robot, status }: PuzzleGridProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className="relative rounded-2xl overflow-hidden border-4 border-border bg-muted shadow-card"
        style={{
          width: LEVEL.grid[0].length * CELL_SIZE,
          height: LEVEL.grid.length * CELL_SIZE,
        }}
      >
        {/* Grid cells */}
        {LEVEL.grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={cn(
                'absolute border border-border/40 flex items-center justify-center text-2xl transition-colors',
                cell === 'wall' && 'bg-foreground/15',
                cell === 'empty' && 'bg-card',
                cell === 'start' && 'bg-secondary/15',
                cell === 'goal' && 'bg-star/20',
              )}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: c * CELL_SIZE,
                top: r * CELL_SIZE,
              }}
            >
              {cell === 'wall' && '🧱'}
              {cell === 'goal' && (
                <span className={cn(
                  'text-3xl',
                  status === 'success' && 'animate-bounce-in'
                )}>⭐</span>
              )}
            </div>
          ))
        )}

        {/* Robot */}
        <div
          className={cn(
            'absolute flex items-center justify-center text-3xl z-10 transition-all duration-300 ease-out',
            status === 'error' && 'animate-wiggle',
          )}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: robot.position.col * CELL_SIZE,
            top: robot.position.row * CELL_SIZE,
            transform: `rotate(${DIRECTION_ROTATION[robot.direction]}deg)`,
          }}
        >
          <span className="drop-shadow-lg" style={{ transform: 'rotate(0deg)', display: 'inline-block' }}>
            🤖
          </span>
        </div>
      </div>
    </div>
  );
}
