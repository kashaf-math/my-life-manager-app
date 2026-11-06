import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { RoomDatabase } from '../db/roomDatabase';
import {
  AppData,
  DailyRecord,
  GoalItem,
  TaskItem,
  PersonalProfile,
  DailyRoutine,
  EducationLearning,
  ProfessionalDevelopment,
  NavigationTab,
  PriorityLevel,
  SubjectItem,
  CourseItem,
  SkillItem,
  ProjectItem,
} from '../types';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getTimeGreeting(name?: string): string {
  const hour = new Date().getHours();
  let greeting = 'Hello';
  if (hour >= 4 && hour < 12) greeting = 'Good morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 22) greeting = 'Good evening';
  else greeting = 'Good night';

  return name ? `${greeting}, ${name}` : greeting;
}

export function useLifeManagerViewModel() {
  const db = useMemo(() => RoomDatabase.getInstance(), []);
  const [data, setData] = useState<AppData>(() => db.getData());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true); // Android device preview frame vs responsive
  const [reviewModeActive, setReviewModeActive] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  // Sync state to memory
  const refreshData = useCallback(() => {
    setData(db.getData());
  }, [db]);

  // Today's date
  const todayDateStr = getTodayDateString();

  // Progress calculation strictly using formula:
  // Progress = (Completed Tasks / Total Tasks) × 100
  // Safe 0% for empty tasks
  const todayTasks = useMemo(() => {
    // Tasks that either have no deadline, or deadline is today or past, or are general daily tasks
    return data.tasks;
  }, [data.tasks]);

  const totalTasksCount = todayTasks.length;
  const completedTasksCount = todayTasks.filter((t) => t.isCompleted).length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;

  const dailyProgressPercentage = useMemo(() => {
    if (totalTasksCount === 0) return 0;
    const progress = (completedTasksCount / totalTasksCount) * 100;
    return Math.round(progress);
  }, [completedTasksCount, totalTasksCount]);

  // Automatically record daily snapshot whenever tasks change
  useEffect(() => {
    if (data.isDataConfirmed) {
      const completedIds = data.tasks.filter((t) => t.isCompleted).map((t) => t.id);
      db.recordDailySnapshot(
        todayDateStr,
        totalTasksCount,
        completedTasksCount,
        dailyProgressPercentage,
        completedIds
      );
    }
  }, [data.isDataConfirmed, todayDateStr, totalTasksCount, completedTasksCount, dailyProgressPercentage, data.tasks, db]);

  // Trigger celebration confetti
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6750A4', '#D0BCFF', '#7D5260', '#B69DF8', '#FFD8E4'],
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  // Task actions
  const addTask = useCallback(
    (newTask: Omit<TaskItem, 'id' | 'createdAt' | 'isCompleted'>) => {
      const task: TaskItem = {
        ...newTask,
        id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [task, ...data.tasks];
      db.saveTasks(updated);
      refreshData();
    },
    [data.tasks, db, refreshData]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<TaskItem>) => {
      const updated = data.tasks.map((task) => {
        if (task.id === id) {
          const updatedTask = { ...task, ...updates };
          if (updates.isCompleted !== undefined) {
            updatedTask.completedAt = updates.isCompleted ? new Date().toISOString() : undefined;
          }
          return updatedTask;
        }
        return task;
      });
      db.saveTasks(updated);
      refreshData();
    },
    [data.tasks, db, refreshData]
  );

  const toggleTaskCompleted = useCallback(
    (id: string) => {
      const target = data.tasks.find((t) => t.id === id);
      const isNowCompleted = !target?.isCompleted;
      const updated = data.tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            isCompleted: isNowCompleted,
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return task;
      });
      db.saveTasks(updated);
      refreshData();

      // Check if newly reached 100%
      const newCompleted = updated.filter((t) => t.isCompleted).length;
      if (updated.length > 0 && newCompleted === updated.length && isNowCompleted) {
        triggerCelebration();
      }
    },
    [data.tasks, db, refreshData, triggerCelebration]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const updated = data.tasks.filter((t) => t.id !== id);
      db.saveTasks(updated);
      refreshData();
    },
    [data.tasks, db, refreshData]
  );

  // Goal actions
  const addGoal = useCallback(
    (goal: Omit<GoalItem, 'id'>) => {
      const newGoal: GoalItem = {
        ...goal,
        id: `goal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      };
      const updated = [...data.goals, newGoal];
      db.saveGoals(updated);
      refreshData();
    },
    [data.goals, db, refreshData]
  );

  const updateGoal = useCallback(
    (id: string, updates: Partial<GoalItem>) => {
      const updated = data.goals.map((g) => (g.id === id ? { ...g, ...updates } : g));
      db.saveGoals(updated);
      refreshData();
    },
    [data.goals, db, refreshData]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      const updated = data.goals.filter((g) => g.id !== id);
      db.saveGoals(updated);
      refreshData();
    },
    [data.goals, db, refreshData]
  );

  // Profile actions
  const updateProfile = useCallback(
    (profile: PersonalProfile) => {
      db.saveProfile(profile);
      refreshData();
    },
    [db, refreshData]
  );

  // Routine actions
  const updateRoutine = useCallback(
    (routine: DailyRoutine) => {
      db.saveRoutine(routine);
      refreshData();
    },
    [db, refreshData]
  );

  // Education actions
  const updateEducation = useCallback(
    (education: EducationLearning) => {
      db.saveEducation(education);
      refreshData();
    },
    [db, refreshData]
  );

  // Professional actions
  const updateProfessional = useCallback(
    (professional: ProfessionalDevelopment) => {
      db.saveProfessional(professional);
      refreshData();
    },
    [db, refreshData]
  );

  // Categories
  const addCategory = useCallback(
    (cat: string) => {
      db.addCategory(cat);
      refreshData();
    },
    [db, refreshData]
  );

  const deleteCategory = useCallback(
    (cat: string) => {
      db.deleteCategory(cat);
      refreshData();
    },
    [db, refreshData]
  );

  // Confirmation Flow (Phase 2 -> Phase 3)
  const confirmDataAndGenerateDashboard = useCallback(() => {
    db.setConfirmationStatus(true);
    setReviewModeActive(false);
    refreshData();
    triggerCelebration();
  }, [db, refreshData, triggerCelebration]);

  // Reset Application Data
  const resetAllData = useCallback(() => {
    db.clearAllData();
    setData(db.getData());
    setOnboardingStep(1);
    setReviewModeActive(false);
    setCurrentTab('dashboard');
  }, [db]);

  // Export / Import
  const exportBackup = useCallback(() => {
    const json = db.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_life_manager_backup_${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [db]);

  const importBackup = useCallback(
    (jsonString: string): boolean => {
      const success = db.importBackupJson(jsonString);
      if (success) {
        refreshData();
      }
      return success;
    },
    [db, refreshData]
  );

  // Analytics helper for Reports
  const analytics = useMemo(() => {
    const history = data.dailyHistory;
    const historyEntries = Object.values(history).sort((a, b) => a.date.localeCompare(b.date));

    // Last 7 days
    const last7Days: DailyRecord[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (dateKey === todayDateStr) {
        last7Days.push({
          date: dateKey,
          totalTasks: totalTasksCount,
          completedTasks: completedTasksCount,
          progressPercentage: dailyProgressPercentage,
          completedTaskIds: [],
        });
      } else {
        last7Days.push(
          history[dateKey] || {
            date: dateKey,
            totalTasks: 0,
            completedTasks: 0,
            progressPercentage: 0,
            completedTaskIds: [],
          }
        );
      }
    }

    const weeklyAvgProgress =
      last7Days.filter((d) => d.totalTasks > 0).length > 0
        ? Math.round(
            last7Days
              .filter((d) => d.totalTasks > 0)
              .reduce((acc, curr) => acc + curr.progressPercentage, 0) /
              last7Days.filter((d) => d.totalTasks > 0).length
          )
        : dailyProgressPercentage;

    // Most productive day
    let bestDay = 'Today';
    let bestProgress = -1;
    last7Days.forEach((day) => {
      if (day.totalTasks > 0 && day.progressPercentage > bestProgress) {
        bestProgress = day.progressPercentage;
        bestDay = formatDisplayDate(day.date);
      }
    });

    // Category breakdown
    const categoryStats: Record<string, { total: number; completed: number }> = {};
    data.tasks.forEach((t) => {
      if (!categoryStats[t.category]) {
        categoryStats[t.category] = { total: 0, completed: 0 };
      }
      categoryStats[t.category].total += 1;
      if (t.isCompleted) {
        categoryStats[t.category].completed += 1;
      }
    });

    // Priority breakdown
    const priorityStats: Record<PriorityLevel, { total: number; completed: number }> = {
      High: { total: 0, completed: 0 },
      Medium: { total: 0, completed: 0 },
      Low: { total: 0, completed: 0 },
    };
    data.tasks.forEach((t) => {
      if (priorityStats[t.priority]) {
        priorityStats[t.priority].total += 1;
        if (t.isCompleted) {
          priorityStats[t.priority].completed += 1;
        }
      }
    });

    return {
      historyEntries,
      last7Days,
      weeklyAvgProgress,
      bestDay: bestProgress >= 0 ? bestDay : 'N/A',
      categoryStats,
      priorityStats,
    };
  }, [data.dailyHistory, data.tasks, dailyProgressPercentage, totalTasksCount, completedTasksCount, todayDateStr]);

  return {
    data,
    currentTab,
    setCurrentTab,
    themeMode,
    setThemeMode,
    deviceFrameMode,
    setDeviceFrameMode,
    reviewModeActive,
    setReviewModeActive,
    onboardingStep,
    setOnboardingStep,
    todayDateStr,
    todayTasks,
    totalTasksCount,
    completedTasksCount,
    pendingTasksCount,
    dailyProgressPercentage,
    addTask,
    updateTask,
    toggleTaskCompleted,
    deleteTask,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProfile,
    updateRoutine,
    updateEducation,
    updateProfessional,
    addCategory,
    deleteCategory,
    confirmDataAndGenerateDashboard,
    resetAllData,
    exportBackup,
    importBackup,
    analytics,
  };
}
