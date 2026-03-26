import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { LayoutDashboard, User, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register({ name, email, password, role });
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to register. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-4">
              <LayoutDashboard className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create account
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
              Join TaskManager and start managing your tasks
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      required
                      className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Account Role
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <select
                      id="role"
                      name="role"
                      className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold cursor-pointer appearance-none"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                    >
                      <option value="USER">Standard User</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              
              <div className="text-center pt-2">
                <p className="text-sm text-slate-500 font-medium">
                  Already registered?{' '}
                  <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer className="mt-8 text-center">
        <p className="text-sm text-slate-400 font-medium">
          © {new Date().getFullYear()} TaskManager. All rights reserved by Vishakha Binani
        </p>
      </footer>
    </div>
  );
};

export default RegisterPage;
