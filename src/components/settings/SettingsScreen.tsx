import React, { useState } from 'react';
import {
  User,
  Clock,
  Tag,
  Target,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';
import {
  PersonalProfile,
  DailyRoutine,
  GoalItem,
} from '../../types';
import {
  M3Button,
  M3Card,
  M3Chip,
  M3Dialog,
  M3TextField,
} from '../common/MaterialComponents';

interface SettingsScreenProps {
  profile: PersonalProfile;
  routine: DailyRoutine;
  categories: string[];
  goals: GoalItem[];
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  deviceFrameMode: boolean;
  setDeviceFrameMode: (val: boolean) => void;
  onUpdateProfile: (p: PersonalProfile) => void;
  onUpdateRoutine: (r: DailyRoutine) => void;
  onAddCategory: (cat: string) => void;
  onDeleteCategory: (cat: string) => void;
  onAddGoal: (g: Omit<GoalItem, 'id'>) => void;
  onDeleteGoal: (id: string) => void;
  onExportBackup: () => void;
  onImportBackup: (json: string) => boolean;
  onResetAllData: () => void;
  onRestartOnboarding: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile,
  routine,
  categories,
  goals,
  themeMode,
  setThemeMode,
  deviceFrameMode,
  setDeviceFrameMode,
  onUpdateProfile,
  onUpdateRoutine,
  onAddCategory,
  onDeleteCategory,
  onAddGoal,
  onDeleteGoal,
  onExportBackup,
  onImportBackup,
  onResetAllData,
  onRestartOnboarding,
}) => {
  // Modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Edit Profile Form
  const [tempProfile, setTempProfile] = useState<PersonalProfile>(profile);

  // Edit Routine Form
  const [tempRoutine, setTempRoutine] = useState<DailyRoutine>(routine);

  // New Category
  const [newCatInput, setNewCatInput] = useState('');

  // Import JSON string
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfile = () => {
    onUpdateProfile(tempProfile);
    setIsProfileModalOpen(false);
  };

  const handleSaveRoutine = () => {
    onUpdateRoutine(tempRoutine);
    setIsRoutineModalOpen(false);
  };

  const handleAddCategorySubmit = () => {
    if (newCatInput.trim()) {
      onAddCategory(newCatInput.trim());
      setNewCatInput('');
    }
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const success = onImportBackup(importJsonText.trim());
    if (success) {
      setImportStatus('Backup restored successfully!');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus(null);
        setImportJsonText('');
      }, 1000);
    } else {
      setImportStatus('Failed to parse backup JSON. Please check file format.');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1D1B20] dark:text-[#E6E0E9]">
          Settings & Preferences
        </h1>
        <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
          Manage your personal profile, database backup, appearance, and categories
        </p>
      </div>

      {/* 1. Profile Settings */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#EADDFF] dark:bg-[#4F378B] flex items-center justify-center text-[#21005D] dark:text-[#EADDFF]">
              <User size={18} />
            </div>
            <div>
              <span className="font-bold text-sm block text-[#1D1B20] dark:text-[#E6E0E9]">
                {profile.fullName || 'Personal Profile'}
              </span>
              <span className="text-xs text-gray-500">
                {profile.currentDegree || 'Education & Career Info'}
              </span>
            </div>
          </div>
          <M3Button
            variant="tonal"
            size="sm"
            onClick={() => {
              setTempProfile(profile);
              setIsProfileModalOpen(true);
            }}
          >
            Edit Profile
          </M3Button>
        </div>
      </M3Card>

      {/* 2. Daily Routine Settings */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E8DEF8] dark:bg-[#4A4458] flex items-center justify-center text-[#1D192B] dark:text-[#E8DEF8]">
              <Clock size={18} />
            </div>
            <div>
              <span className="font-bold text-sm block text-[#1D1B20] dark:text-[#E6E0E9]">
                Daily Routine Schedule
              </span>
              <span className="text-xs text-gray-500">
                Wake: {routine.wakeUpTime} • Sleep: {routine.sleepTime} • {routine.personalDevHours}h dev
              </span>
            </div>
          </div>
          <M3Button
            variant="tonal"
            size="sm"
            onClick={() => {
              setTempRoutine(routine);
              setIsRoutineModalOpen(true);
            }}
          >
            Update
          </M3Button>
        </div>
      </M3Card>

      {/* 3. Task Categories */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FFD8E4] dark:bg-[#633B48] flex items-center justify-center text-[#31111D] dark:text-[#FFD8E4]">
              <Tag size={18} />
            </div>
            <div>
              <span className="font-bold text-sm block text-[#1D1B20] dark:text-[#E6E0E9]">
                Manage Categories ({categories.length})
              </span>
              <span className="text-xs text-gray-500">Custom labels for organizing tasks</span>
            </div>
          </div>
          <M3Button
            variant="tonal"
            size="sm"
            onClick={() => setIsCategoriesModalOpen(true)}
          >
            Manage
          </M3Button>
        </div>
      </M3Card>

      {/* 4. Display & Appearance */}
      <M3Card variant="elevated" className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6750A4] dark:text-[#D0BCFF]">
          Appearance & Hardware
        </span>

        {/* Theme mode toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs font-medium">
            {themeMode === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            <span>Color Theme</span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setThemeMode('light')}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                themeMode === 'light'
                  ? 'bg-[#6750A4] text-white'
                  : 'bg-[#ECE6F0] dark:bg-[#2B2930] text-gray-500'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                themeMode === 'dark'
                  ? 'bg-[#D0BCFF] text-[#381E72]'
                  : 'bg-[#ECE6F0] dark:bg-[#2B2930] text-gray-500'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Device frame toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#CAC4D0]/20">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Smartphone size={16} />
            <span>Google Pixel Device Frame</span>
          </div>
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
              deviceFrameMode
                ? 'bg-[#6750A4] text-white'
                : 'bg-[#ECE6F0] dark:bg-[#2B2930] text-gray-500'
            }`}
          >
            {deviceFrameMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </M3Card>

      {/* 5. Data Backup & Recovery */}
      <M3Card variant="elevated" className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6750A4] dark:text-[#D0BCFF]">
          Room Database Storage
        </span>
        <p className="text-xs text-gray-500">
          All personal information, routines, tasks, and daily historical records are saved locally. You can export a full JSON backup or restore anytime.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <M3Button variant="tonal" size="sm" onClick={onExportBackup} icon={<Download size={14} />}>
            Export JSON Backup
          </M3Button>
          <M3Button
            variant="tonal"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            icon={<Upload size={14} />}
          >
            Restore Backup
          </M3Button>
        </div>
      </M3Card>

      {/* 6. Danger Zone: Reset Data */}
      <M3Card variant="outlined" className="border-red-300 dark:border-red-900/60 space-y-3">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert size={15} />
          <span>Reset Application</span>
        </div>
        <p className="text-xs text-gray-500">
          Clears all stored personal profile, tasks, routines, and historical records. Requires confirmation.
        </p>
        <div className="flex gap-2 pt-1">
          <M3Button
            variant="danger"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            icon={<RotateCcw size={14} />}
          >
            Reset All Application Data
          </M3Button>
        </div>
      </M3Card>

      {/* Edit Profile Dialog */}
      <M3Dialog
        isOpen={isProfileModalOpen}
        title="Edit Personal Profile"
        onClose={() => setIsProfileModalOpen(false)}
        confirmLabel="Save Profile"
        onConfirm={handleSaveProfile}
      >
        <div className="space-y-3 pt-2">
          <M3TextField
            label="Full Name"
            value={tempProfile.fullName}
            onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
          />
          <M3TextField
            label="Education"
            value={tempProfile.education}
            onChange={(e) => setTempProfile({ ...tempProfile, education: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <M3TextField
              label="Degree / Major"
              value={tempProfile.currentDegree}
              onChange={(e) => setTempProfile({ ...tempProfile, currentDegree: e.target.value })}
            />
            <M3TextField
              label="Current Semester"
              value={tempProfile.currentSemester}
              onChange={(e) => setTempProfile({ ...tempProfile, currentSemester: e.target.value })}
            />
          </div>
          <M3TextField
            label="Professional Background"
            multiline
            rows={2}
            value={tempProfile.professionalBackground}
            onChange={(e) =>
              setTempProfile({ ...tempProfile, professionalBackground: e.target.value })
            }
          />
        </div>
      </M3Dialog>

      {/* Edit Routine Dialog */}
      <M3Dialog
        isOpen={isRoutineModalOpen}
        title="Update Daily Routine"
        onClose={() => setIsRoutineModalOpen(false)}
        confirmLabel="Save Routine"
        onConfirm={handleSaveRoutine}
      >
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <M3TextField
              label="Wake-Up Time"
              type="time"
              value={tempRoutine.wakeUpTime}
              onChange={(e) => setTempRoutine({ ...tempRoutine, wakeUpTime: e.target.value })}
            />
            <M3TextField
              label="Sleep Time"
              type="time"
              value={tempRoutine.sleepTime}
              onChange={(e) => setTempRoutine({ ...tempRoutine, sleepTime: e.target.value })}
            />
          </div>
          <M3TextField
            label="Study Schedule"
            value={tempRoutine.studySchedule}
            onChange={(e) => setTempRoutine({ ...tempRoutine, studySchedule: e.target.value })}
          />
          <M3TextField
            label="Work Schedule"
            value={tempRoutine.workSchedule}
            onChange={(e) => setTempRoutine({ ...tempRoutine, workSchedule: e.target.value })}
          />
          <M3TextField
            label="Personal Development Hours / Day"
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={tempRoutine.personalDevHours}
            onChange={(e) =>
              setTempRoutine({
                ...tempRoutine,
                personalDevHours: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </M3Dialog>

      {/* Manage Categories Dialog */}
      <M3Dialog
        isOpen={isCategoriesModalOpen}
        title="Manage Task Categories"
        onClose={() => setIsCategoriesModalOpen(false)}
        confirmLabel="Done"
        onConfirm={() => setIsCategoriesModalOpen(false)}
      >
        <div className="space-y-3 pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategorySubmit())}
              placeholder="New category name..."
              className="flex-1 bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
            <M3Button variant="tonal" size="sm" onClick={handleAddCategorySubmit} icon={<Plus size={14} />}>
              Add
            </M3Button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {categories.map((c) => (
              <M3Chip
                key={c}
                label={c}
                onDelete={() => onDeleteCategory(c)}
              />
            ))}
          </div>
        </div>
      </M3Dialog>

      {/* Restore Backup Dialog */}
      <M3Dialog
        isOpen={isImportModalOpen}
        title="Restore JSON Database Backup"
        onClose={() => setIsImportModalOpen(false)}
        confirmLabel="Import & Apply"
        onConfirm={handleImportSubmit}
      >
        <div className="space-y-3 pt-2">
          <p className="text-xs text-gray-500">
            Paste the raw JSON content exported from your My Life Manager backup:
          </p>
          <textarea
            rows={6}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="Paste JSON here..."
            className="w-full bg-[#ECE6F0] dark:bg-[#2B2930] rounded-2xl p-3 text-xs font-mono focus:outline-none resize-none"
          />
          {importStatus && (
            <p className={`text-xs font-medium ${importStatus.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
              {importStatus}
            </p>
          )}
        </div>
      </M3Dialog>

      {/* Reset Confirmation Dialog */}
      <M3Dialog
        isOpen={isResetConfirmOpen}
        title="Confirm Full Database Reset?"
        onClose={() => setIsResetConfirmOpen(false)}
        confirmLabel="Yes, Reset Everything"
        confirmVariant="danger"
        onConfirm={() => {
          onResetAllData();
          setIsResetConfirmOpen(false);
        }}
      >
        <p className="text-xs text-gray-600 dark:text-gray-300">
          This will permanently delete your stored profile, tasks, daily routine, and historical completion records from Room Database. You will be redirected to the initial onboarding screen.
        </p>
      </M3Dialog>
    </div>
  );
};
