
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import UploadSection from './components/UploadSection';
import AnalysisResultView from './components/AnalysisResult';
import MyActivities from './components/MyActivities';
import HRDashboard from './components/HRDashboard';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import { AnalysisResult, UploadState, ActivityItem, ApplicationStatus, User as UserType } from './types';
import { analyzeCV } from './services/cvService';
import { X, LogIn } from 'lucide-react';

const STORAGE_KEY = 'voltria_activities';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'analyze' | 'hr'>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentUpload, setCurrentUpload] = useState<UploadState | null>(null);
  const [prefilledJob, setPrefilledJob] = useState('');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showCandidateLogin, setShowCandidateLogin] = useState<{show: boolean, pendingAction: 'apply' | 'save' | null, pendingData: any | null}>({ 
    show: false, 
    pendingAction: null, 
    pendingData: null 
  });
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');

  // Persistent State
  const [applications, setApplications] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [showActivities, setShowActivities] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  // Lọc danh sách hoạt động dựa trên người dùng hiện tại
  const userActivities = useMemo(() => {
    if (currentUser?.role === 'hr') return applications; // HR xem tất cả
    return applications.filter(app => app.ownerUsername === currentUser?.username);
  }, [applications, currentUser]);

  useEffect(() => {
    const handleStartEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const job = customEvent.detail?.job || '';
      handleStart(job);
    };
    
    const handleUpdateStatus = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { id, status } = customEvent.detail;
      updateApplicationStatus(id, status);
    };

    window.addEventListener('trigger-start-analysis', handleStartEvent);
    window.addEventListener('update-app-status', handleUpdateStatus);
    
    return () => {
      window.removeEventListener('trigger-start-analysis', handleStartEvent);
      window.removeEventListener('update-app-status', handleUpdateStatus);
    };
  }, []);

  const handleStart = (job: string = '') => {
    setView('analyze');
    setPrefilledJob(job);
    setResult(null);
    setCurrentUpload(null);
    setTimeout(() => {
        const el = document.getElementById('upload-area');
        el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAnalysis = async (state: UploadState) => {
    if (!state.fileData) return;
    setIsAnalyzing(true);
    setResult(null);
    setCurrentUpload(state);
    try {
      const data = await analyzeCV(state.fileData, state.mimeType, state.targetJob);
      setResult(data);
      
      // Tự động lưu lịch sử quét vào "Hoạt động" của user (nếu đã login) hoặc vô danh
      const scanActivity: ActivityItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: `Phân tích CV: ${state.targetJob || 'Tổng quát'}`,
        provider: 'Voltria AI System',
        type: 'scan',
        appliedDate: new Date().toLocaleDateString('vi-VN'),
        status: 'approved',
        cvFileContent: state.fileData,
        cvMimeType: state.mimeType,
        ownerUsername: currentUser?.username || undefined,
        candidateName: currentUser?.name || "Khách"
      };
      setApplications(prev => [scanActivity, ...prev]);
      
    } catch (error) {
      console.error("Lỗi phân tích CV:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Đã xảy ra lỗi không xác định. Vui lòng thử lại!";
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyRequest = (job: any) => {
    if (currentUser?.role === 'candidate') {
      window.dispatchEvent(new CustomEvent('execute-apply', { 
        detail: { job, cv: currentUpload, username: currentUser.username, name: currentUser.name } 
      }));
    } else {
      setShowCandidateLogin({ show: true, pendingAction: 'apply', pendingData: job });
    }
  };

  const handleCandidateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === 'test' && loginForm.pass === '123') {
      const user: UserType = { username: 'test', name: 'Ứng viên Test', role: 'candidate' };
      setCurrentUser(user);
      const { pendingAction, pendingData } = showCandidateLogin;
      setShowCandidateLogin({ show: false, pendingAction: null, pendingData: null });
      setLoginForm({ user: '', pass: '' });
      setLoginError('');
      
      if (pendingAction === 'apply' && pendingData) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('execute-apply', { 
            detail: { job: pendingData, cv: currentUpload, username: user.username, name: user.name } 
          }));
        }, 300);
      }
    } else {
      setLoginError('Tài khoản: test / Mật khẩu: 123');
    }
  };

  const handleHRLogin = (user: UserType) => {
    setCurrentUser(user);
    setView('hr');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const deleteApplication = (id: string) => {
    if(confirm("Bạn có chắc chắn muốn xóa hoạt động này khỏi lịch sử?")) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 selection:bg-purple-200 selection:text-purple-900 font-['Be_Vietnam_Pro'] flex flex-col relative">
      <Header 
        activityCount={userActivities.length} 
        onOpenActivities={() => setShowActivities(true)} 
        onHRLogin={handleHRLogin}
        isHR={currentUser?.role === 'hr'}
        isLoggedIn={!!currentUser}
        currentUser={currentUser}
        onLogout={handleLogout}
        onCandidateLoginRequest={() => setShowCandidateLogin({ show: true, pendingAction: null, pendingData: null })}
      />
      
      <MyActivities 
        isOpen={showActivities} 
        onClose={() => setShowActivities(false)} 
        activities={userActivities}
        onDelete={deleteApplication}
      />

      <main className="flex-grow">
        {view === 'landing' && <LandingPage onStart={() => handleStart()} />}
        
        {view === 'hr' && currentUser?.role === 'hr' && (
          <div className="pt-24">
            <HRDashboard 
              applications={applications} 
              onUpdateStatus={updateApplicationStatus} 
              onDelete={deleteApplication}
              hrUser={currentUser} 
            />
          </div>
        )}

        {view === 'analyze' && (
          <div className="pt-24 min-h-screen flex flex-col items-center">
            {!result && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-10 px-4">
                        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Tải Lên Hồ Sơ Của Bạn</h1>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto italic font-medium">
                            {prefilledJob ? `Định hướng cho: ${prefilledJob}` : "Hãy để Voltria AI giúp bạn tối ưu hóa hồ sơ ngay lập tức."}
                        </p>
                    </div>
                    <UploadSection onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} initialJob={prefilledJob} />
                </div>
            )}
            {result && (
                <div className="w-full">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                         <button onClick={() => setResult(null)} className="mb-6 text-gray-400 hover:text-purple-600 font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all">← Tải Lên CV Mới</button>
                    </div>
                   <AnalysisResultView 
                      data={result} 
                      onApplyRequest={handleApplyRequest} 
                      onApplyFinish={(item) => setApplications(prev => [item, ...prev])} 
                   />
                </div>
            )}
          </div>
        )}
      </main>

      {/* Candidate Login Modal */}
      {showCandidateLogin.show && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative border border-gray-100">
            <button onClick={() => setShowCandidateLogin({show: false, pendingAction: null, pendingData: null})} className="absolute top-8 right-8 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            <div className="w-20 h-20 bg-purple-100 rounded-[2rem] flex items-center justify-center mb-10 mx-auto text-purple-600 shadow-inner"><LogIn className="w-10 h-10" /></div>
            <h3 className="text-3xl font-black text-gray-900 text-center mb-2">Đăng Nhập Ứng Viên</h3>
            <p className="text-center text-gray-500 text-sm mb-10 font-medium italic">Vui lòng đăng nhập: test / 123</p>
            
            <form onSubmit={handleCandidateLogin} className="space-y-5">
              <input 
                type="text" 
                placeholder="Username (test)"
                value={loginForm.user}
                onChange={e => setLoginForm({...loginForm, user: e.target.value})}
                className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 transition-all font-bold text-lg" 
              />
              <input 
                type="password" 
                placeholder="Password (123)"
                value={loginForm.pass}
                onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
                className="w-full px-7 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 transition-all font-bold text-lg" 
              />
              {loginError && <p className="text-red-500 text-xs font-black text-center animate-pulse">{loginError}</p>}
              <button type="submit" className="w-full bg-purple-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-purple-700 transition-all mt-6 text-xl">Xác nhận</button>
            </form>
          </div>
        </div>
      )}

      <Chatbot />
      <Footer />
    </div>
  );
};

export default App;
