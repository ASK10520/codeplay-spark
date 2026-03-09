import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  GripVertical, 
  Video, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Trash2,
  Pencil
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";

// Types
type LessonType = "video" | "pdf" | "quiz" | "article";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

const getLessonIcon = (type: LessonType) => {
  switch (type) {
    case "video": return <Video className="w-4 h-4 text-blue-500" />;
    case "pdf": return <FileText className="w-4 h-4 text-red-500" />;
    case "quiz": return <HelpCircle className="w-4 h-4 text-purple-500" />;
    case "article": return <BookOpen className="w-4 h-4 text-green-500" />;
  }
};

// Sortable Lesson Item
const SortableLesson = ({ lesson, onRemove }: { lesson: Lesson, onRemove: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-background border border-border/50 rounded-xl mb-2 group shadow-sm hover:shadow-md transition-shadow"
    >
      <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
        {getLessonIcon(lesson.type)}
      </div>
      <span className="flex-1 font-nunito font-semibold text-sm">{lesson.title}</span>
      <Badge variant="outline" className="text-[10px] uppercase hidden md:inline-flex">
        {lesson.type}
      </Badge>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon-sm" className="h-8 w-8">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-destructive" onClick={() => onRemove(lesson.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Sortable Module Item (we manage the internal lessons here)
const SortableModule = ({ 
  module, 
  onUpdateLessons,
  onRemove
}: { 
  module: Module, 
  onUpdateLessons: (moduleId: string, lessons: Lesson[]) => void,
  onRemove: (id: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = module.lessons.findIndex((l) => l.id === active.id);
      const newIndex = module.lessons.findIndex((l) => l.id === over.id);
      const newLessons = arrayMove(module.lessons, oldIndex, newIndex);
      onUpdateLessons(module.id, newLessons);
    }
  };

  const removeLesson = (lessonId: string) => {
    onUpdateLessons(module.id, module.lessons.filter(l => l.id !== lessonId));
  };

  const addDummyLesson = (type: LessonType) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: `New ${type} lesson`,
      type
    };
    onUpdateLessons(module.id, [...module.lessons, newLesson]);
    setIsOpen(true);
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bg-card border-0 shadow-card rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 p-4 bg-muted/30 border-b border-border/50">
          <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="w-5 h-5" />
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <span className="flex-1 font-fredoka font-bold text-lg">{module.title}</span>
          <span className="text-sm text-muted-foreground font-nunito">{module.lessons.length} lessons</span>
          <Button variant="ghost" size="icon-sm" className="text-destructive ml-2" onClick={() => onRemove(module.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <CollapsibleContent className="p-4 bg-card">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd}>
            <SortableContext items={module.lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="min-h-[50px]">
                {module.lessons.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm font-nunito py-4 border-2 border-dashed border-border/50 rounded-xl mb-4">
                    No lessons in this module. Add one below!
                  </div>
                )}
                {module.lessons.map((lesson) => (
                  <SortableLesson key={lesson.id} lesson={lesson} onRemove={removeLesson} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-sm font-nunito text-muted-foreground w-full mb-1">Add to module:</span>
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg gap-1" onClick={() => addDummyLesson("video")}>
              <Video className="w-3 h-3 text-blue-500" /> Video
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg gap-1" onClick={() => addDummyLesson("pdf")}>
              <FileText className="w-3 h-3 text-red-500" /> PDF
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg gap-1" onClick={() => addDummyLesson("quiz")}>
              <HelpCircle className="w-3 h-3 text-purple-500" /> Quiz
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg gap-1" onClick={() => addDummyLesson("article")}>
              <BookOpen className="w-3 h-3 text-green-500" /> Article
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};


const AdminCurriculum = () => {
  const [courses, setCourses] = useState<{id: string, title: string}[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  
  // Mock data for modules and lessons
  const [modules, setModules] = useState<Module[]>([
    {
      id: "mod-1",
      title: "Module 1: Introduction to Coding",
      lessons: [
        { id: "les-1", title: "Welcome to the Course", type: "video" },
        { id: "les-2", title: "What is Programming?", type: "article" },
        { id: "les-3", title: "Module 1 Quiz", type: "quiz" }
      ]
    },
    {
      id: "mod-2",
      title: "Module 2: Basic Concepts",
      lessons: [
        { id: "les-4", title: "Variables and Data Types", type: "video" },
        { id: "les-5", title: "Cheat Sheet: Variables", type: "pdf" }
      ]
    }
  ]);

  useEffect(() => {
    supabase.from("courses").select("id, title").then(({data}) => {
      if (data && data.length > 0) {
        setCourses(data);
        setSelectedCourse(data[0].id);
      }
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((m) => m.id === active.id);
        const newIndex = items.findIndex((m) => m.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateModuleLessons = (moduleId: string, newLessons: Lesson[]) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: newLessons } : m));
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const addModule = () => {
    const newMod: Module = {
      id: `mod-${Date.now()}`,
      title: `New Module ${modules.length + 1}`,
      lessons: []
    };
    setModules([...modules, newMod]);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-foreground">
              Curriculum Builder
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-nunito">
              Organize modules and lessons with drag and drop
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[240px] rounded-xl bg-card">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="gradient-primary text-white rounded-xl shadow-button">
              Save Changes
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-card bg-transparent">
          <CardContent className="p-0 space-y-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
              <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
                {modules.map((module) => (
                  <SortableModule 
                    key={module.id} 
                    module={module} 
                    onUpdateLessons={updateModuleLessons}
                    onRemove={removeModule}
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button 
              variant="outline" 
              className="w-full py-8 border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-2xl"
              onClick={addModule}
            >
              <Plus className="w-5 h-5 mr-2" /> Add New Module
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCurriculum;