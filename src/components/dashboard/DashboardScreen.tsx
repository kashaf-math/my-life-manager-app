import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Briefcase,
  Target,
  Plus,
  ArrowRight,
  TrendingUp,
  Circle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  AppData,
  TaskItem,
  NavigationTab,
} from '../../types';
import {
  M3Button,
  M3Card,
  M3CircularProgress,
  M3LinearProgress,
} from '../common/MaterialComponents';
import { getTimeGreeting, formatDisplayDate } from '../../viewmodel/LifeManagerViewModel';

interface DashboardScreenProps {
  data: AppData;
  todayDateStr: string;
  totalTasksCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  dailyProgressPercentage: number;
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  data,
  todayDateStr,
  totalTasksCount,
  completedTasksCount,
  pendingTasksCount,
  dailyProgressPercentage,
  onToggleTask,
  onAddTask,
  onNavigateTab,
}) => {
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskCategory, setQuickTaskCategory] = useState(data.categories[0] || 'Personal');

  const greeting = getTimeGreeting(data.profile.fullName || undefined);
  const formattedDate = formatDisplayDate(todayDateStr);

  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    onAddTask({
      title: quickTaskTitle.trim(),
      category: quickTaskCategory,
      priority: 'Medium',
      deadline: todayDateStr,
    });
    setQuickTaskTitle('');
  };

  // Only display sections relevant to user-entered information
  const hasRoutineInfo = Boolean(
    data.routine.wakeUpTime ||
      data.routine.sleepTime ||
      data.routine.studySchedule ||
      data.routine.workSchedule ||
      data.routine.otherResponsibilities.length > 0
  );

  const hasEducationInfo = Boolean(
    data.education.subjects.length > 0 ||
      data.education.courses.length > 0 ||
      data.education.skills.length > 0 ||
      data.education.dailyLearningTarget
  );

  const hasProfessionalInfo = Boolean(
    data.professional.careerObjectives ||
      data.professional.projects.length > 0 ||
      data.professional.technicalSkills.length > 0
  );

  const hasGoalsInfo = data.goals.length > 0;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto space-y-4 animate-fadeIn">
      {/* 1. Personal Welcome Message & Today's Date */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6750A4] dark:text-[#D0BCFF] flex items-center gap-1.5">
            <Sparkles size={13} />
            Daily Overview
          </span>
          <h1 className="text-2xl font-bold text-[#1D1B20] dark:text-[#E6E0E9] tracking-tight mt-0.5">
            {greeting}
          </h1>
          {data.profile.currentDegree && (
            <p className="text-xs text-[#49454F] dark:text-[#CAC4D0] mt-0.5">
              {data.profile.currentDegree}
              {data.profile.currentSemester ? ` • ${data.profile.currentSemester}` : ''}
            </p>
          )}
        </div>

        {/* Date Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#E8DEF8] dark:bg-[#4A4458] text-[#1D192B] dark:text-[#E8DEF8] text-xs font-medium">
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* 2. Hero Progress Card: (Completed / Total) * 100 with Circular Progress */}
      <M3Card variant="elevated" className="relative overflow-hidden bg-gradient-to-br from-[#F3EDF7] to-[#EADDFF]/40 dark:from-[#211F26] dark:to-[#4F378B]/20">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6750A4] dark:text-[#D0BCFF]">
              Daily Completion Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1D1B20] dark:text-[#E6E0E9]">
                {dailyProgressPercentage}%
              </span>
              <span className="text-xs text-gray-500 font-medium">
                ({completedTasksCount} of {totalTasksCount} completed)
              </span>
            </div>

            {/* Metrics Chips */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-medium">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 size={13} />
                <span>{completedTasksCount} Done</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                <Clock size={13} />
                <span>{pendingTasksCount} Pending</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 pt-1">
              {totalTasksCount === 0
                ? 'No tasks added yet for today. Add your first task below!'
                : dailyProgressPercentage === 100
                ? '🎉 Excellent work! All daily tasks are finished!'
                : dailyProgressPercentage >= 50
                ? 'Great momentum! You are over halfway through.'
                : 'Keep going! Steady execution builds greatness.'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <M3CircularProgress progress={dailyProgressPercentage} size={98} strokeWidth={9} />
          </div>
        </div>
      </M3Card>

      {/* 3. Daily Tasks & Quick Add */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
            <CheckCircle2 size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
            <span>Today's Tasks ({totalTasksCount})</span>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs text-[#6750A4] dark:text-[#D0BCFF] font-medium flex items-center gap-1 hover:underline cursor-pointer"
          >
            Manage Tasks <ArrowRight size={12} />
          </button>
        </div>

        {/* Quick Add Input */}
        <form onSubmit={handleQuickAddTask} className="flex gap-2">
          <input
            type="text"
            value={quickTaskTitle}
            onChange={(e) => setQuickTaskTitle(e.target.value)}
            placeholder="Add a new task for today..."
            className="flex-1 bg-[#ECE6F0] dark:bg-[#2B2930] rounded-2xl px-3.5 py-2 text-xs focus:outline-none text-[#1D1B20] dark:text-[#E6E0E9]"
          />
          <select
            value={quickTaskCategory}
            onChange={(e) => setQuickTaskCategory(e.target.value)}
            className="bg-[#ECE6F0] dark:bg-[#2B2930] rounded-2xl px-2 py-2 text-xs text-[#1D1B20] dark:text-[#E6E0E9] focus:outline-none"
          >
            {data.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <M3Button variant="filled" size="sm" type="submit" icon={<Plus size={14} />}>
            Add
          </M3Button>
        </form>

        {/* Task List (Top 5 on Dashboard) */}
        <div className="space-y-2 pt-1">
          {data.tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-2xl border transition-all duration-150 flex items-center justify-between cursor-pointer select-none ${
                task.isCompleted
                  ? 'bg-[#FEF7FF]/50 dark:bg-[#141218]/50 border-emerald-500/20 opacity-70'
                  : 'bg-[#FEF7FF] dark:bg-[#141218] border-[#CAC4D0]/40 hover:border-[#6750A4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                    task.isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-[#79747E] hover:border-[#6750A4]'
                  }`}
                >
                  {task.isCompleted && <CheckCircle2 size={14} />}
                </button>
                <div>
                  <span
                    className={`text-xs font-medium block ${
                      task.isCompleted
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-[#1D1B20] dark:text-[#E6E0E9]'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500">{task.category}</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        task.priority === 'High'
                          ? 'text-red-600 dark:text-red-400'
                          : task.priority === 'Medium'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      • {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              {task.deadline && (
                <span className="text-[10px] text-gray-400 font-mono">
                  {task.deadline}
                </span>
              )}
            </div>
          ))}

          {data.tasks.length === 0 && (
            <div className="text-center py-4 text-xs text-gray-400 italic">
              No tasks currently registered. Add tasks above to track progress!
            </div>
          )}

          {data.tasks.length > 5 && (
            <button
              onClick={() => onNavigateTab('tasks')}
              className="w-full text-center py-1.5 text-xs font-semibold text-[#6750A4] dark:text-[#D0BCFF] hover:underline cursor-pointer"
            >
              View all {data.tasks.length} tasks
            </button>
          )}
        </div>
      </M3Card>

      {/* 4. Daily Schedule Timeline (Only if entered) */}
      {hasRoutineInfo && (
        <M3Card variant="elevated" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              <Clock size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>Daily Routine Timeline</span>
            </div>
            <button
              onClick={() => onNavigateTab('routine')}
              className="text-xs text-[#6750A4] dark:text-[#D0BCFF] font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              Full Schedule <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {data.routine.wakeUpTime && (
              <div className="p-2.5 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
                <span className="text-gray-500 block text-[10px]">Wake Up</span>
                <span className="font-bold text-[#6750A4] dark:text-[#D0BCFF]">
                  {data.routine.wakeUpTime}
                </span>
              </div>
            )}
            {data.routine.studySchedule && (
              <div className="p-2.5 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
                <span className="text-gray-500 block text-[10px]">Study Block</span>
                <span className="font-medium truncate block">{data.routine.studySchedule}</span>
              </div>
            )}
            {data.routine.personalDevHours > 0 && (
              <div className="p-2.5 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
                <span className="text-gray-500 block text-[10px]">Personal Dev</span>
                <span className="font-bold">{data.routine.personalDevHours} hrs</span>
              </div>
            )}
            {data.routine.sleepTime && (
              <div className="p-2.5 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
                <span className="text-gray-500 block text-[10px]">Sleep</span>
                <span className="font-bold text-[#7D5260] dark:text-[#EFB8C8]">
                  {data.routine.sleepTime}
                </span>
              </div>
            )}
          </div>
        </M3Card>
      )}

      {/* 5. Learning Activities (Only if entered) */}
      {hasEducationInfo && (
        <M3Card variant="elevated" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              <GraduationCap size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>Learning Activities</span>
            </div>
            {data.education.dailyLearningTarget && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EADDFF] text-[#21005D]">
                Target: {data.education.dailyLearningTarget}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {/* Subjects */}
            {data.education.subjects.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                  Academic Subjects ({data.education.subjects.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.education.subjects.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 text-xs font-medium"
                    >
                      {s.name} {s.code && <span className="text-gray-400">[{s.code}]</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Courses */}
            {data.education.courses.length > 0 && (
              <div className="pt-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                  Active Online Courses
                </span>
                <div className="space-y-1">
                  {data.education.courses.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/30"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen size={13} className="text-[#6750A4]" />
                        <span className="font-medium">{c.title}</span>
                      </div>
                      <span className="text-gray-500 text-[10px]">{c.platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </M3Card>
      )}

      {/* 6. Current Projects (Only if entered) */}
      {hasProfessionalInfo && data.professional.projects.length > 0 && (
        <M3Card variant="elevated" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              <Briefcase size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>Current Projects ({data.professional.projects.length})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.professional.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-3 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
                      {proj.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {proj.description}
                  </p>
                </div>
                {proj.techStack && (
                  <span className="text-[10px] text-[#6750A4] dark:text-[#D0BCFF] font-medium mt-2">
                    {proj.techStack}
                  </span>
                )}
              </div>
            ))}
          </div>
        </M3Card>
      )}

      {/* 7. Active Goals (Only if entered) */}
      {hasGoalsInfo && (
        <M3Card variant="elevated" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              <Target size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>Active Goals ({data.goals.length})</span>
            </div>
          </div>

          <div className="space-y-2">
            {data.goals.map((g) => (
              <div
                key={g.id}
                className="p-2.5 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold">{g.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#EADDFF] text-[#21005D] text-[10px] font-bold">
                      {g.category}
                    </span>
                    {g.targetDate && (
                      <span className="text-gray-500 text-[10px]">Due {g.targetDate}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </M3Card>
      )}

      {/* 8. Productivity Snapshot link to Reports */}
      <div
        onClick={() => onNavigateTab('reports')}
        className="p-3.5 rounded-2xl bg-[#ECE6F0] dark:bg-[#2B2930] hover:bg-[#e4ddea] dark:hover:bg-[#34313b] cursor-pointer flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#6750A4] text-white flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
          <div>
            <span className="text-xs font-bold block text-[#1D1B20] dark:text-[#E6E0E9]">
              Weekly & Monthly Analytics
            </span>
            <span className="text-[11px] text-gray-500">
              View historical records and productivity charts
            </span>
          </div>
        </div>
        <ArrowRight size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
      </div>
    </div>
  );
};
