import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useLifeManagerViewModel } from './viewmodel/LifeManagerViewModel';
import { AndroidFrame } from './components/android/AndroidFrame';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DataReviewScreen } from './components/review/DataReviewScreen';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { TasksScreen } from './components/tasks/TasksScreen';
import { ScheduleScreen } from './components/schedule/ScheduleScreen';
import { ReportsScreen } from './components/reports/ReportsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { NavigationTab } from './types';

export default function App() {
  const {
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
  } = useLifeManagerViewModel();

  // Bottom Navigation tabs definition
  const navTabs: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare size={20} />,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    { id: 'routine', label: 'Routine', icon: <Clock size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={themeMode === 'dark' ? 'dark' : ''}>
      <AndroidFrame
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        deviceFrameMode={deviceFrameMode}
        setDeviceFrameMode={setDeviceFrameMode}
      >
        {/* PHASE 1 & PHASE 2: Gatekeeper before Data Confirmation */}
        {!data.isDataConfirmed ? (
          reviewModeActive ? (
            <DataReviewScreen
              profile={data.profile}
              routine={data.routine}
              education={data.education}
              professional={data.professional}
              goals={data.goals}
              onUpdateProfile={updateProfile}
              onUpdateRoutine={updateRoutine}
              onUpdateEducation={updateEducation}
              onUpdateProfessional={updateProfessional}
              onUpdateGoals={(goals) => {
                // Update goals in DB
                data.goals = goals;
              }}
              onConfirmAndGenerateDashboard={confirmDataAndGenerateDashboard}
              onGoBackToStep={(step) => {
                setOnboardingStep(step);
                setReviewModeActive(false);
              }}
            />
          ) : (
            <OnboardingFlow
              initialProfile={data.profile}
              initialRoutine={data.routine}
              initialEducation={data.education}
              initialProfessional={data.professional}
              initialGoals={data.goals}
              currentStep={onboardingStep}
              setCurrentStep={setOnboardingStep}
              onComplete={(collected) => {
                updateProfile(collected.profile);
                updateRoutine(collected.routine);
                updateEducation(collected.education);
                updateProfessional(collected.professional);
                collected.goals.forEach((g) => addGoal(g));
                setReviewModeActive(true);
              }}
            />
          )
        ) : (
          /* PHASE 3 - 8: Personalized Confirmed Application */
          <div className="flex-1 flex flex-col h-full relative">
            {/* Screen Content by Current Tab */}
            <div className="flex-1 overflow-y-auto pb-20">
              {currentTab === 'dashboard' && (
                <DashboardScreen
                  data={data}
                  todayDateStr={todayDateStr}
                  totalTasksCount={totalTasksCount}
                  completedTasksCount={completedTasksCount}
                  pendingTasksCount={pendingTasksCount}
                  dailyProgressPercentage={dailyProgressPercentage}
                  onToggleTask={toggleTaskCompleted}
                  onAddTask={addTask}
                  onNavigateTab={setCurrentTab}
                />
              )}

              {currentTab === 'tasks' && (
                <TasksScreen
                  tasks={data.tasks}
                  categories={data.categories}
                  totalTasksCount={totalTasksCount}
                  completedTasksCount={completedTasksCount}
                  pendingTasksCount={pendingTasksCount}
                  dailyProgressPercentage={dailyProgressPercentage}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onToggleTask={toggleTaskCompleted}
                />
              )}

              {currentTab === 'routine' && (
                <ScheduleScreen
                  routine={data.routine}
                  education={data.education}
                  onUpdateRoutine={updateRoutine}
                  onUpdateEducation={updateEducation}
                />
              )}

              {currentTab === 'reports' && (
                <ReportsScreen
                  data={data}
                  todayDateStr={todayDateStr}
                  totalTasksCount={totalTasksCount}
                  completedTasksCount={completedTasksCount}
                  pendingTasksCount={pendingTasksCount}
                  dailyProgressPercentage={dailyProgressPercentage}
                  analytics={analytics}
                  onUpdateGoal={updateGoal}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsScreen
                  profile={data.profile}
                  routine={data.routine}
                  categories={data.categories}
                  goals={data.goals}
                  themeMode={themeMode}
                  setThemeMode={setThemeMode}
                  deviceFrameMode={deviceFrameMode}
                  setDeviceFrameMode={setDeviceFrameMode}
                  onUpdateProfile={updateProfile}
                  onUpdateRoutine={updateRoutine}
                  onAddCategory={addCategory}
                  onDeleteCategory={deleteCategory}
                  onAddGoal={addGoal}
                  onDeleteGoal={deleteGoal}
                  onExportBackup={exportBackup}
                  onImportBackup={importBackup}
                  onResetAllData={resetAllData}
                  onRestartOnboarding={() => {
                    setOnboardingStep(1);
                    setReviewModeActive(false);
                  }}
                />
              )}
            </div>

            {/* Material 3 Bottom Navigation Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#F3EDF7] dark:bg-[#211F26] border-t border-[#CAC4D0]/40 dark:border-[#49454F]/40 flex items-center justify-around px-2 z-30 select-none shadow-md">
              {navTabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer group focus:outline-none"
                  >
                    <div
                      className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                        isActive
                          ? 'bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF]'
                          : 'text-[#49454F] dark:text-[#CAC4D0] group-hover:bg-[#EADDFF]/40 dark:group-hover:bg-[#4F378B]/30'
                      }`}
                    >
                      {tab.icon}
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#BA1A1A] text-white text-[10px] font-bold flex items-center justify-center">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] mt-0.5 tracking-tight transition-colors ${
                        isActive
                          ? 'font-bold text-[#1D1B20] dark:text-[#E6E0E9]'
                          : 'font-medium text-[#49454F] dark:text-[#CAC4D0]'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </AndroidFrame>
    </div>
  );
}
