import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { curriculumFilters } from "@/data/curriculumData";
import { cn } from "@/lib/utils";
import { X, Filter, Smartphone, Tablet, Monitor, Globe } from "lucide-react";

interface CurriculumFiltersProps {
  selectedGrade: string | null;
  selectedDuration: string | null;
  selectedTopic: string | null;
  selectedDevice: string | null;
  selectedLanguage: string | null;
  onGradeChange: (grade: string | null) => void;
  onDurationChange: (duration: string | null) => void;
  onTopicChange: (topic: string | null) => void;
  onDeviceChange: (device: string | null) => void;
  onLanguageChange: (language: string | null) => void;
  onClearAll: () => void;
}

export function CurriculumFilters({
  selectedGrade,
  selectedDuration,
  selectedTopic,
  selectedDevice,
  selectedLanguage,
  onGradeChange,
  onDurationChange,
  onTopicChange,
  onDeviceChange,
  onLanguageChange,
  onClearAll,
}: CurriculumFiltersProps) {
  const hasActiveFilters = selectedGrade || selectedDuration || selectedTopic || selectedDevice || selectedLanguage;

  const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };

  return (
    <div className="bg-card rounded-2xl border-2 border-border p-4 md:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-fredoka font-bold text-foreground">Filter Courses</h3>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Grade Filter */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            🎂 Grade / Age
          </h4>
          <div className="flex flex-wrap gap-2">
            {curriculumFilters.grades.map((grade) => (
              <Button
                key={grade.id}
                variant={selectedGrade === grade.id ? "fun" : "outline"}
                size="sm"
                onClick={() => onGradeChange(selectedGrade === grade.id ? null : grade.id)}
                className="text-xs"
              >
                {grade.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            ⏱️ Duration
          </h4>
          <div className="flex flex-wrap gap-2">
            {curriculumFilters.durations.map((duration) => (
              <Button
                key={duration.id}
                variant={selectedDuration === duration.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => onDurationChange(selectedDuration === duration.id ? null : duration.id)}
                className="text-xs"
              >
                {duration.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Topic Filter */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            📚 Topic
          </h4>
          <div className="flex flex-wrap gap-2">
            {curriculumFilters.topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTopicChange(selectedTopic === topic.id ? null : topic.id)}
                  className={cn(
                    "text-xs",
                    selectedTopic === topic.id && topic.color
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {topic.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Device Filter */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            📱 Device
          </h4>
          <div className="flex flex-wrap gap-2">
            {curriculumFilters.devices.map((device) => {
              const Icon = deviceIcons[device.id as keyof typeof deviceIcons];
              return (
                <Button
                  key={device.id}
                  variant={selectedDevice === device.id ? "fun" : "outline"}
                  size="sm"
                  onClick={() => onDeviceChange(selectedDevice === device.id ? null : device.id)}
                  className="text-xs"
                >
                  <Icon className="w-3 h-3" />
                  {device.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Language Filter */}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Language
          </h4>
          <div className="flex flex-wrap gap-2">
            {curriculumFilters.languages.map((lang) => (
              <Button
                key={lang.id}
                variant={selectedLanguage === lang.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => onLanguageChange(selectedLanguage === lang.id ? null : lang.id)}
                className="text-xs"
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {selectedGrade && (
              <Badge variant="secondary" className="gap-1">
                {curriculumFilters.grades.find(g => g.id === selectedGrade)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onGradeChange(null)} />
              </Badge>
            )}
            {selectedDuration && (
              <Badge variant="secondary" className="gap-1">
                {curriculumFilters.durations.find(d => d.id === selectedDuration)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onDurationChange(null)} />
              </Badge>
            )}
            {selectedTopic && (
              <Badge variant="secondary" className="gap-1">
                {curriculumFilters.topics.find(t => t.id === selectedTopic)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onTopicChange(null)} />
              </Badge>
            )}
            {selectedDevice && (
              <Badge variant="secondary" className="gap-1">
                {curriculumFilters.devices.find(d => d.id === selectedDevice)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onDeviceChange(null)} />
              </Badge>
            )}
            {selectedLanguage && (
              <Badge variant="secondary" className="gap-1">
                {curriculumFilters.languages.find(l => l.id === selectedLanguage)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onLanguageChange(null)} />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}