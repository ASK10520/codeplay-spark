import { useDraggable } from '@dnd-kit/core';
import { BLOCK_DEFINITIONS } from './puzzleData';
import { BlockDefinition } from './types';
import { cn } from '@/lib/utils';

function DraggableBlock({ def }: { def: BlockDefinition }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${def.type}`,
    data: { type: def.type, fromPalette: true },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={cn(
        def.color,
        'text-white px-4 py-2.5 rounded-xl font-bold text-sm cursor-grab active:cursor-grabbing',
        'flex items-center gap-2 select-none transition-transform shadow-button',
        'hover:scale-105 active:scale-95',
        isDragging && 'opacity-50 scale-110',
        def.isContainer && 'ring-2 ring-white/30',
      )}
    >
      <span className="text-lg">{def.icon}</span>
      <span className="font-nunito">{def.label}</span>
      {def.isContainer && (
        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md ml-1">container</span>
      )}
    </div>
  );
}

export function BlockPalette() {
  return (
    <div className="flex flex-wrap gap-2">
      {BLOCK_DEFINITIONS.map((def) => (
        <DraggableBlock key={def.type} def={def} />
      ))}
    </div>
  );
}
