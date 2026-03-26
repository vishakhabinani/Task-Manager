import React, { useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import { userApi } from '../api/userApi';
import type { Task, Status, UserDto } from '../types/index';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter, Trash2, Edit2, CheckCircle, Clock, AlertCircle, User, LayoutDashboard } from 'lucide-react';
import TaskForm from '../components/TaskForm';

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | undefined>(undefined);
  const [assignedToFilter, setAssignedToFilter] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const { isAdmin } = useAuth();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskApi.getAll(statusFilter, assignedToFilter);
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (isAdmin) {
      try {
        const data = await userApi.getAll();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users for filter', err);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, assignedToFilter]);

  useEffect(() => {
    fetchUsers();
  }, [isAdmin]);

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        await taskApi.update(editingTask.id, taskData);
      } else {
        await taskApi.create(taskData);
      }
      setIsFormOpen(false);
      setEditingTask(undefined);
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.delete(id);
        fetchTasks();
      } catch (err: any) {
        alert(err.response?.data || 'Failed to delete task');
      }
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'TODO':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-100 uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5" /> To Do
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" /> In Progress
          </span>
        );
      case 'DONE':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
            <CheckCircle className="h-3.5 w-3.5" /> Completed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-lg text-slate-500 mt-2 font-medium">Efficiently manage and track your team's progress</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95"
          >
            <Plus className="h-6 w-6" />
            Create New Task
          </button>
        </div>

        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 flex flex-wrap items-center gap-10 mb-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Status</span>
            </div>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s === 'ALL' ? undefined : s as Status)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    (s === 'ALL' && !statusFilter) || statusFilter === s
                      ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-6 border-l border-slate-100 pl-10">
              <div className="flex items-center gap-2 text-slate-400">
                <User className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Assignee</span>
              </div>
              <select
                className="bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold border-slate-100 focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none"
                value={assignedToFilter || ''}
                onChange={(e) => setAssignedToFilter(e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">Everyone</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-400">
            <div className="relative flex items-center justify-center">
              <div className="absolute animate-ping h-12 w-12 rounded-full bg-blue-400 opacity-20"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-100 border-t-blue-600"></div>
            </div>
            <p className="mt-6 font-bold tracking-tight animate-pulse text-slate-500">Syncing tasks...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-100 text-red-700 px-8 py-6 rounded-[32px] flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="font-bold text-lg">Oops! Something went wrong</p>
              <p className="font-medium opacity-80">{error}</p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[48px] py-32 text-center">
            <div className="bg-slate-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <LayoutDashboard className="h-12 w-12 text-slate-300" />
            </div>
            <p className="text-2xl font-black text-slate-800 mb-3">No tasks found</p>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">It looks like there are no tasks matching your filters. Start fresh by creating a new one!</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-50 text-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              Create your first task →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tasks.map((task) => (
              <div key={task.id} className="group bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setIsFormOpen(true);
                    }}
                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-100"
                    title="Edit Task"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-100"
                    title="Delete Task"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-8">
                  {getStatusBadge(task.status)}
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{task.title}</h3>
                <p className="text-slate-500 font-medium mb-10 flex-grow leading-relaxed line-clamp-4">
                  {task.description || <span className="italic text-slate-300">No description provided</span>}
                </p>

                <div className="bg-slate-50 rounded-[32px] p-6 space-y-4 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignee</span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-100">
                        {(task.assignedTo?.name || 'U').charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 text-sm">
                        {task.assignedTo?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Creator</span>
                    <span className="font-bold text-slate-600 text-sm">{task.createdBy.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isFormOpen && (
          <TaskForm
            task={editingTask}
            onSave={handleSaveTask}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTask(undefined);
            }}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
