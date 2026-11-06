import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  GraduationCap,
  BookOpen,
  Award,
  Plus,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  DailyRoutine,
  EducationLearning,
  SubjectItem,
  CourseItem,
  SkillItem,
  SkillLevel,
} from '../../types';
import {
  M3Button,
  M3Card,
  M3LinearProgress,
  M3Chip,
  M3Dialog,
  M3TextField,
} from '../common/MaterialComponents';

interface ScheduleScreenProps {
  routine: DailyRoutine;
  education: EducationLearning;
  onUpdateRoutine: (r: DailyRoutine) => void;
  onUpdateEducation: (e: EducationLearning) => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  routine,
  education,
  onUpdateRoutine,
  onUpdateEducation,
}) => {
  // Focus / Study Session Timer
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 min default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTimerSubject, setSelectedTimerSubject] = useState(
    education.subjects[0]?.name || 'Study & Development'
  );

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const resetTimer = (mins: number = 25) => {
    setIsTimerRunning(false);
    setTimerSeconds(mins * 60);
  };

  // Quick course progress update
  const handleUpdateCourseProgress = (courseId: string, delta: number) => {
    const updated = education.courses.map((c) => {
      if (c.id === courseId) {
        const current = c.progressPercentage || 0;
        const next = Math.min(100, Math.max(0, current + delta));
        return { ...c, progressPercentage: next };
      }
      return c;
    });
    onUpdateEducation({ ...education, courses: updated });
  };

  // Skill level promotion
  const skillLadder: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const handlePromoteSkill = (skillId: string) => {
    const updated = education.skills.map((sk) => {
      if (sk.id === skillId) {
        const currIndex = skillLadder.indexOf(sk.currentLevel);
        const nextIndex = Math.min(skillLadder.length - 1, currIndex + 1);
        return { ...sk, currentLevel: skillLadder[nextIndex] };
      }
      return sk;
    });
    onUpdateEducation({ ...education, skills: updated });
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1D1B20] dark:text-[#E6E0E9]">
          Routine & Learning Focus
        </h1>
        <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
          Manage your schedule blocks, focus timer, and skill milestones
        </p>
      </div>

      {/* Focus Timer Card */}
      <M3Card variant="elevated" className="bg-gradient-to-br from-[#ECE6F0] to-[#EADDFF]/40 dark:from-[#2B2930] dark:to-[#4F378B]/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#6750A4] dark:text-[#D0BCFF]">
              Pomodoro & Focus Timer
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">{selectedTimerSubject}</span>
        </div>

        <div className="flex flex-col items-center justify-center py-3">
          <span className="text-5xl font-mono font-black tracking-tight text-[#1D1B20] dark:text-[#E6E0E9]">
            {formatTimer(timerSeconds)}
          </span>

          {/* Quick presets */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => resetTimer(25)}
              className="px-2.5 py-1 rounded-xl text-xs bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 hover:border-[#6750A4]"
            >
              25m Focus
            </button>
            <button
              onClick={() => resetTimer(50)}
              className="px-2.5 py-1 rounded-xl text-xs bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 hover:border-[#6750A4]"
            >
              50m Study
            </button>
            <button
              onClick={() => resetTimer(5)}
              className="px-2.5 py-1 rounded-xl text-xs bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 hover:border-[#6750A4]"
            >
              5m Break
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <M3Button
              variant={isTimerRunning ? 'tonal' : 'filled'}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              icon={isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
            >
              {isTimerRunning ? 'Pause Session' : 'Start Focus'}
            </M3Button>
            <button
              onClick={() => resetTimer(25)}
              className="p-2.5 rounded-full bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 text-gray-500 hover:text-black dark:hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </M3Card>

      {/* Routine Timeline */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
            Daily Rhythm Architecture
          </span>
          <span className="text-xs text-[#6750A4] dark:text-[#D0BCFF] font-semibold">
            {routine.personalDevHours} hrs dev target
          </span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CAC4D0]/60 dark:before:bg-[#49454F]/60">
          {/* Wake up */}
          <div className="relative">
            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-[#FEF7FF] dark:ring-[#141218]" />
            <div className="text-xs">
              <span className="font-bold text-amber-700 dark:text-amber-300">
                {routine.wakeUpTime || '06:30'} • Wake Up & Morning Mindset
              </span>
              <p className="text-gray-500 mt-0.5">Hydration, planning, and morning routine.</p>
            </div>
          </div>

          {/* Study */}
          {routine.studySchedule && (
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#6750A4] ring-4 ring-[#FEF7FF] dark:ring-[#141218]" />
              <div className="text-xs">
                <span className="font-bold text-[#6750A4] dark:text-[#D0BCFF]">
                  Study Schedule: {routine.studySchedule}
                </span>
                <p className="text-gray-500 mt-0.5">Dedicated coursework, problem solving, or reading.</p>
              </div>
            </div>
          )}

          {/* Work */}
          {routine.workSchedule && (
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-[#FEF7FF] dark:ring-[#141218]" />
              <div className="text-xs">
                <span className="font-bold text-blue-700 dark:text-blue-300">
                  Work / Professional Block: {routine.workSchedule}
                </span>
                <p className="text-gray-500 mt-0.5">Projects, sprint deliverables, and responsibilities.</p>
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {routine.otherResponsibilities.map((resp, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-[#FEF7FF] dark:ring-[#141218]" />
              <div className="text-xs">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  Responsibility: {resp}
                </span>
              </div>
            </div>
          ))}

          {/* Sleep */}
          <div className="relative">
            <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-[#FEF7FF] dark:ring-[#141218]" />
            <div className="text-xs">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                {routine.sleepTime || '23:00'} • Sleep & Recovery
              </span>
              <p className="text-gray-500 mt-0.5">Digital shutdown and healthy rest.</p>
            </div>
          </div>
        </div>
      </M3Card>

      {/* Courses Progress */}
      {education.courses.length > 0 && (
        <M3Card variant="elevated" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              <BookOpen size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>Course Progress Tracker</span>
            </div>
          </div>

          <div className="space-y-3">
            {education.courses.map((course) => {
              const prog = course.progressPercentage || 0;
              return (
                <div key={course.id} className="p-3 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs">{course.title}</span>
                      <span className="text-[10px] text-gray-500 ml-2">({course.platform})</span>
                    </div>
                    <span className="text-xs font-bold text-[#6750A4] dark:text-[#D0BCFF]">
                      {prog}%
                    </span>
                  </div>

                  <M3LinearProgress progress={prog} />

                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => handleUpdateCourseProgress(course.id, -10)}
                      className="px-2 py-0.5 rounded-lg bg-[#ECE6F0] dark:bg-[#2B2930] text-[10px] font-medium"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => handleUpdateCourseProgress(course.id, 10)}
                      className="px-2 py-0.5 rounded-lg bg-[#6750A4] text-white text-[10px] font-medium"
                    >
                      +10%
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </M3Card>
      )}

      {/* Skills Mastery Ladder */}
      {education.skills.length > 0 && (
        <M3Card variant="elevated" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              <Award size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>Skill Mastery Ladder</span>
            </div>
          </div>

          <div className="space-y-2">
            {education.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-sm">{skill.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-semibold">
                      Current: {skill.currentLevel}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-semibold">
                      Target: {skill.targetLevel}
                    </span>
                  </div>
                </div>

                <M3Button
                  variant="tonal"
                  size="sm"
                  onClick={() => handlePromoteSkill(skill.id)}
                  disabled={skill.currentLevel === 'Expert'}
                >
                  Level Up
                </M3Button>
              </div>
            ))}
          </div>
        </M3Card>
      )}
    </div>
  );
};
