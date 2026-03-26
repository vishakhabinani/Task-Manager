import React, { useState, useEffect } from 'react';
import type { Task, UserDto, Status } from '../types/index';
import { userApi } from '../api/userApi';
import { X } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSave: (taskData: Partial<Task>) => void;
  onCancel: () => void;
  isAdmin: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, isAdmin }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<Status>(task?.status || 'TODO');
  const [assignedToId, setAssignedToId] = useState<number | undefined>(task?.assignedTo?.id);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const data = await userApi.getAll();
          setUsers(data);
        } catch (err) {
          console.error('Failed to fetch users', err);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      status,
      assignedToId: assignedToId || undefined
    } as any);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {task ? 'Edit Task' : 'New Task'}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {task ? 'Update existing task details' : 'Create a new item for your team'}
            </p>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Task Title
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g. Design system update"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="What needs to be done?"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-300 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-bold cursor-pointer appearance-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Completed</option>
                </select>
              </div>

              {isAdmin && (
                <div>
                  <label htmlFor="assignedTo" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Assignee
                  </label>
                  <select
                    id="assignedTo"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 font-bold cursor-pointer appearance-none"
                    value={assignedToId || ''}
                    onChange={(e) => setAssignedToId(e.target.value ? parseInt(e.target.value) : undefined)}
                    disabled={loadingUsers}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-4 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-[0.98]"
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
