import React, { useState } from 'react';
import {
  User,
  Clock,
  GraduationCap,
  Briefcase,
  Target,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
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
  SkillLevel,
  GoalCategory,
} from '../../types';
import {
  M3Button,
  M3Card,
  M3TextField,
  M3Chip,
  M3LinearProgress,
} from '../common/MaterialComponents';

interface OnboardingFlowProps {
  initialProfile: PersonalProfile;
  initialRoutine: DailyRoutine;
  initialEducation: EducationLearning;
  initialProfessional: ProfessionalDevelopment;
  initialGoals: GoalItem[];
  onComplete: (data: {
    profile: PersonalProfile;
    routine: DailyRoutine;
    education: EducationLearning;
    professional: ProfessionalDevelopment;
    goals: GoalItem[];
  }) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  initialRoutine,
  initialEducation,
  initialProfessional,
  initialGoals,
  onComplete,
  currentStep,
  setCurrentStep,
}) => {
  // Step 1: Profile State
  const [profile, setProfile] = useState<PersonalProfile>(initialProfile);
  const [interestInput, setInterestInput] = useState('');

  // Step 2: Routine State
  const [routine, setRoutine] = useState<DailyRoutine>(initialRoutine);
  const [respInput, setRespInput] = useState('');

  // Step 3: Education & Learning State
  const [education, setEducation] = useState<EducationLearning>(initialEducation);
  // New Subject form
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjCredits, setNewSubjCredits] = useState('');
  // New Course form
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCoursePlatform, setNewCoursePlatform] = useState('');
  // New Skill form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCurr, setNewSkillCurr] = useState<SkillLevel>('Beginner');
  const [newSkillTarg, setNewSkillTarg] = useState<SkillLevel>('Advanced');

  // Step 4: Professional Development State
  const [professional, setProfessional] = useState<ProfessionalDevelopment>(initialProfessional);
  const [techSkillInput, setTechSkillInput] = useState('');
  const [bizInterestInput, setBizInterestInput] = useState('');
  const [profRespInput, setProfRespInput] = useState('');
  // New Project form
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('');

  // Step 5: Goals State
  const [goals, setGoals] = useState<GoalItem[]>(initialGoals);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<GoalCategory>('Short-term');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!profile.fullName.trim()) newErrors.fullName = 'Please enter your full name.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all 5 steps -> proceed to Phase 2: Review
      onComplete({
        profile,
        routine,
        education,
        professional,
        goals,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Profile Helpers
  const addInterest = () => {
    if (interestInput.trim() && !profile.interests.includes(interestInput.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, interestInput.trim()],
      });
      setInterestInput('');
    }
  };

  const removeInterest = (item: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter((i) => i !== item),
    });
  };

  // Routine Helpers
  const addResponsibility = () => {
    if (respInput.trim()) {
      setRoutine({
        ...routine,
        otherResponsibilities: [...routine.otherResponsibilities, respInput.trim()],
      });
      setRespInput('');
    }
  };

  const removeResponsibility = (idx: number) => {
    setRoutine({
      ...routine,
      otherResponsibilities: routine.otherResponsibilities.filter((_, i) => i !== idx),
    });
  };

  // Education Helpers
  const addSubject = () => {
    if (newSubjName.trim()) {
      const item: SubjectItem = {
        id: `subj_${Date.now()}`,
        name: newSubjName.trim(),
        code: newSubjCode.trim() || undefined,
        credits: newSubjCredits.trim() || undefined,
      };
      setEducation({ ...education, subjects: [...education.subjects, item] });
      setNewSubjName('');
      setNewSubjCode('');
      setNewSubjCredits('');
    }
  };

  const removeSubject = (id: string) => {
    setEducation({ ...education, subjects: education.subjects.filter((s) => s.id !== id) });
  };

  const addCourse = () => {
    if (newCourseTitle.trim()) {
      const item: CourseItem = {
        id: `course_${Date.now()}`,
        title: newCourseTitle.trim(),
        platform: newCoursePlatform.trim() || 'Self-paced',
      };
      setEducation({ ...education, courses: [...education.courses, item] });
      setNewCourseTitle('');
      setNewCoursePlatform('');
    }
  };

  const removeCourse = (id: string) => {
    setEducation({ ...education, courses: education.courses.filter((c) => c.id !== id) });
  };

  const addSkill = () => {
    if (newSkillName.trim()) {
      const item: SkillItem = {
        id: `skill_${Date.now()}`,
        name: newSkillName.trim(),
        currentLevel: newSkillCurr,
        targetLevel: newSkillTarg,
      };
      setEducation({ ...education, skills: [...education.skills, item] });
      setNewSkillName('');
    }
  };

  const removeSkill = (id: string) => {
    setEducation({ ...education, skills: education.skills.filter((s) => s.id !== id) });
  };

  // Professional Helpers
  const addTechSkill = () => {
    if (techSkillInput.trim() && !professional.technicalSkills.includes(techSkillInput.trim())) {
      setProfessional({
        ...professional,
        technicalSkills: [...professional.technicalSkills, techSkillInput.trim()],
      });
      setTechSkillInput('');
    }
  };

  const removeTechSkill = (skill: string) => {
    setProfessional({
      ...professional,
      technicalSkills: professional.technicalSkills.filter((s) => s !== skill),
    });
  };

  const addBizInterest = () => {
    if (bizInterestInput.trim() && !professional.businessInterests.includes(bizInterestInput.trim())) {
      setProfessional({
        ...professional,
        businessInterests: [...professional.businessInterests, bizInterestInput.trim()],
      });
      setBizInterestInput('');
    }
  };

  const removeBizInterest = (item: string) => {
    setProfessional({
      ...professional,
      businessInterests: professional.businessInterests.filter((b) => b !== item),
    });
  };

  const addProfResp = () => {
    if (profRespInput.trim()) {
      setProfessional({
        ...professional,
        professionalResponsibilities: [...professional.professionalResponsibilities, profRespInput.trim()],
      });
      setProfRespInput('');
    }
  };

  const removeProfResp = (idx: number) => {
    setProfessional({
      ...professional,
      professionalResponsibilities: professional.professionalResponsibilities.filter((_, i) => i !== idx),
    });
  };

  const addProject = () => {
    if (newProjTitle.trim()) {
      const proj: ProjectItem = {
        id: `proj_${Date.now()}`,
        title: newProjTitle.trim(),
        description: newProjDesc.trim(),
        techStack: newProjTech.trim() || undefined,
        status: 'In Progress',
      };
      setProfessional({
        ...professional,
        projects: [...professional.projects, proj],
      });
      setNewProjTitle('');
      setNewProjDesc('');
      setNewProjTech('');
    }
  };

  const removeProject = (id: string) => {
    setProfessional({
      ...professional,
      projects: professional.projects.filter((p) => p.id !== id),
    });
  };

  // Goals Helpers
  const handleAddGoal = () => {
    if (newGoalTitle.trim()) {
      const goal: GoalItem = {
        id: `goal_${Date.now()}`,
        title: newGoalTitle.trim(),
        category: newGoalCategory,
        targetDate: newGoalTargetDate || undefined,
        isCompleted: false,
        progressPercentage: 0,
      };
      setGoals([...goals, goal]);
      setNewGoalTitle('');
      setNewGoalTargetDate('');
    }
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const stepTitles = [
    'Personal Profile',
    'Daily Routine',
    'Education & Learning',
    'Professional Career',
    'Goals & Aspirations',
  ];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
      {/* Onboarding Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EADDFF] dark:bg-[#4F378B] flex items-center justify-center text-[#21005D] dark:text-[#EADDFF]">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6750A4] dark:text-[#D0BCFF]">
                Step {currentStep} of 5
              </span>
              <h2 className="text-lg font-bold text-[#1D1B20] dark:text-[#E6E0E9]">
                {stepTitles[currentStep - 1]}
              </h2>
            </div>
          </div>
          <span className="text-xs text-[#79747E] dark:text-[#CAC4D0] font-medium">
            {Math.round((currentStep / 5) * 100)}%
          </span>
        </div>
        <M3LinearProgress progress={(currentStep / 5) * 100} />
      </div>

      {/* Step Content */}
      <div className="flex-1 space-y-4">
        {/* STEP 1: Personal Profile */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <M3Card variant="elevated" className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#6750A4] dark:text-[#D0BCFF] mb-1">
                <User size={16} />
                <span>Identity & Academics</span>
              </div>

              <M3TextField
                label="Full Name *"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                error={errors.fullName}
                placeholder="e.g. Alex Henderson"
              />

              <M3TextField
                label="Education Level"
                value={profile.education}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                placeholder="e.g. Undergraduate, Bachelor of Science, Masters"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <M3TextField
                  label="Current Degree / Major"
                  value={profile.currentDegree}
                  onChange={(e) => setProfile({ ...profile, currentDegree: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
                <M3TextField
                  label="Current Semester / Year"
                  value={profile.currentSemester}
                  onChange={(e) => setProfile({ ...profile, currentSemester: e.target.value })}
                  placeholder="e.g. Semester 5, Senior Year"
                />
              </div>

              <M3TextField
                label="Professional Background"
                multiline
                rows={2}
                value={profile.professionalBackground}
                onChange={(e) => setProfile({ ...profile, professionalBackground: e.target.value })}
                placeholder="Brief summary of your field, experience, or aspirations..."
              />
            </M3Card>

            <M3Card variant="filled" className="space-y-3">
              <div className="text-sm font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                Personal Interests & Hobbies
              </div>
              <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
                Add topics, books, fitness, design, writing, or things you enjoy.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  placeholder="Add an interest tag (e.g. AI Research, Cycling)"
                  className="flex-1 bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0] dark:border-[#49454F] rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
                <M3Button variant="tonal" size="sm" onClick={addInterest} icon={<Plus size={14} />}>
                  Add
                </M3Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.interests.map((interest) => (
                  <M3Chip
                    key={interest}
                    label={interest}
                    onDelete={() => removeInterest(interest)}
                  />
                ))}
                {profile.interests.length === 0 && (
                  <span className="text-xs text-gray-400 italic">No interests added yet.</span>
                )}
              </div>
            </M3Card>
          </div>
        )}

        {/* STEP 2: Daily Routine */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <M3Card variant="elevated" className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#6750A4] dark:text-[#D0BCFF] mb-1">
                <Clock size={16} />
                <span>Sleep & Core Schedules</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <M3TextField
                  label="Wake-Up Time"
                  type="time"
                  value={routine.wakeUpTime}
                  onChange={(e) => setRoutine({ ...routine, wakeUpTime: e.target.value })}
                />
                <M3TextField
                  label="Sleep Time"
                  type="time"
                  value={routine.sleepTime}
                  onChange={(e) => setRoutine({ ...routine, sleepTime: e.target.value })}
                />
              </div>

              <M3TextField
                label="Study Schedule"
                value={routine.studySchedule}
                onChange={(e) => setRoutine({ ...routine, studySchedule: e.target.value })}
                placeholder="e.g. 09:00 - 12:00, 16:00 - 18:30"
                supportingText="Your dedicated daily or weekly study block"
              />

              <M3TextField
                label="Work / Office Schedule"
                value={routine.workSchedule}
                onChange={(e) => setRoutine({ ...routine, workSchedule: e.target.value })}
                placeholder="e.g. 13:00 - 17:00 or Flexible Freelance"
              />

              <M3TextField
                label="Personal Development Hours / Day"
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={routine.personalDevHours}
                onChange={(e) =>
                  setRoutine({ ...routine, personalDevHours: parseFloat(e.target.value) || 0 })
                }
                supportingText="Hours committed to reading, workouts, meditation, or skills"
              />
            </M3Card>

            <M3Card variant="filled" className="space-y-3">
              <div className="text-sm font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                Other Daily Responsibilities
              </div>
              <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
                Family duties, gym, household, meetings, community tasks.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={respInput}
                  onChange={(e) => setRespInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                  placeholder="e.g. Gym workout at 18:00, Meal prep"
                  className="flex-1 bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0] dark:border-[#49454F] rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
                <M3Button variant="tonal" size="sm" onClick={addResponsibility} icon={<Plus size={14} />}>
                  Add
                </M3Button>
              </div>

              <div className="space-y-1.5 pt-1">
                {routine.otherResponsibilities.map((resp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/40"
                  >
                    <span>{resp}</span>
                    <button
                      onClick={() => removeResponsibility(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {routine.otherResponsibilities.length === 0 && (
                  <span className="text-xs text-gray-400 italic">No custom responsibilities entered.</span>
                )}
              </div>
            </M3Card>
          </div>
        )}

        {/* STEP 3: Education and Learning */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            {/* Subjects */}
            <M3Card variant="elevated" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#6750A4] dark:text-[#D0BCFF]">
                  <GraduationCap size={16} />
                  <span>Subjects You Study</span>
                </div>
                <span className="text-xs text-gray-500">{education.subjects.length} added</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  placeholder="Subject Name (e.g. Algorithms)"
                  className="bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
                />
                <input
                  type="text"
                  value={newSubjCode}
                  onChange={(e) => setNewSubjCode(e.target.value)}
                  placeholder="Course Code (e.g. CS301)"
                  className="bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newSubjCredits}
                    onChange={(e) => setNewSubjCredits(e.target.value)}
                    placeholder="Credits (e.g. 4)"
                    className="flex-1 bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
                  />
                  <M3Button variant="tonal" size="sm" onClick={addSubject}>
                    Add
                  </M3Button>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {education.subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/40"
                  >
                    <div>
                      <span className="font-semibold">{sub.name}</span>
                      {sub.code && <span className="ml-2 text-gray-500">[{sub.code}]</span>}
                      {sub.credits && <span className="ml-2 text-gray-500">({sub.credits} cr)</span>}
                    </div>
                    <button
                      onClick={() => removeSubject(sub.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </M3Card>

            {/* Courses */}
            <M3Card variant="filled" className="space-y-3">
              <div className="text-sm font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                Online Courses & Certifications
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="Course Title (e.g. Machine Learning)"
                  className="bg-[#FEF7FF] dark:bg-[#141218] rounded-xl px-3 py-2 text-xs border border-[#CAC4D0] focus:outline-none"
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newCoursePlatform}
                    onChange={(e) => setNewCoursePlatform(e.target.value)}
                    placeholder="Platform (Coursera, Udemy, YouTube)"
                    className="flex-1 bg-[#FEF7FF] dark:bg-[#141218] rounded-xl px-3 py-2 text-xs border border-[#CAC4D0] focus:outline-none"
                  />
                  <M3Button variant="tonal" size="sm" onClick={addCourse}>
                    Add
                  </M3Button>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {education.courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/40"
                  >
                    <div>
                      <span className="font-medium">{course.title}</span>
                      <span className="ml-2 text-xs text-[#6750A4] dark:text-[#D0BCFF]">
                        • {course.platform}
                      </span>
                    </div>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </M3Card>

            {/* Skills & Targets */}
            <M3Card variant="elevated" className="space-y-3">
              <div className="text-sm font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                Skills & Learning Targets
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill (e.g. Kotlin Jetpack Compose)"
                  className="bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
                />
                <select
                  value={newSkillCurr}
                  onChange={(e) => setNewSkillCurr(e.target.value as SkillLevel)}
                  className="bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-2 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
                >
                  <option value="Beginner">Level: Beginner</option>
                  <option value="Intermediate">Level: Intermediate</option>
                  <option value="Advanced">Level: Advanced</option>
                </select>
                <div className="flex gap-1.5">
                  <select
                    value={newSkillTarg}
                    onChange={(e) => setNewSkillTarg(e.target.value as SkillLevel)}
                    className="flex-1 bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-2 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
                  >
                    <option value="Intermediate">Goal: Intermediate</option>
                    <option value="Advanced">Goal: Advanced</option>
                    <option value="Expert">Goal: Expert</option>
                  </select>
                  <M3Button variant="tonal" size="sm" onClick={addSkill}>
                    Add
                  </M3Button>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {education.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/40"
                  >
                    <div>
                      <span className="font-semibold">{skill.name}</span>
                      <span className="ml-2 text-gray-500">
                        {skill.currentLevel} → <strong className="text-[#6750A4]">{skill.targetLevel}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <M3TextField
                  label="Daily Learning Target"
                  value={education.dailyLearningTarget}
                  onChange={(e) => setEducation({ ...education, dailyLearningTarget: e.target.value })}
                  placeholder="e.g. 2 hours or 1 module"
                />
                <M3TextField
                  label="Weekly Learning Target"
                  value={education.weeklyLearningTarget}
                  onChange={(e) => setEducation({ ...education, weeklyLearningTarget: e.target.value })}
                  placeholder="e.g. Complete 1 project chapter"
                />
              </div>
            </M3Card>
          </div>
        )}

        {/* STEP 4: Professional Development */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <M3Card variant="elevated" className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#6750A4] dark:text-[#D0BCFF] mb-1">
                <Briefcase size={16} />
                <span>Career Objectives & Skills</span>
              </div>

              <M3TextField
                label="Career Objectives"
                multiline
                rows={2}
                value={professional.careerObjectives}
                onChange={(e) =>
                  setProfessional({ ...professional, careerObjectives: e.target.value })
                }
                placeholder="e.g. Become a Senior Mobile Architect and launch my own venture..."
              />

              {/* Technical Skills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                  Technical Skills
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techSkillInput}
                    onChange={(e) => setTechSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechSkill())}
                    placeholder="e.g. TypeScript, React, Kotlin, SQL"
                    className="flex-1 bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                  <M3Button variant="tonal" size="sm" onClick={addTechSkill}>
                    Add
                  </M3Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {professional.technicalSkills.map((sk) => (
                    <M3Chip key={sk} label={sk} onDelete={() => removeTechSkill(sk)} />
                  ))}
                </div>
              </div>

              {/* Business Interests */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                  Business & Industry Interests
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bizInterestInput}
                    onChange={(e) => setBizInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBizInterest())}
                    placeholder="e.g. EdTech, SaaS, FinTech, Automation"
                    className="flex-1 bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                  <M3Button variant="tonal" size="sm" onClick={addBizInterest}>
                    Add
                  </M3Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {professional.businessInterests.map((bi) => (
                    <M3Chip key={bi} label={bi} onDelete={() => removeBizInterest(bi)} />
                  ))}
                </div>
              </div>
            </M3Card>

            {/* Current Projects */}
            <M3Card variant="filled" className="space-y-3">
              <div className="text-sm font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                Active Projects & Portfolios
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="Project Title (e.g. Life Manager App)"
                  className="w-full bg-[#FEF7FF] dark:bg-[#141218] rounded-xl px-3 py-2 text-xs border border-[#CAC4D0] focus:outline-none"
                />
                <input
                  type="text"
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Description & Goal"
                  className="w-full bg-[#FEF7FF] dark:bg-[#141218] rounded-xl px-3 py-2 text-xs border border-[#CAC4D0] focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProjTech}
                    onChange={(e) => setNewProjTech(e.target.value)}
                    placeholder="Tech Stack / Link"
                    className="flex-1 bg-[#FEF7FF] dark:bg-[#141218] rounded-xl px-3 py-2 text-xs border border-[#CAC4D0] focus:outline-none"
                  />
                  <M3Button variant="tonal" size="sm" onClick={addProject}>
                    Add Project
                  </M3Button>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {professional.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/40 flex items-start justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm text-[#1D1B20] dark:text-[#E6E0E9]">
                        {proj.title}
                      </div>
                      <p className="text-gray-500 mt-0.5">{proj.description}</p>
                      {proj.techStack && (
                        <span className="inline-block mt-1 text-[11px] font-medium text-[#6750A4] dark:text-[#D0BCFF]">
                          Stack: {proj.techStack}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Professional responsibilities */}
              <div className="pt-2 border-t border-[#CAC4D0]/30 space-y-2">
                <label className="text-xs font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                  Professional Responsibilities & Roles
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profRespInput}
                    onChange={(e) => setProfRespInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProfResp())}
                    placeholder="e.g. Lead Sprint Reviews, Mentor Juniors"
                    className="flex-1 bg-[#FEF7FF] dark:bg-[#141218] rounded-xl px-3 py-2 text-xs border border-[#CAC4D0] focus:outline-none"
                  />
                  <M3Button variant="tonal" size="sm" onClick={addProfResp}>
                    Add
                  </M3Button>
                </div>
                <div className="space-y-1">
                  {professional.professionalResponsibilities.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/40"
                    >
                      <span>{r}</span>
                      <button
                        onClick={() => removeProfResp(i)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </M3Card>
          </div>
        )}

        {/* STEP 5: Goals */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <M3Card variant="elevated" className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#6750A4] dark:text-[#D0BCFF] mb-1">
                <Target size={16} />
                <span>Set Your Core Life Goals</span>
              </div>
              <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
                Add short-term, long-term, educational, career, and personal goals.
              </p>

              <div className="space-y-2">
                <M3TextField
                  label="Goal Description"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Score GPA 3.8+ / Land Senior Developer Role"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                      Category
                    </label>
                    <select
                      value={newGoalCategory}
                      onChange={(e) => setNewGoalCategory(e.target.value as GoalCategory)}
                      className="w-full bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
                    >
                      <option value="Short-term">Short-term Goal</option>
                      <option value="Long-term">Long-term Goal</option>
                      <option value="Educational">Educational Goal</option>
                      <option value="Career">Career Goal</option>
                      <option value="Personal Development">Personal Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                      Target Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newGoalTargetDate}
                      onChange={(e) => setNewGoalTargetDate(e.target.value)}
                      className="w-full bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <M3Button variant="tonal" onClick={handleAddGoal} icon={<Plus size={15} />}>
                    Add Goal
                  </M3Button>
                </div>
              </div>
            </M3Card>

            <M3Card variant="filled" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                  Added Goals ({goals.length})
                </span>
                {goals.length === 0 && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    Add at least 1 goal to track progress
                  </span>
                )}
              </div>

              <div className="space-y-2 pt-1 max-h-56 overflow-y-auto">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-2xl bg-[#FEF7FF] dark:bg-[#141218] text-xs border border-[#CAC4D0]/40 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
                        {g.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF] text-[10px] font-medium">
                          {g.category}
                        </span>
                        {g.targetDate && (
                          <span className="text-gray-500 text-[10px]">By {g.targetDate}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeGoal(g.id)}
                      className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </M3Card>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="pt-4 mt-auto border-t border-[#CAC4D0]/30 dark:border-[#49454F]/30 flex items-center justify-between">
        <M3Button
          variant="text"
          onClick={handleBack}
          disabled={currentStep === 1}
          icon={<ArrowLeft size={16} />}
        >
          Previous
        </M3Button>

        <M3Button
          variant="filled"
          onClick={handleNext}
          icon={currentStep === 5 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
        >
          {currentStep === 5 ? 'Review My Information' : 'Continue'}
        </M3Button>
      </div>
    </div>
  );
};
