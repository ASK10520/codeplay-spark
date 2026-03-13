import { useDroppable } from '@dnd-kit/core';
import { CodeBlock } from './types';
import { cn } from '@/lib/utils';
import { X, GripVertical } from 'lucide-react';

interface CodeWorkspaceProps {
  blocks: CodeBlock[];
  activeBlockId: string | null;
  onRemoveBlock: (id: string) => void;
  onRemoveChild: (parentId: string, childId: string) => void;
  isRunning: boolean;
}

function BlockItem({
  block,
  activeBlockId,
  onRemove,
  onRemoveChild,
  isRunning,
  isNested,
}: {
  block: CodeBlock;
  activeBlockId: string | null;
  onRemove: (id: string) => void;
  onRemoveChild?: (parentId: string, childId: string) => void;
  isRunning: boolean;
  isNested?: boolean;
}) {
  const isActive = activeBlockId === block.id;
  const isContainer = block.type === 'repeat' || block.type === 'ifClear';

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        isActive && 'ring-4 ring-star shadow-hover scale-[1.02]',
        isNested && 'ml-0',
      )}
    >
      <div
        className={cn(
          block.color,
          'text-white px-3 py-2.5 flex items-center gap-2 font-bold text-sm font-nunito',
          isContainer ? 'rounded-t-xl' : 'rounded-xl',
          isActive && 'brightness-110',
        )}
      >
        <GripVertical className="w-4 h-4 opacity-50" />
        <span className="text-lg">{block.icon}</span>
        <span className="flex-1">{block.label}</span>
        {!isRunning && (
          <button
            onClick={() => onRemove(block.id)}
            className="hover:bg-white/20 rounded-lg p-0.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isContainer && (
        <ContainerDropZone
          block={block}
          activeBlockId={activeBlockId}
          onRemoveChild={onRemoveChild}
          isRunning={isRunning}
        />
      )}
    </div>
  );
}

function ContainerDropZone({
  block,
  activeBlockId,
  onRemoveChild,
  isRunning,
}: {
  block: CodeBlock;
  activeBlockId: string | null;
  onRemoveChild?: (parentId: string, childId: string) => void;
  isRunning: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `container-${block.id}`,
    data: { parentId: block.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'border-2 border-dashed rounded-b-xl p-2 min-h-[48px] transition-colors',
        'border-white/30 bg-white/5',
        isOver && 'border-star bg-star/10',
      )}
    >
      {block.children && block.children.length > 0 ? (
        <div className="space-y-1.5">
          {block.children.map((child) => (
            <BlockItem
              key={child.id}
              block={child}
              activeBlockId={activeBlockId}
              onRemove={(childId) => onRemoveChild?.(block.id, childId)}
              isRunning={isRunning}
              isNested
            />
          ))}
        </div>
      ) : (
        <p className="text-white/40 text-xs text-center py-2 font-nunito">
          Drop blocks here
        </p>
      )}
    </div>
  );
}

export function CodeWorkspace({
  blocks,
  activeBlockId,
  onRemoveBlock,
  onRemoveChild,
  isRunning,
}: CodeWorkspaceProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'workspace',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[200px] rounded-2xl border-2 border-dashed p-3 transition-colors',
        'border-border bg-muted/30',
        isOver && 'border-primary bg-primary/5',
        blocks.length === 0 && 'flex items-center justify-center',
      )}
    >
      {blocks.length === 0 ? (
        <p className="text-muted-foreground text-center font-nunito">
          👆 Drag blocks here to build your code!
        </p>
      ) : (
        <div className="space-y-2">
          {blocks.map((block) => (
            <BlockItem
              key={block.id}
              block={block}
              activeBlockId={activeBlockId}
              onRemove={onRemoveBlock}
              onRemoveChild={onRemoveChild}
              isRunning={isRunning}
            />
          ))}
        </div>
      )}
    </div>
  );
}
