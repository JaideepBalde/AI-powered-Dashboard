import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, Zap, Tag } from 'lucide-react';
import { Task } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AIService } from '../services/aiService';

interface DayPlannerProps {
  theme: 'light' | 'dark';
}

const DayPlanner: React.FC<DayPlannerProps> = ({ theme }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('bolt-ai-tasks', []);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'day' | 'week'>('day');
  const [isAiPrioritizing, setIsAiPrioritizing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    tag: 'Work' as Task['tag'],
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });

  const tagColors = {
    Work: 'from-blue-500 to-blue-600',
    Personal: 'from-green-500 to-green-600',
    Trading: 'from-yellow-500 to-yellow-600',
    Health: 'from-red-500 to-red-600'
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      tag: newTask.tag,
      priority: tasks.length,
      completed: false,
      date: newTask.date,
      time: newTask.time
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      tag: 'Work',
      date: new Date().toISOString().split('T')[0],
      time: '09:00'
    });
    setShowAddTask(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const aiPrioritize = async () => {
    setIsAiPrioritizing(true);
    try {
      const prioritizedTasks = await AIService.prioritizeTasks(tasks);
      setTasks(prioritizedTasks.map((task, index) => ({ ...task, priority: index })));
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
    } finally {
      setIsAiPrioritizing(false);
    }
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.date === date).sort((a, b) => a.priority - b.priority);
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date(selectedDate);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Smart Day Planner
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'day'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Day View
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'week'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Week View
              </button>
            </div>
            <button
              onClick={aiPrioritize}
              disabled={isAiPrioritizing || tasks.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              <span>{isAiPrioritizing ? 'Prioritizing...' : 'AI Prioritize'}</span>
            </button>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
        {view === 'day' ? (
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Tasks for {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <div className="space-y-4">
              {getTasksForDate(selectedDate).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  theme={theme}
                  onToggleComplete={toggleComplete}
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                  tagColors={tagColors}
                />
              ))}
              {getTasksForDate(selectedDate).length === 0 && (
                <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No tasks for this day</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {getWeekDates().map(date => (
              <div key={date} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
                <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h4>
                <div className="space-y-2">
                  {getTasksForDate(date).slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className={`p-2 rounded text-xs ${
                        task.completed ? 'opacity-50 line-through' : ''
                      } bg-gradient-to-r ${tagColors[task.tag]} text-white`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {getTasksForDate(date).length > 3 && (
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      +{getTasksForDate(date).length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <TaskModal
          theme={theme}
          task={newTask}
          onSave={addTask}
          onCancel={() => setShowAddTask(false)}
          onChange={setNewTask}
          title="Add New Task"
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          theme={theme}
          task={editingTask}
          onSave={updateTask}
          onCancel={() => setEditingTask(null)}
          onChange={setEditingTask}
          title="Edit Task"
        />
      )}
    </div>
  );
};

const TaskCard: React.FC<{
  task: Task;
  theme: 'light' | 'dark';
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  tagColors: Record<string, string>;
}> = ({ task, theme, onToggleComplete, onEdit, onDelete, tagColors }) => {
  return (
    <div className={`rounded-lg border p-4 transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700 hover:border-purple-500/50'
        : 'bg-white border-gray-200 hover:border-purple-300'
    } ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <h4 className={`font-medium ${
              task.completed ? 'line-through' : ''
            } ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${tagColors[task.tag]} text-white`}>
              {task.tag}
            </span>
          </div>
          {task.description && (
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          <div className={`flex items-center space-x-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{task.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{task.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-red-900 text-red-400 hover:text-red-300'
                : 'hover:bg-red-100 text-red-500 hover:text-red-700'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskModal: React.FC<{
  theme: 'light' | 'dark';
  task: any;
  onSave: (task: any) => void;
  onCancel: () => void;
  onChange: (task: any) => void;
  title: string;
}> = ({ theme, task, onSave, onCancel, onChange, title }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg p-6 w-full max-w-md ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={(e) => onChange({ ...task, title: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          
          <textarea
            placeholder="Description (optional)"
            value={task.description}
            onChange={(e) => onChange({ ...task, description: e.target.value })}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border resize-none ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          
          <select
            value={task.tag}
            onChange={(e) => onChange({ ...task, tag: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Trading">Trading</option>
            <option value="Health">Health</option>
          </select>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={task.date}
              onChange={(e) => onChange({ ...task, date: e.target.value })}
              className={`px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <input
              type="time"
              value={task.time}
              onChange={(e) => onChange({ ...task, time: e.target.value })}
              className={`px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(task)}
            disabled={!task.title.trim()}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayPlanner;