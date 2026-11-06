import React, { useState } from 'react';
import {
  CheckCircle,
  Edit2,
  Trash2,
  Plus,
  User,
  Clock,
  GraduationCap,
  Briefcase,
  Target,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  PersonalProfile,
  DailyRoutine,
  EducationLearning,
  ProfessionalDevelopment,
  GoalItem,
  SubjectItem,
  CourseItem,
  SkillItem,
  ProjectItem,
} from '../../types';
import { M3Button, M3Card, M3Chip, M3TextField, M3Dialog } from '../common/MaterialComponents';

interface DataReviewScreenProps {
  profile: PersonalProfile;
  routine: DailyRoutine;
  education: EducationLearning;
  professional: ProfessionalDevelopment;
  goals: GoalItem[];
  onUpdateProfile: (p: PersonalProfile) => void;
  onUpdateRoutine: (r: DailyRoutine) => void;
  onUpdateEducation: (e: EducationLearning) => void;
  onUpdateProfessional: (pr: ProfessionalDevelopment) => void;
  onUpdateGoals: (g: GoalItem[]) => void;
  onConfirmAndGenerateDashboard: () => void;
  onGoBackToStep: (step: number) => void;
}

export const DataReviewScreen: React.FC<DataReviewScreenProps> = ({
  profile,
  routine,
  education,
  professional,
  goals,
  onUpdateProfile,
  onUpdateRoutine,
  onUpdateEducation,
  onUpdateProfessional,
  onUpdateGoals,
  onConfirmAndGenerateDashboard,
  onGoBackToStep,
}) => {
  // Quick inline add modals / dialogs
  const [activeModal, setActiveModal] = useState<
    'addSubject' | 'addCourse' | 'addSkill' | 'addProject' | 'addGoal' | null
  >(null);

  // Quick inputs
  const [tempText1, setTempText1] = useState('');
  const [tempText2, setTempText2] = useState('');
  const [tempText3, setTempText3] = useState('');

  // Handle deletions
  const handleDeleteSubject = (id: string) => {
    onUpdateEducation({
      ...education,
      subjects: education.subjects.filter((s) => s.id !== id),
    });
  };

  const handleDeleteCourse = (id: string) => {
    onUpdateEducation({
      ...education,
      courses: education.courses.filter((c) => c.id !== id),
    });
  };

  const handleDeleteSkill = (id: string) => {
    onUpdateEducation({
      ...education,
      skills: education.skills.filter((sk) => sk.id !== id),
    });
  };

  const handleDeleteProject = (id: string) => {
    onUpdateProfessional({
      ...professional,
      projects: professional.projects.filter((p) => p.id !== id),
    });
  };

  const handleDeleteGoal = (id: string) => {
    onUpdateGoals(goals.filter((g) => g.id !== id));
  };

  const handleQuickAdd = () => {
    if (!tempText1.trim()) return;

    if (activeModal === 'addSubject') {
      const newSub: SubjectItem = {
        id: `subj_${Date.now()}`,
        name: tempText1.trim(),
        code: tempText2.trim() || undefined,
        credits: tempText3.trim() || undefined,
      };
      onUpdateEducation({
        ...education,
        subjects: [...education.subjects, newSub],
      });
    } else if (activeModal === 'addCourse') {
      const newCourse: CourseItem = {
        id: `course_${Date.now()}`,
        title: tempText1.trim(),
        platform: tempText2.trim() || 'Online',
      };
      onUpdateEducation({
        ...education,
        courses: [...education.courses, newCourse],
      });
    } else if (activeModal === 'addSkill') {
      const newSkill: SkillItem = {
        id: `skill_${Date.now()}`,
        name: tempText1.trim(),
        currentLevel: 'Beginner',
        targetLevel: 'Advanced',
      };
      onUpdateEducation({
        ...education,
        skills: [...education.skills, newSkill],
      });
    } else if (activeModal === 'addProject') {
      const newProj: ProjectItem = {
        id: `proj_${Date.now()}`,
        title: tempText1.trim(),
        description: tempText2.trim(),
        techStack: tempText3.trim() || undefined,
        status: 'In Progress',
      };
      onUpdateProfessional({
        ...professional,
        projects: [...professional.projects, newProj],
      });
    } else if (activeModal === 'addGoal') {
      const newGoal: GoalItem = {
        id: `goal_${Date.now()}`,
        title: tempText1.trim(),
        category: (tempText2 as any) || 'General',
        isCompleted: false,
        progressPercentage: 0,
      };
      onUpdateGoals([...goals, newGoal]);
    }

    setActiveModal(null);
    setTempText1('');
    setTempText2('');
    setTempText3('');
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto space-y-5 animate-fadeIn">
      {/* Review Header */}
      <div className="bg-[#EADDFF]/50 dark:bg-[#4F378B]/40 rounded-3xl p-4 border border-[#6750A4]/20 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6750A4] text-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1D1B20] dark:text-[#E6E0E9]">
              Review Your Life Information
            </h2>
            <p className="text-xs text-[#49454F] dark:text-[#CAC4D0] mt-0.5">
              Verify all entered details. You can edit, delete, or add entries below before generating your personalized dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Personal Profile Review */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#CAC4D0]/30 pb-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#6750A4] dark:text-[#D0BCFF]">
            <User size={16} />
            <span>1. Personal Profile</span>
          </div>
          <button
            onClick={() => onGoBackToStep(1)}
            className="flex items-center gap-1 text-xs text-[#6750A4] dark:text-[#D0BCFF] hover:underline cursor-pointer"
          >
            <Edit2 size={12} /> Edit Step 1
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500 block">Full Name</span>
            <span className="font-semibold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
              {profile.fullName || '(Not provided)'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Education</span>
            <span className="font-medium text-[#1D1B20] dark:text-[#E6E0E9]">
              {profile.education || '—'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Degree / Major</span>
            <span className="font-medium text-[#1D1B20] dark:text-[#E6E0E9]">
              {profile.currentDegree || '—'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Current Semester</span>
            <span className="font-medium text-[#1D1B20] dark:text-[#E6E0E9]">
              {profile.currentSemester || '—'}
            </span>
          </div>
        </div>

        {profile.professionalBackground && (
          <div className="text-xs bg-[#FEF7FF] dark:bg-[#141218] p-2.5 rounded-xl border border-[#CAC4D0]/30">
            <span className="text-gray-500 block text-[11px] mb-0.5">Professional Background:</span>
            <span>{profile.professionalBackground}</span>
          </div>
        )}

        {profile.interests.length > 0 && (
          <div>
            <span className="text-[11px] text-gray-500 block mb-1.5">Interests:</span>
            <div className="flex flex-wrap gap-1">
              {profile.interests.map((it) => (
                <span
                  key={it}
                  className="px-2.5 py-0.5 rounded-full bg-[#E8DEF8] dark:bg-[#4A4458] text-[11px] font-medium"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        )}
      </M3Card>

      {/* SECTION 2: Daily Routine Review */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#CAC4D0]/30 pb-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#6750A4] dark:text-[#D0BCFF]">
            <Clock size={16} />
            <span>2. Daily Routine</span>
          </div>
          <button
            onClick={() => onGoBackToStep(2)}
            className="flex items-center gap-1 text-xs text-[#6750A4] dark:text-[#D0BCFF] hover:underline cursor-pointer"
          >
            <Edit2 size={12} /> Edit Step 2
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
            <span className="text-gray-500 block">Wake-up Time</span>
            <span className="font-bold text-[#6750A4] dark:text-[#D0BCFF] text-sm">
              {routine.wakeUpTime}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
            <span className="text-gray-500 block">Sleep Time</span>
            <span className="font-bold text-[#6750A4] dark:text-[#D0BCFF] text-sm">
              {routine.sleepTime}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 col-span-2 sm:col-span-1">
            <span className="text-gray-500 block">Personal Dev</span>
            <span className="font-bold text-[#6750A4] dark:text-[#D0BCFF] text-sm">
              {routine.personalDevHours} hrs/day
            </span>
          </div>
        </div>

        {(routine.studySchedule || routine.workSchedule) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {routine.studySchedule && (
              <div className="p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
                <span className="text-gray-500 block font-medium">Study Schedule:</span>
                <span>{routine.studySchedule}</span>
              </div>
            )}
            {routine.workSchedule && (
              <div className="p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
                <span className="text-gray-500 block font-medium">Work Schedule:</span>
                <span>{routine.workSchedule}</span>
              </div>
            )}
          </div>
        )}

        {routine.otherResponsibilities.length > 0 && (
          <div className="text-xs">
            <span className="text-gray-500 block mb-1">Responsibilities:</span>
            <ul className="list-disc list-inside space-y-0.5 text-gray-700 dark:text-gray-300">
              {routine.otherResponsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </M3Card>

      {/* SECTION 3: Education & Learning Review */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#CAC4D0]/30 pb-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#6750A4] dark:text-[#D0BCFF]">
            <GraduationCap size={16} />
            <span>3. Education & Learning ({education.subjects.length} subjects, {education.courses.length} courses)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('addSubject')}
              className="text-xs flex items-center gap-1 text-[#6750A4] font-medium hover:underline"
            >
              <Plus size={13} /> Add Subject
            </button>
            <button
              onClick={() => onGoBackToStep(3)}
              className="flex items-center gap-1 text-xs text-[#6750A4] dark:text-[#D0BCFF] hover:underline cursor-pointer"
            >
              <Edit2 size={12} /> Edit
            </button>
          </div>
        </div>

        {/* Subjects list */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Current Academic Subjects:
          </span>
          {education.subjects.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/30"
            >
              <div>
                <span className="font-semibold">{sub.name}</span>
                {sub.code && <span className="ml-1.5 text-gray-500">[{sub.code}]</span>}
                {sub.credits && <span className="ml-1.5 text-gray-500">({sub.credits} cr)</span>}
              </div>
              <button
                onClick={() => handleDeleteSubject(sub.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete Subject"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {education.subjects.length === 0 && (
            <p className="text-xs text-gray-400 italic">No academic subjects entered.</p>
          )}
        </div>

        {/* Courses list */}
        {education.courses.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-[#CAC4D0]/20">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Enrolled Online Courses:
            </span>
            {education.courses.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/30"
              >
                <div>
                  <span className="font-medium">{c.title}</span>
                  <span className="ml-2 text-xs text-[#6750A4] dark:text-[#D0BCFF]">
                    ({c.platform})
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCourse(c.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Skills list */}
        {education.skills.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-[#CAC4D0]/20">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Skills Being Developed:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {education.skills.map((sk) => (
                <span
                  key={sk.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#ECE6F0] dark:bg-[#2B2930] text-xs font-medium"
                >
                  <span>{sk.name}</span>
                  <span className="text-[10px] text-[#6750A4] dark:text-[#D0BCFF]">
                    {sk.currentLevel} → {sk.targetLevel}
                  </span>
                  <button
                    onClick={() => handleDeleteSkill(sk.id)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {(education.dailyLearningTarget || education.weeklyLearningTarget) && (
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {education.dailyLearningTarget && (
              <div className="p-2 rounded-xl bg-[#ECE6F0] dark:bg-[#2B2930]">
                <span className="text-gray-500 block text-[10px]">Daily Target</span>
                <span className="font-semibold">{education.dailyLearningTarget}</span>
              </div>
            )}
            {education.weeklyLearningTarget && (
              <div className="p-2 rounded-xl bg-[#ECE6F0] dark:bg-[#2B2930]">
                <span className="text-gray-500 block text-[10px]">Weekly Target</span>
                <span className="font-semibold">{education.weeklyLearningTarget}</span>
              </div>
            )}
          </div>
        )}
      </M3Card>

      {/* SECTION 4: Professional Development Review */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#CAC4D0]/30 pb-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#6750A4] dark:text-[#D0BCFF]">
            <Briefcase size={16} />
            <span>4. Professional Development ({professional.projects.length} projects)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('addProject')}
              className="text-xs flex items-center gap-1 text-[#6750A4] font-medium hover:underline"
            >
              <Plus size={13} /> Add Project
            </button>
            <button
              onClick={() => onGoBackToStep(4)}
              className="flex items-center gap-1 text-xs text-[#6750A4] dark:text-[#D0BCFF] hover:underline cursor-pointer"
            >
              <Edit2 size={12} /> Edit
            </button>
          </div>
        </div>

        {professional.careerObjectives && (
          <div className="text-xs p-2.5 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30">
            <span className="text-gray-500 block text-[11px] mb-0.5">Career Objective:</span>
            <span className="font-medium">{professional.careerObjectives}</span>
          </div>
        )}

        {professional.technicalSkills.length > 0 && (
          <div>
            <span className="text-[11px] text-gray-500 block mb-1">Technical Skills:</span>
            <div className="flex flex-wrap gap-1">
              {professional.technicalSkills.map((sk) => (
                <span
                  key={sk}
                  className="px-2 py-0.5 rounded-lg bg-[#ECE6F0] dark:bg-[#2B2930] text-xs font-medium"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Active Projects:
          </span>
          {professional.projects.map((proj) => (
            <div
              key={proj.id}
              className="p-2.5 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/30 flex items-start justify-between"
            >
              <div>
                <span className="font-bold text-sm">{proj.title}</span>
                <p className="text-gray-500 text-xs mt-0.5">{proj.description}</p>
                {proj.techStack && (
                  <span className="text-[11px] text-[#6750A4] dark:text-[#D0BCFF] block mt-1">
                    Stack: {proj.techStack}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteProject(proj.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {professional.projects.length === 0 && (
            <p className="text-xs text-gray-400 italic">No projects added yet.</p>
          )}
        </div>
      </M3Card>

      {/* SECTION 5: Goals Review */}
      <M3Card variant="elevated" className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#CAC4D0]/30 pb-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#6750A4] dark:text-[#D0BCFF]">
            <Target size={16} />
            <span>5. Goals & Aspirations ({goals.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('addGoal')}
              className="text-xs flex items-center gap-1 text-[#6750A4] font-medium hover:underline"
            >
              <Plus size={13} /> Add Goal
            </button>
            <button
              onClick={() => onGoBackToStep(5)}
              className="flex items-center gap-1 text-xs text-[#6750A4] dark:text-[#D0BCFF] hover:underline cursor-pointer"
            >
              <Edit2 size={12} /> Edit
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-2.5 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/30 flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-sm">{g.title}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#EADDFF] text-[#21005D] text-[10px] font-bold">
                    {g.category}
                  </span>
                  {g.targetDate && (
                    <span className="text-gray-500 text-[10px]">Target: {g.targetDate}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteGoal(g.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-xs text-gray-400 italic">No goals added yet.</p>
          )}
        </div>
      </M3Card>

      {/* FINAL CONFIRMATION ACTION (Gatekeeper to Phase 3) */}
      <div className="pt-3 pb-6 flex flex-col items-center gap-3">
        <M3Button
          variant="filled"
          size="lg"
          onClick={onConfirmAndGenerateDashboard}
          icon={<Sparkles size={20} />}
          className="w-full sm:w-auto text-base shadow-lg hover:shadow-xl py-3 px-8"
        >
          Confirm & Generate My Life Dashboard
        </M3Button>
        <span className="text-xs text-gray-500 text-center flex items-center gap-1.5">
          <CheckCircle size={14} className="text-emerald-500" />
          Data will be saved into local Room Database and preserved across sessions.
        </span>
      </div>

      {/* Quick Add Dialog */}
      <M3Dialog
        isOpen={Boolean(activeModal)}
        title={
          activeModal === 'addSubject'
            ? 'Add Academic Subject'
            : activeModal === 'addCourse'
            ? 'Add Course / Certification'
            : activeModal === 'addSkill'
            ? 'Add Skill'
            : activeModal === 'addProject'
            ? 'Add Project'
            : 'Add Life Goal'
        }
        onClose={() => setActiveModal(null)}
        confirmLabel="Save Entry"
        onConfirm={handleQuickAdd}
      >
        <div className="space-y-3 pt-2">
          <M3TextField
            label={
              activeModal === 'addSubject'
                ? 'Subject Name *'
                : activeModal === 'addCourse'
                ? 'Course Title *'
                : activeModal === 'addSkill'
                ? 'Skill Name *'
                : activeModal === 'addProject'
                ? 'Project Title *'
                : 'Goal Description *'
            }
            value={tempText1}
            onChange={(e) => setTempText1(e.target.value)}
          />

          {activeModal === 'addSubject' && (
            <div className="grid grid-cols-2 gap-2">
              <M3TextField
                label="Course Code"
                value={tempText2}
                onChange={(e) => setTempText2(e.target.value)}
              />
              <M3TextField
                label="Credits"
                value={tempText3}
                onChange={(e) => setTempText3(e.target.value)}
              />
            </div>
          )}

          {activeModal === 'addCourse' && (
            <M3TextField
              label="Platform (e.g. Coursera)"
              value={tempText2}
              onChange={(e) => setTempText2(e.target.value)}
            />
          )}

          {activeModal === 'addProject' && (
            <>
              <M3TextField
                label="Project Description"
                multiline
                rows={2}
                value={tempText2}
                onChange={(e) => setTempText2(e.target.value)}
              />
              <M3TextField
                label="Tech Stack / Repo"
                value={tempText3}
                onChange={(e) => setTempText3(e.target.value)}
              />
            </>
          )}

          {activeModal === 'addGoal' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold">Category</label>
              <select
                value={tempText2 || 'Short-term'}
                onChange={(e) => setTempText2(e.target.value)}
                className="w-full bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
              >
                <option value="Short-term">Short-term Goal</option>
                <option value="Long-term">Long-term Goal</option>
                <option value="Educational">Educational Goal</option>
                <option value="Career">Career Goal</option>
                <option value="Personal Development">Personal Development</option>
              </select>
            </div>
          )}
        </div>
      </M3Dialog>
    </div>
  );
};
