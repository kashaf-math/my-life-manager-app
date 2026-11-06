import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { TaskItem, PriorityLevel } from '../../types';
import {
  M3Button,
  M3Card,
  M3CircularProgress,
  M3Dialog,
  M3TextField,
  M3Chip,
} from '../common/MaterialComponents';

interface TasksScreenProps {
  tasks: TaskItem[];
  categories: string[];
  totalTasksCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  dailyProgressPercentage: number;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onUpdateTask: (id: string, updates: Partial<TaskItem>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  categories,
  totalTasksCount,
  completedTasksCount,
  pendingTasksCount,
  dailyProgressPercentage,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form Fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState(categories[0] || 'Personal');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('Medium');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskCategory(categories[0] || 'Personal');
    setTaskPriority('Medium');
    setTaskDeadline('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) {
      setFormError('Task title is required.');
      return;
    }

    if (editingTaskId) {
      onUpdateTask(editingTaskId, {
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        category: taskCategory,
        priority: taskPriority,
        deadline: taskDeadline || undefined,
      });
    } else {
      onAddTask({
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        category: taskCategory,
        priority: taskPriority,
        deadline: taskDeadline || undefined,
      });
    }

    setIsModalOpen(false);
  };

  // Filtered Task List
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      // Status
      if (selectedStatus === 'Pending' && task.isCompleted) return false;
      if (selectedStatus === 'Completed' && !task.isCompleted) return false;

      // Category
      if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;

      // Priority
      if (selectedPriority !== 'All' && task.priority !== selectedPriority) return false;

      return true;
    });
  }, [tasks, searchQuery, selectedStatus, selectedCategory, selectedPriority]);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1D1B20] dark:text-[#E6E0E9]">
            Task Management
          </h1>
          <p className="text-xs text-[#49454F] dark:text-[#CAC4D0]">
            Organize, prioritize, and track your daily execution
          </p>
        </div>
        <M3Button variant="filled" size="sm" onClick={openAddModal} icon={<Plus size={16} />}>
          New Task
        </M3Button>
      </div>

      {/* Progress Metric Card: Exact Formula (Completed / Total) * 100 */}
      <M3Card variant="elevated" className="bg-[#ECE6F0] dark:bg-[#2B2930] flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6750A4] dark:text-[#D0BCFF]">
            Progress = (Completed / Total) × 100
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-[#1D1B20] dark:text-[#E6E0E9]">
              {dailyProgressPercentage}%
            </span>
            <span className="text-xs text-gray-500 font-medium">Completion</span>
          </div>

          <div className="flex items-center gap-3 pt-1 text-xs">
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">
              ✓ {completedTasksCount} Completed
            </span>
            <span className="text-amber-700 dark:text-amber-300 font-medium">
              ⏳ {pendingTasksCount} Pending
            </span>
            <span className="text-gray-500 font-medium">
              📊 {totalTasksCount} Total
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <M3CircularProgress progress={dailyProgressPercentage} size={74} strokeWidth={7} />
        </div>
      </M3Card>

      {/* Search & Filters */}
      <div className="space-y-2">
        {/* Search Bar */}
        <div className="relative flex items-center bg-[#ECE6F0] dark:bg-[#2B2930] rounded-2xl px-3 py-2 text-xs">
          <Search size={15} className="text-[#49454F] dark:text-[#CAC4D0] mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or details..."
            className="w-full bg-transparent text-[#1D1B20] dark:text-[#E6E0E9] focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-xs">
              ✕
            </button>
          )}
        </div>

        {/* Filter Chips: Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['All', 'Pending', 'Completed'] as const).map((status) => (
            <M3Chip
              key={status}
              label={status}
              selected={selectedStatus === status}
              onClick={() => setSelectedStatus(status)}
            />
          ))}

          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1" />

          {/* Category Chips */}
          <M3Chip
            label="All Categories"
            selected={selectedCategory === 'All'}
            onClick={() => setSelectedCategory('All')}
          />
          {categories.map((cat) => (
            <M3Chip
              key={cat}
              label={cat}
              selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2 flex-1">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-3.5 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-3 ${
              task.isCompleted
                ? 'bg-[#FEF7FF]/50 dark:bg-[#141218]/40 border-emerald-500/20 opacity-75'
                : 'bg-[#FEF7FF] dark:bg-[#141218] border-[#CAC4D0]/40 hover:shadow-sm'
            }`}
          >
            {/* Checkbox */}
            <button
              type="button"
              onClick={() => onToggleTask(task.id)}
              className={`w-5 h-5 mt-0.5 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${
                task.isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'border-2 border-[#79747E] hover:border-[#6750A4]'
              }`}
              title={task.isCompleted ? 'Mark as pending' : 'Mark as completed'}
            >
              {task.isCompleted && <CheckCircle2 size={14} />}
            </button>

            {/* Content */}
            <div className="flex-1">
              <span
                onClick={() => onToggleTask(task.id)}
                className={`text-sm font-medium block cursor-pointer ${
                  task.isCompleted
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-[#1D1B20] dark:text-[#E6E0E9]'
                }`}
              >
                {task.title}
              </span>

              {task.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {task.description}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-[#E8DEF8] dark:bg-[#4A4458] text-[#1D192B] dark:text-[#E8DEF8] text-[10px] font-medium">
                  {task.category}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                    task.priority === 'High'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : task.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {task.priority} Priority
                </span>

                {task.deadline && (
                  <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                    <Calendar size={11} /> {task.deadline}
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => openEditModal(task)}
                className="p-1.5 text-gray-400 hover:text-[#6750A4] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Edit task"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl bg-[#FEF7FF] dark:bg-[#141218] border border-dashed border-[#CAC4D0]/40">
            <CheckCircle2 size={32} className="mx-auto text-gray-400 mb-2 opacity-50" />
            <h4 className="text-sm font-semibold text-[#1D1B20] dark:text-[#E6E0E9]">
              {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'No matching tasks found'
                : 'No tasks added yet'}
            </h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'Try clearing your filters or search keywords.'
                : 'Add a new task using the button above to begin tracking your productivity.'}
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Task Dialog */}
      <M3Dialog
        isOpen={isModalOpen}
        title={editingTaskId ? 'Edit Task' : 'Add New Task'}
        onClose={() => setIsModalOpen(false)}
        confirmLabel="Save Task"
        onConfirm={handleSaveTask}
      >
        <div className="space-y-3 pt-2">
          <M3TextField
            label="Task Title *"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            error={formError}
            placeholder="e.g. Finish Chapter 4 Algorithm Analysis"
          />

          <M3TextField
            label="Task Description (Optional)"
            multiline
            rows={2}
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Details, references, steps..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-500 mb-1 block">
                Category
              </label>
              <select
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value)}
                className="w-full bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-500 mb-1 block">
                Priority Level
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                className="w-full bg-[#ECE6F0] dark:bg-[#2B2930] rounded-xl px-3 py-2 text-xs border-b-2 border-[#79747E] focus:outline-none"
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🔵 Low Priority</option>
              </select>
            </div>
          </div>

          <M3TextField
            label="Deadline Date"
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
          />
        </div>
      </M3Dialog>
    </div>
  );
};
