import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  PieChart,
  Award,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import {
  AppData,
  GoalItem,
  DailyRecord,
  PriorityLevel,
} from '../../types';
import {
  M3Button,
  M3Card,
  M3Chip,
  M3CircularProgress,
  M3LinearProgress,
} from '../common/MaterialComponents';
import { formatDisplayDate } from '../../viewmodel/LifeManagerViewModel';

interface ReportsScreenProps {
  data: AppData;
  todayDateStr: string;
  totalTasksCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  dailyProgressPercentage: number;
  analytics: {
    historyEntries: DailyRecord[];
    last7Days: DailyRecord[];
    weeklyAvgProgress: number;
    bestDay: string;
    categoryStats: Record<string, { total: number; completed: number }>;
    priorityStats: Record<PriorityLevel, { total: number; completed: number }>;
  };
  onUpdateGoal: (id: string, updates: Partial<GoalItem>) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  data,
  todayDateStr,
  totalTasksCount,
  completedTasksCount,
  pendingTasksCount,
  dailyProgressPercentage,
  analytics,
  onUpdateGoal,
}) => {
  const [reportView, setReportView] = useState<'daily' | 'weekly' | 'monthly' | 'goals'>('daily');

  // Days of week labels for weekly chart
  const getDayName = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      return '';
    }
  };

  // Goals completion stats
  const totalGoals = data.goals.length;
  const completedGoals = data.goals.filter((g) => g.isCompleted).length;
  const goalsProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1D1B20] dark:text-[#E6E0E9]">
            Productivity & Reports
          </h1>
          <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
            Verified metrics, task statistics, and historical trends
          </p>
        </div>
      </div>

      {/* Report View Toggle Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <M3Chip
          label="Daily Report"
          selected={reportView === 'daily'}
          onClick={() => setReportView('daily')}
        />
        <M3Chip
          label="Weekly Analytics"
          selected={reportView === 'weekly'}
          onClick={() => setReportView('weekly')}
        />
        <M3Chip
          label="Monthly Performance"
          selected={reportView === 'monthly'}
          onClick={() => setReportView('monthly')}
        />
        <M3Chip
          label="Goal & Learning Milestones"
          selected={reportView === 'goals'}
          onClick={() => setReportView('goals')}
        />
      </div>

      {/* 1. DAILY REPORT */}
      {reportView === 'daily' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Daily Summary Card */}
          <M3Card variant="elevated" className="bg-[#ECE6F0] dark:bg-[#2B2930] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6750A4] dark:text-[#D0BCFF]">
                Today's Snapshot ({todayDateStr})
              </span>
              <div className="text-2xl font-black text-[#1D1B20] dark:text-[#E6E0E9]">
                {dailyProgressPercentage}% Completed
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                {completedTasksCount} finished • {pendingTasksCount} remaining • {totalTasksCount} total
              </div>
            </div>
            <div className="flex-shrink-0">
              <M3CircularProgress progress={dailyProgressPercentage} size={76} strokeWidth={8} />
            </div>
          </M3Card>

          {/* Category Breakdown */}
          <M3Card variant="elevated" className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              <PieChart size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>Completion by Category</span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(analytics.categoryStats).map(([cat, stats]) => {
                const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">{cat}</span>
                      <span className="text-gray-500">
                        {stats.completed}/{stats.total} ({pct}%)
                      </span>
                    </div>
                    <M3LinearProgress progress={pct} />
                  </div>
                );
              })}

              {Object.keys(analytics.categoryStats).length === 0 && (
                <p className="text-xs text-gray-400 italic">No tasks categorized yet.</p>
              )}
            </div>
          </M3Card>

          {/* Priority Breakdown */}
          <M3Card variant="elevated" className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              <BarChart3 size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
              <span>Priority Level Distribution</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40">
                <span className="text-red-700 dark:text-red-300 font-bold block text-sm">
                  {analytics.priorityStats.High.completed}/{analytics.priorityStats.High.total}
                </span>
                <span className="text-gray-500 text-[11px]">High Priority</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40">
                <span className="text-amber-700 dark:text-amber-300 font-bold block text-sm">
                  {analytics.priorityStats.Medium.completed}/{analytics.priorityStats.Medium.total}
                </span>
                <span className="text-gray-500 text-[11px]">Medium Priority</span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                <span className="text-blue-700 dark:text-blue-300 font-bold block text-sm">
                  {analytics.priorityStats.Low.completed}/{analytics.priorityStats.Low.total}
                </span>
                <span className="text-gray-500 text-[11px]">Low Priority</span>
              </div>
            </div>
          </M3Card>
        </div>
      )}

      {/* 2. WEEKLY ANALYTICS */}
      {reportView === 'weekly' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Weekly Summary Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#ECE6F0] dark:bg-[#2B2930] border border-[#CAC4D0]/30">
              <span className="text-gray-500 block text-[11px]">7-Day Average</span>
              <span className="text-2xl font-black text-[#6750A4] dark:text-[#D0BCFF] mt-0.5 block">
                {analytics.weeklyAvgProgress}%
              </span>
              <span className="text-[10px] text-gray-400">Completion rate</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#ECE6F0] dark:bg-[#2B2930] border border-[#CAC4D0]/30">
              <span className="text-gray-500 block text-[11px]">Most Productive</span>
              <span className="text-base font-bold text-[#1D1B20] dark:text-[#E6E0E9] mt-1 block truncate">
                {analytics.bestDay}
              </span>
              <span className="text-[10px] text-gray-400">Peak task output</span>
            </div>
          </div>

          {/* 7-Day Interactive Bar Chart */}
          <M3Card variant="elevated" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
                Last 7 Days Completion Rate (%)
              </span>
              <span className="text-xs text-gray-500">Room Database History</span>
            </div>

            {/* SVG/Canvas Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-[#CAC4D0]/30">
              {analytics.last7Days.map((record) => {
                const isToday = record.date === todayDateStr;
                const heightPct = Math.max(8, record.progressPercentage);
                const dayLabel = getDayName(record.date);

                return (
                  <div key={record.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-semibold text-gray-500 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {record.progressPercentage}%
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                        isToday
                          ? 'bg-[#6750A4] dark:bg-[#D0BCFF]'
                          : record.progressPercentage > 0
                          ? 'bg-[#7D5260] dark:bg-[#EFB8C8]'
                          : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                    <span className={`text-[10px] font-medium mt-1.5 ${isToday ? 'font-bold text-[#6750A4] dark:text-[#D0BCFF]' : 'text-gray-500'}`}>
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-500 text-center">
              Historical records are permanently locked in Room DB and never overwritten.
            </p>
          </M3Card>
        </div>
      )}

      {/* 3. MONTHLY PERFORMANCE */}
      {reportView === 'monthly' && (
        <div className="space-y-4 animate-fadeIn">
          <M3Card variant="elevated" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
                Monthly Consistency Calendar
              </span>
              <span className="text-xs text-gray-500 font-medium">Last 30 Days</span>
            </div>
            <p className="text-xs text-gray-500">
              Color intensity reflects daily progress: darker purple = higher completion rate.
            </p>

            {/* 30 Days Heat Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const dayIndex = 27 - i;
                const d = new Date();
                d.setDate(d.getDate() - dayIndex);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const key = `${year}-${month}-${day}`;

                const record = data.dailyHistory[key];
                const pct = key === todayDateStr ? dailyProgressPercentage : record?.progressPercentage || 0;

                let colorClass = 'bg-[#ECE6F0] dark:bg-[#2B2930] text-gray-400';
                if (pct >= 90) colorClass = 'bg-[#6750A4] text-white';
                else if (pct >= 60) colorClass = 'bg-[#7D5260] text-white';
                else if (pct >= 30) colorClass = 'bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-white';
                else if (pct > 0) colorClass = 'bg-[#E8DEF8] text-[#1D192B]';

                return (
                  <div
                    key={key}
                    title={`${key}: ${pct}% completed`}
                    className={`h-9 rounded-xl flex flex-col items-center justify-center text-[10px] font-medium transition-transform hover:scale-105 cursor-pointer ${colorClass}`}
                  >
                    <span>{day}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-gray-500">
              <span>Less</span>
              <span className="w-3 h-3 rounded bg-[#ECE6F0] dark:bg-[#2B2930]" />
              <span className="w-3 h-3 rounded bg-[#E8DEF8]" />
              <span className="w-3 h-3 rounded bg-[#7D5260]" />
              <span className="w-3 h-3 rounded bg-[#6750A4]" />
              <span>More</span>
            </div>
          </M3Card>
        </div>
      )}

      {/* 4. GOAL & LEARNING PROGRESS */}
      {reportView === 'goals' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Goal progress card */}
          <M3Card variant="elevated" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
                <Target size={16} className="text-[#6750A4] dark:text-[#D0BCFF]" />
                <span>Life Goals Milestones</span>
              </div>
              <span className="text-xs font-bold text-[#6750A4] dark:text-[#D0BCFF]">
                {completedGoals}/{totalGoals} ({goalsProgress}%)
              </span>
            </div>

            <M3LinearProgress progress={goalsProgress} />

            <div className="space-y-2 pt-2">
              {data.goals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onUpdateGoal(goal.id, { isCompleted: !goal.isCompleted })}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                        goal.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-[#79747E]'
                      }`}
                    >
                      {goal.isCompleted && <CheckCircle2 size={14} />}
                    </button>
                    <div>
                      <span
                        className={`text-xs font-semibold block ${
                          goal.isCompleted ? 'line-through text-gray-400' : 'text-[#1D1B20] dark:text-[#E6E0E9]'
                        }`}
                      >
                        {goal.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#EADDFF] text-[#21005D] font-bold">
                          {goal.category}
                        </span>
                        {goal.targetDate && (
                          <span className="text-[10px] text-gray-500">Due {goal.targetDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {data.goals.length === 0 && (
                <p className="text-xs text-gray-400 italic">No goals registered yet.</p>
              )}
            </div>
          </M3Card>
        </div>
      )}
    </div>
  );
};
