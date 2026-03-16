import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { AiTutorChat } from "@/components/tutor/AiTutorChat";
import { PuzzleGrid } from "@/components/puzzle/PuzzleGrid";
import { BlockPalette } from "@/components/puzzle/BlockPalette";
import { CodeWorkspace } from "@/components/puzzle/CodeWorkspace";
import { SuccessOverlay } from "@/components/puzzle/SuccessOverlay";
import { HintSystem } from "@/components/puzzle/HintSystem";
import { useGameEngine } from "@/components/puzzle/useGameEngine";
import { BLOCK_DEFINITIONS } from "@/components/puzzle/puzzleData";
import { CodeBlock } from "@/components/puzzle/types";

const LessonPlayground = () => {
  const navigate = useNavigate();
  const { robot, status, activeBlockId, errorMessage, attemptCount, reset, executeBlocks } = useGameEngine();
  const [workspace, setWorkspace] = useState<CodeBlock[]>([]);
  const [activeDragType, setActiveDragType] = useState<string | null>(null);

  const makeBlock = useCallback((type: string): CodeBlock => {
    const def = BLOCK_DEFINITIONS.find((d) => d.type === type)!;
    return {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: def.type,
      label: def.label,
      icon: def.icon,
      color: def.color,
      children: def.isContainer ? [] : undefined,
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (id.startsWith("palette-")) {
      setActiveDragType(id.replace("palette-", ""));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragType(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    if (!activeId.startsWith("palette-")) return;

    const type = activeId.replace("palette-", "");
    const block = makeBlock(type);
    const overId = String(over.id);

    if (overId === "workspace") {
      setWorkspace((prev) => [...prev, block]);
    } else if (overId.startsWith("container-")) {
      const parentId = over.data?.current?.parentId;
      if (parentId && type !== 'repeat' && type !== 'ifClear') {
        setWorkspace((prev) =>
          prev.map((b) =>
            b.id === parentId
              ? { ...b, children: [...(b.children || []), block] }
              : b
          )
        );
      }
    }
  };

  const handleRemoveBlock = (id: string) => {
    setWorkspace((prev) => prev.filter((b) => b.id !== id));
  };

  const handleRemoveChild = (parentId: string, childId: string) => {
    setWorkspace((prev) =>
      prev.map((b) =>
        b.id === parentId
          ? { ...b, children: (b.children || []).filter((c) => c.id !== childId) }
          : b
      )
    );
  };

  // Reset only resets robot, keeps blocks in workspace
  const handleResetRobot = () => {
    reset();
  };

  // Full reset clears everything
  const handleFullReset = () => {
    setWorkspace([]);
    reset();
  };

  const handleRun = () => {
    if (workspace.length === 0 || status === 'running') return;
    reset();
    setTimeout(() => executeBlocks(workspace), 50);
  };

  const activeDef = activeDragType
    ? BLOCK_DEFINITIONS.find((d) => d.type === activeDragType)
    : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b-2 border-border p-4 sticky top-0 z-40">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-fredoka font-bold text-lg">Repeat Magic 🔄</h1>
                <p className="text-sm text-muted-foreground">Lesson 4 of 12</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={33} variant="course" className="w-32 hidden sm:block" />
              <Badge variant="xp">+50 XP</Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel – Mission & Grid */}
            <div className="lg:col-span-1 space-y-4">
              <Card variant="elevated">
                <CardContent className="p-5">
                  <h2 className="font-fredoka font-bold text-xl mb-3 flex items-center gap-2">
                    📋 Your Mission
                  </h2>
                  <p className="text-muted-foreground mb-4 font-nunito text-sm">
                    Help the robot reach the ⭐! Use the <strong>Repeat 3×</strong> block
                    to make your code shorter and smarter.
                  </p>
                  <HintSystem workspace={workspace} attemptCount={attemptCount} />
                </CardContent>
              </Card>

              {/* Puzzle Grid */}
              <Card variant="elevated">
                <CardContent className="p-3">
                  <h3 className="font-fredoka font-bold text-sm mb-2 text-center">🗺️ Puzzle Map</h3>
                  <PuzzleGrid robot={robot} status={status} />
                </CardContent>
              </Card>

              {/* Error message */}
              {errorMessage && (
                <Card variant="flat" className="bg-destructive/10 border-destructive/30 animate-fade-in">
                  <CardContent className="p-3">
                    <p className="text-sm font-bold font-nunito text-foreground">{errorMessage}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Panel – Blocks & Code */}
            <div className="lg:col-span-2 space-y-4">
              {/* Code Blocks Palette */}
              <Card variant="flat">
                <CardContent className="p-4">
                  <h3 className="font-fredoka font-bold mb-3">🧩 Code Blocks</h3>
                  <p className="text-xs text-muted-foreground mb-3 font-nunito">
                    Drag blocks into the code area below. Drop simple blocks inside containers!
                  </p>
                  <BlockPalette />
                </CardContent>
              </Card>

              {/* Workspace */}
              <Card variant="elevated">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-fredoka font-bold">🎮 Your Code</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetRobot}
                        disabled={status === 'running'}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset Robot
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleFullReset}
                        disabled={status === 'running'}
                        className="text-destructive hover:text-destructive"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <CodeWorkspace
                    blocks={workspace}
                    activeBlockId={activeBlockId}
                    onRemoveBlock={handleRemoveBlock}
                    onRemoveChild={handleRemoveChild}
                    isRunning={status === 'running'}
                  />
                </CardContent>
              </Card>

              {/* Run Button */}
              <Button
                variant="fun"
                size="lg"
                className="w-full"
                onClick={handleRun}
                disabled={workspace.length === 0 || status === 'running'}
              >
                <Play className="w-5 h-5" />
                {status === 'running' ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </div>
        </div>

        {/* Success Overlay */}
        {status === 'success' && (
          <SuccessOverlay onReset={handleFullReset} onNext={() => navigate(-1)} />
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDef && (
            <div className={`${activeDef.color} text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-hover opacity-90`}>
              <span className="text-lg">{activeDef.icon}</span>
              <span className="font-nunito">{activeDef.label}</span>
            </div>
          )}
        </DragOverlay>

        <AiTutorChat contextHint="Repeat Magic lesson - learning about loops and repeat blocks in a puzzle grid game" />
      </div>
    </DndContext>
  );
};

export default LessonPlayground;
