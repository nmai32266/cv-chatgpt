
import React, { useState, useEffect } from 'react';
import { AnalysisResult, ActivityItem } from '../types';
import { 
  Briefcase, Zap, Star, X, CheckCircle, ArrowRight, 
  BookOpen, Rocket, Building2, Lock, Search, 
  ShieldCheck, AlertTriangle, LogIn, Sparkles, Globe, Hash, Clock
} from 'lucide-react';

interface AnalysisResultProps {
  data: AnalysisResult;
  onApplyRequest: (job: any) => void;
  onApplyFinish: (item: ActivityItem) => void;
}

const AnalysisResultView: React.FC<AnalysisResultProps> = ({ data, onApplyRequest, onApplyFinish }) => {
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState<{show: boolean, msg: string}>({ show: false, msg: '' });

  useEffect(() => {
    // Listen for the signal from App.tsx that candidate is logged in and ready to apply
    const handleExecuteApply = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { job, cv, username, name } = customEvent.detail;
      if (job) {
        startApplyProcess(job, cv, username, name);
      }
    };
    window.addEventListener('execute-apply', handleExecuteApply);
    return () => window.removeEventListener('execute-apply', handleExecuteApply);
  }, []);

  const startApplyProcess = (job: any, cv: any, username: string, name: string) => {
    setIsApplying(job.title);
    
    // Create the initial 'reviewing' item
    const newActivity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: job.title,
      provider: job.provider,
      type: 'job',
      appliedDate: new Date().toLocaleDateString('vi-VN'),
      status: 'reviewing',
      description: job.description,
      candidateName: name || "Ứng viên Test",
      cvFileContent: cv?.fileData,
      cvMimeType: cv?.mimeType,
      ownerUsername: username // Gắn với username để không mất dữ liệu
    };

    onApplyFinish(newActivity);

    // AI Agent (Phạm Tuyết Nhi) xét duyệt trong 10 giây
    setTimeout(() => {
      const statusOptions: ('approved' | 'rejected')[] = ['approved', 'rejected'];
      const finalStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      window.dispatchEvent(new CustomEvent('update-app-status', { detail: { id: newActivity.id, status: finalStatus } }));

      setIsApplying(null);
      setShowSuccessPopup({ 
        show: true, 
        msg: `HR Agent | Phạm Tuyết Nhi đã hoàn tất xem xét hồ sơ của bạn. Trạng thái: ${finalStatus.toUpperCase()}. Kiểm tra 'Hoạt động' ngay!` 
      });
    }, 10000);
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="text-purple-700 font-black px-1.5 py-0.5 bg-purple-50 rounded-md border border-purple-100 mx-0.5">{part.slice(2, -2)}</span>;
      }
      return part;
    });
  };

  return (
    <div className="w-full relative overflow-hidden font-['Be_Vietnam_Pro'] pb-32">
      <div className="absolute top-[10%] -left-10 w-[120%] h-12 bg-purple-600 rotate-[-3deg] flex items-center shadow-2xl z-0 opacity-80 overflow-hidden select-none pointer-events-none">
        <div className="animate-marquee flex whitespace-nowrap gap-12 items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 text-white font-black italic tracking-widest text-sm uppercase">
              <Star className="w-4 h-4 fill-yellow-400" /> PHÂN TÍCH CV <Zap className="w-4 h-4" /> VOLTRIA AI <Globe className="w-4 h-4" /> KẾT NỐI VIỆC LÀM
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 pt-20 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-[3.5rem] p-10 md:p-16 shadow-xl border border-gray-100">
            <div className="flex items-center gap-5 mb-16">
              <div className="p-4 bg-purple-100 rounded-[1.5rem] shadow-inner"><Briefcase className="w-9 h-9 text-purple-700" /></div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Thông Tin Sự Nghiệp</h2>
            </div>
            <div className="space-y-16">
              <InfoBlock title="KINH NGHIỆM PHÙ HỢP" content={renderHighlightedText(data.detailedAnalysis.experienceMatch)} />
              <InfoBlock title="ĐỘ KHỚP KỸ NĂNG" content={renderHighlightedText(data.detailedAnalysis.skillsAssessment)} />
              <InfoBlock title="SỰ ỔN ĐỊNH CÔNG VIỆC" content={renderHighlightedText(data.detailedAnalysis.jobStability)} />
              <InfoBlock title="KHOẢNG TRỐNG VIỆC LÀM" content={renderHighlightedText(data.detailedAnalysis.employmentGaps)} />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-[#f0fdf4] rounded-[2.5rem] p-10 border border-green-100 shadow-sm transition-transform hover:scale-[1.02] duration-500">
              <Zap className="w-7 h-7 text-green-600 mb-6" />
              <h3 className="text-xl font-black text-[#166534] mb-4 uppercase tracking-tighter">Điểm Mạnh</h3>
              <ul className="space-y-4">
                {data.strengths.map((s,i)=>(
                  <li key={i} className="flex gap-4 text-sm font-bold text-[#15803d]">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#fffaf5] rounded-[2.5rem] p-10 border border-orange-100 shadow-sm transition-transform hover:scale-[1.02] duration-500">
              <AlertTriangle className="w-7 h-7 text-orange-600 mb-6" />
              <h3 className="text-xl font-black text-[#9a3412] mb-4 uppercase tracking-tighter">Cần Cải Thiện</h3>
              <ul className="space-y-4">
                {data.weaknesses.map((w,i)=>(
                  <li key={i} className="flex gap-4 text-sm font-bold text-[#c2410c]">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#43238e] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-6 right-6 opacity-10 group-hover:rotate-45 transition-transform"><Star className="w-24 h-24" /></div>
              <h3 className="text-2xl font-black tracking-tight uppercase mb-10 flex items-center gap-4"><Star className="w-7 h-7 text-yellow-400 fill-yellow-400" /> Gợi Ý Nhanh</h3>
              <div className="space-y-5 relative z-10">
                {data.suggestedJobs.map((job, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/20 transition-all border-b-4 border-white/5">
                    <div className="flex justify-between items-start mb-4 gap-2">
                      <h4 className="font-bold text-lg leading-tight text-white">{job.title}</h4>
                      <button 
                        disabled={!!isApplying}
                        onClick={() => onApplyRequest(job)}
                        className={`shrink-0 text-[10px] font-black uppercase px-5 py-2 rounded-full shadow-lg transition-all ${isApplying === job.title ? 'bg-yellow-400 text-purple-900 animate-pulse' : 'bg-purple-600 hover:bg-white hover:text-purple-900 text-white'}`}
                      >
                        {isApplying === job.title ? 'Processing...' : 'Apply'}
                      </button>
                    </div>
                    {isApplying === job.title && (
                      <div className="mb-4 flex items-center gap-2 text-yellow-300 text-[11px] font-black italic bg-white/10 p-2 rounded-xl">
                        <Clock className="w-4 h-4 animate-spin" /> HR Agent Nhi đang duyệt CV... (10s)
                      </div>
                    )}
                    <p className="text-sm text-purple-100 italic line-clamp-2 leading-relaxed">"{job.description}"</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-purple-300 font-bold uppercase tracking-widest"><Building2 className="w-4 h-4" /> @ {job.provider}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-24 text-center">
          <div className="inline-block px-6 py-2 bg-purple-50 rounded-full border border-purple-100 mb-6 font-black text-purple-600 uppercase tracking-widest text-xs">Action Roadmap</div>
          <h2 className="text-5xl font-black text-gray-900 mb-20 tracking-tighter">Lộ Trình Nâng Cấp Kỹ Năng</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            <div className="space-y-8">
              <h3 className="text-2xl font-black flex items-center gap-4 px-4"><div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner"><BookOpen className="w-6 h-6" /></div> Khóa Học Cốt Lõi</h3>
              {data.developmentRoadmap.courses.map((c, i) => <RoadmapCard key={i} item={c} color="blue" icon={<Search className="w-5 h-5" />} />)}
            </div>
            <div className="space-y-8">
              <h3 className="text-2xl font-black flex items-center gap-4 px-4"><div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner"><Rocket className="w-6 h-6" /></div> Dự Án Thực Chiến</h3>
              {data.developmentRoadmap.projects.map((p, i) => <RoadmapCard key={i} item={p} color="purple" icon={<Zap className="w-5 h-5" />} />)}
            </div>
          </div>
        </div>
      </div>

      {showSuccessPopup.show && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
           <div className="bg-white rounded-[4rem] p-16 max-w-md w-full shadow-2xl text-center relative overflow-hidden animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"><CheckCircle className="w-14 h-14 text-green-600" /></div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tighter">XÉT DUYỆT HOÀN TẤT</h3>
              <p className="text-gray-500 mb-14 font-medium italic text-lg leading-relaxed">"{showSuccessPopup.msg}"</p>
              <button onClick={() => setShowSuccessPopup({show: false, msg: ''})} className="w-full bg-purple-600 text-white font-black py-6 rounded-[2rem] shadow-lg text-xl hover:bg-purple-700 transition-all active:scale-95">Xem kết quả</button>
           </div>
        </div>
      )}
    </div>
  );
};

const InfoBlock = ({ title, content }: any) => (
  <div className="group border-l-[6px] border-gray-100 pl-14 relative hover:border-purple-600 transition-all duration-700">
    <div className="absolute -left-1.5 top-0 w-1.5 h-0 bg-purple-600 group-hover:h-full transition-all duration-700"></div>
    <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 group-hover:text-purple-600 transition-colors flex items-center gap-4"><Sparkles className="w-4 h-4" /> {title}</h4>
    <div className="text-gray-800 text-xl font-medium leading-relaxed">{content}</div>
  </div>
);

const RoadmapCard = ({ item, icon, color }: any) => (
  <div className={`group flex flex-col p-10 rounded-[3rem] border-2 border-gray-50 bg-white hover:border-${color}-500 hover:shadow-2xl transition-all duration-500 cursor-pointer`}>
    <div className="flex items-center gap-6 mb-6">
      <div className={`p-5 rounded-[1.5rem] bg-${color}-50 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white transition-all`}>{icon}</div>
      <div><h4 className="font-black text-xl text-gray-900 group-hover:text-purple-800 transition-colors">{item.name}</h4><p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-1">{item.provider || 'Voltria Research'}</p></div>
    </div>
    <p className="text-gray-500 text-sm italic leading-relaxed border-t border-gray-50 pt-4 group-hover:text-gray-700 transition-colors">{item.description}</p>
  </div>
);

export default AnalysisResultView;
