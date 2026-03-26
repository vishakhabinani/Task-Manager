import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import type { UserDto } from '../types/index';
import { Users, Mail, User, AlertCircle, UserMinus, UserPlus } from 'lucide-react';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: number, active: boolean | undefined) => {
    try {
      if (active) {
        await userApi.deactivate(id);
      } else {
        await userApi.activate(id);
      }
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to update user status');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading users...</div>;
  if (error) return <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3"><AlertCircle className="h-6 w-6" /> {error}</div>;

  return (
    <div className="space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="h-6 w-6" />
          User Management
        </h1>
        <p className="text-slate-500 text-sm">View and manage all users in the system</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${!u.active ? 'bg-slate-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${u.active ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                      <User className="h-4 w-4" />
                    </div>
                    <span className={`font-semibold ${u.active ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Mail className="h-4 w-4" />
                    {u.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {u.active ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Active</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleToggleStatus(u.id, u.active)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ml-auto ${
                      u.active 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {u.active ? (
                      <><UserMinus className="h-3 w-3" /> Deactivate</>
                    ) : (
                      <><UserPlus className="h-3 w-3" /> Activate</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
