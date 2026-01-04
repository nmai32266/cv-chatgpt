
import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Sparkles, X, Building2, ShieldCheck, Search, UserCircle, BookOpen, ChevronRight, LogOut, User, LogIn } from 'lucide-react';

interface HeaderProps {
  activityCount?: number;
  onOpenActivities?: () => void;
  onHRLogin: (user: any) => void;
  isHR: boolean;
  isLoggedIn: boolean;
  currentUser: any;
  onLogout: () => void;
  onCandidateLoginRequest: () => void;
}

const HR_ACCOUNTS = [
  { username: 'nhipham', pass: '1', name: 'Phạm Tuyết Nhi', role: 'hr' },
  { username: 'admin_voltria', pass: '123456', name: 'Quản trị viên', role: 'hr' }
];

const Header: React.FC<HeaderProps> = ({ activityCount = 0, onOpenActivities, onHRLogin, isHR, isLoggedIn, currentUser, onLogout, onCandidateLoginRequest }) => {
  const [showHRModal, setShowHRModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = HR_ACCOUNTS.find(a => a.username === loginForm.user && a.pass === loginForm.pass);
    if (found) {
      onHRLogin(found);
      setShowHRModal(false);
      setLoginForm({ user: '', pass: '' });
      setError('');
    } else {
      setError('Tài khoản hoặc mật khẩu HR không chính xác (nhipham / 1)');
    }
  };

  const handleJobSelect = (job: string) => {
    window.dispatchEvent(new CustomEvent('trigger-start-analysis', { detail: { job } }));
    setIsSearchOpen(false);
  };

  const coreCourses = [
    { title: "Chứng chỉ Chuyên môn Google IT Automation with Python", cat: "CNTT" },
    { title: "Information Technology (IT) and Cloud Fundamentals", cat: "CNTT" },
    { title: "Foundations of Marketing Analytics", cat: "MARKETING" },
    { title: "Quản lý chuỗi cung ứng và hậu cần", cat: "LOGISTICS" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass-panel border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase hidden md:inline">Voltria</span>
          </div>

          {/* Search Bar */}
          {!isHR && (
            <div className="flex-1 max-w-2xl relative" ref={searchRef}>
              <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'ring-2 ring-purple-500/20' : ''}`}>
                <Search className="absolute left-4 w-5 h-5 text-purple-400" />
                <input 
                  type="text" 
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Tìm khóa học, nghề nghiệp..."
                  className="w-full bg-slate-50 border border-purple-100 rounded-full py-2.5 pl-12 pr-4 outline-none focus:bg-white focus:border-purple-400 transition-all text-sm font-medium"
                />
              </div>

              {/* Dropdown Menu */}
              {isSearchOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                  <div className="p-6">
                    <div className="mb-6">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Nghề nghiệp gợi ý</p>
                      <button 
                        onClick={() => handleJobSelect('')}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50 transition-all group"
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                          <UserCircle className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-gray-800">Chọn nghề nghiệp để quét CV</span>
                      </button>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Khóa học cốt lõi</p>
                      <div className="space-y-2">
                        {coreCourses.map((course, i) => (
                          <button 
                            key={i}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group text-left"
                          >
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-800 text-sm truncate">{course.title}</p>
                              <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5 tracking-wider">{course.cat}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-600 py-4 px-6 text-center">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Trí tuệ Voltria giúp bạn định hướng tương lai</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nav Buttons */}
          <nav className="flex items-center gap-3 shrink-0">
            {!isHR && (
              <button 
                onClick={onOpenActivities}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-bold bg-purple-50/80 px-4 py-2 rounded-xl border border-purple-100 transition-all hover:bg-purple-50"
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-sm hidden lg:inline">Hoạt động</span>
                {activityCount > 0 && (
                  <span className="bg-purple-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                    {activityCount}
                  </span>
                )}
              </button>
            )}

            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onCandidateLoginRequest}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm hidden lg:inline">Login</span>
                </button>
                <button 
                  onClick={() => setShowHRModal(true)}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm hidden lg:inline">HR/OM</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 shadow-lg ${isHR ? 'bg-slate-900 text-white' : 'bg-purple-50 text-purple-900'}`}>
                  {isHR ? <ShieldCheck className="w-4 h-4 text-purple-400" /> : <User className="w-4 h-4 text-purple-600" />}
                  <span className="text-xs font-black uppercase tracking-widest">{currentUser.name}</span>
                </div>
                <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Đăng xuất">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* HR Login Modal */}
      {showHRModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative border border-gray-100">
            <button onClick={() => setShowHRModal(false)} className="absolute top-8 right-8 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            <div className="w-20 h-20 bg-purple-100 rounded-[2rem] flex items-center justify-center mb-10 mx-auto text-purple-600 shadow-inner"><Building2 className="w-10 h-10" /></div>
            <h3 className="text-3xl font-black text-gray-900 text-center mb-2">HR Login</h3>
            <p className="text-center text-gray-500 text-sm mb-10 font-medium italic">Sử dụng tài khoản nhipham / 1 để truy cập</p>
            
            <form onSubmit={handleHRSubmit} className="space-y-5">
              <input 
                type="text" 
                placeholder="Username (nhipham)"
                value={loginForm.user}
                onChange={e => setLoginForm({...loginForm, user: e.target.value})}
                className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 transition-all font-bold text-lg" 
              />
              <input 
                type="password" 
                placeholder="Password (1)"
                value={loginForm.pass}
                onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
                className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 transition-all font-bold text-lg" 
              />
              {error && <p className="text-red-500 text-xs font-black text-center animate-pulse">{error}</p>}
              <button type="submit" className="w-full bg-gray-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-black transition-all mt-6 text-xl">Đăng nhập tổ chức</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
