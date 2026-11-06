export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
export type GoalCategory = 'Short-term' | 'Long-term' | 'Educational' | 'Career' | 'Personal Development' | string;

export interface PersonalProfile {
  fullName: string;
  education: string;
  currentDegree: string;
  currentSemester: string;
  professionalBackground: string;
  interests: string[];
}

export interface RoutineItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'wake' | 'sleep' | 'study' | 'work' | 'personal' | 'other';
  notes?: string;
}

export interface DailyRoutine {
  wakeUpTime: string;
  sleepTime: string;
  studySchedule: string;
  workSchedule: string;
  personalDevHours: number;
  otherResponsibilities: string[];
  scheduleItems: RoutineItem[];
}

export interface SubjectItem {
  id: string;
  name: string;
  code?: string;
  credits?: string;
  notes?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  platform: string;
  totalHours?: number;
  completedHours?: number;
  progressPercentage?: number;
}

export interface SkillItem {
  id: string;
  name: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  category?: string;
}

export interface EducationLearning {
  subjects: SubjectItem[];
  courses: CourseItem[];
  skills: SkillItem[];
  currentLearningLevel: SkillLevel;
  targetLearningLevel: SkillLevel;
  dailyLearningTarget: string;
  weeklyLearningTarget: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack?: string;
  status: ProjectStatus;
  role?: string;
  link?: string;
}

export interface ProfessionalDevelopment {
  careerObjectives: string;
  technicalSkills: string[];
  businessInterests: string[];
  projects: ProjectItem[];
  professionalResponsibilities: string[];
}

export interface GoalItem {
  id: string;
  title: string;
  category: GoalCategory;
  description?: string;
  targetDate?: string;
  isCompleted: boolean;
  progressPercentage: number;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: PriorityLevel;
  deadline?: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  completedTaskIds: string[];
  productivityRating?: number; // 1-5 or calculated
  studyHoursLogged?: number;
}

export interface AppData {
  profile: PersonalProfile;
  routine: DailyRoutine;
  education: EducationLearning;
  professional: ProfessionalDevelopment;
  goals: GoalItem[];
  tasks: TaskItem[];
  categories: string[];
  dailyHistory: Record<string, DailyRecord>; // Keyed by YYYY-MM-DD
  isDataConfirmed: boolean;
  confirmedAt?: string;
}

export type NavigationTab = 'dashboard' | 'tasks' | 'routine' | 'reports' | 'settings';
