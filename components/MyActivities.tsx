
import React, { useState } from 'react';
import { ActivityItem } from '../types';
import { X, BookOpen, Rocket, Building2, Calendar, ArrowRight, Mail, AlertCircle, CheckCircle2, UserCheck, Trash2, Clock, Sparkles } from 'lucide-react';

interface MyActivitiesProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityItem[];
  onDelete?: (id: string) => void;
}

const MyActivities: React.FC<MyActivitiesProps> = ({ isOpen, onClose, activities, onDelete }) => {
  const [selectedLetter, setSelectedLetter] = useState<ActivityItem | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleApplyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Voltria đã ghi nhận email: ${email}. HR Phạm Tuyết Nhi sẽ sớm liên hệ bạn!`);
    setShowEmailForm(false);
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-end bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white h-full w-full max-w-xl shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[4rem] border-l-8 border-purple-600/30">
        
        <div className="flex justify-between items-center mb-10 pb-8 border-b border-gray-100">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Hoạt Động Của Tôi</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Quản lý các hồ sơ đã ứng tuyển</p>
          </div>
          <button onClick={onClose} className="p-4 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-full transition-all border border-gray-100"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-8 custom-scrollbar">
          {activities.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-8 animate-bounce" />
              <h3 className="text-2xl font-black text-gray-900">Trống trải quá!</h3>
              <p className="text-gray-400 mt-2 px-12 italic font-medium leading-relaxed">Hãy bắt đầu hành trình của bạn bằng cách tải lên CV và ứng tuyển những vị trí tiềm năng nhé.</p>
            </div>
          ) : (
            activities.map((item, idx) => (
              <div key={idx} className={`relative bg-white border-2 rounded-[3rem] p-10 shadow-xl transition-all group hover:-translate-y-1 ${item.status === 'approved' ? 'border-green-100 bg-green-50/10' : item.status === 'rejected' ? 'border-red-100 bg-red-50/10' : 'border-purple-100 bg-purple-50/5'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border ${item.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : item.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                    {item.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                    {item.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                    {(item.status === 'pending' || item.status === 'reviewing') && <Clock className="w-3 h-3 animate-spin" />}
                    {item.status}
                  </div>
                  <span className="text-[10px] text-gray-400 font-black tracking-widest bg-gray-50 px-3 py-1 rounded-lg">{item.appliedDate}</span>
                </div>

                <div className="flex gap-6 mb-8">
                  <div className="p-5 bg-white rounded-2xl shadow-md h-fit border border-gray-100 group-hover:rotate-6 transition-transform"><Building2 className="w-7 h-7 text-purple-600" /></div>
                  <div className="flex-1">
                    <h4 className="font-black text-2xl text-gray-900 leading-tight mb-2 group-hover:text-purple-700 transition-colors">{item.name}</h4>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">{item.provider}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
                  {item.status === 'approved' ? (
                    <button onClick={() => setShowEmailForm(true)} className="flex-1 flex items-center justify-center gap-3 text-green-600 font-black text-xs uppercase tracking-widest bg-white py-4 rounded-2xl shadow-sm border border-green-100 hover:bg-green-600 hover:text-white transition-all active:scale-95">
                      <Mail className="w-4 h-4" /> Để lại thông tin
                    </button>
                  ) : item.status === 'rejected' ? (
                    <button onClick={() => setSelectedLetter(item)} className="flex-1 flex items-center justify-center gap-3 text-red-600 font-black text-xs uppercase tracking-widest bg-white py-4 rounded-2xl shadow-sm border border-red-100 hover:bg-red-600 hover:text-white transition-all active:scale-95">
                      <Mail className="w-4 h-4" /> Xem thư phản hồi
                    </button>
                  ) : (
                    <div className="flex-1 text-center py-4 bg-yellow-50/50 rounded-2xl border border-yellow-100/50">
                      <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest animate-pulse">
                        {item.status === 'reviewing' ? 'AI Agent đang duyệt...' : 'Đang chờ HR duyệt...'}
                      </span>
                    </div>
                  )}
                  {onDelete && <button onClick={() => onDelete(item.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl" title="Delete"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Approved Info Request */}
        {showEmailForm && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[4rem] p-14 max-w-md w-full shadow-2xl relative border-t-8 border-green-500 overflow-hidden">
              <button onClick={() => setShowEmailForm(false)} className="absolute top-10 right-10 text-gray-400 hover:text-gray-900 transition-colors"><X className="w-6 h-6" /></button>
              <div className="w-24 h-24 bg-green-100 rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto text-green-600 shadow-inner"><UserCheck className="w-12 h-12" /></div>
              <h3 className="text-3xl font-black text-center mb-6 tracking-tighter">Hồ sơ được chấp nhận!</h3>
              <p className="text-gray-500 text-lg text-center mb-12 italic leading-relaxed font-medium">Hồ sơ của bạn đã được nhà tuyển dụng xem qua và mong muốn liên hệ bạn sớm, bạn vui lòng để lại thông tin để liên hệ nhé.</p>
              <form onSubmit={handleApplyEmail} className="space-y-6">
                <input 
                  type="email" 
                  required 
                  placeholder="Email của bạn" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  className="w-full px-8 py-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-600 font-bold text-lg transition-all" 
                />
                <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-black transition-all text-xl uppercase tracking-widest">Gửi thông tin</button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Rejection Letter */}
        {selectedLetter && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
            <div className="bg-white rounded-[5rem] p-12 md:p-20 max-w-2xl w-full shadow-2xl relative border border-gray-100 max-h-[95vh] overflow-y-auto custom-scrollbar">
               <button onClick={() => setSelectedLetter(null)} className="absolute top-12 right-12 p-3 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X className="w-7 h-7" /></button>
               
               <div className="mb-14 flex items-center gap-6">
                 <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center shadow-inner animate-pulse"><Mail className="w-10 h-10" /></div>
                 <div>
                   <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Thư Phản Hồi</h3>
                   <p className="text-xs font-black text-red-500 uppercase tracking-[0.3em] mt-1 italic">Voltria HR Agent Feedback</p>
                 </div>
               </div>

               <div className="space-y-8 text-gray-800 font-medium leading-[2] italic text-xl border-l-4 border-red-50 pl-10">
                  <p>Hi {selectedLetter.candidateName || 'Bạn'},</p>
                  <p>Hiện tại nhà tuyển dụng đã xem qua CV bạn và rất hài lòng về những thành tựu, kinh nghiệm mà bạn đã cố gắng gặt hái được, tuy nhiên HR Voltria rất tiếc khi giữa bạn và JD nhà tuyển dụng đưa ra chưa thực sự đồng điệu như nhà tuyển dụng mong muốn, HR Voltria xin mong bạn thông cảm và tiếp tục hoạt động tại Voltria để HRs có thể tìm bạn trong talent pool của chúng tôi - nếu có bất kỳ khả năng ăn khớp nào với CV bạn - chúng tôi sẽ thông báo bạn ngay trong thời gian sớm nhất!</p>
                  <p>Một lần nữa cảm ơn bạn và mong bạn thông cảm,</p>
               </div>

               <div className="mt-20 pt-12 border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <p className="font-black text-2xl text-gray-900 mb-1 tracking-tight">HR Agent | Phạm Tuyết Nhi</p>
                    <p className="text-xs font-black text-purple-600 uppercase tracking-[0.4em]">Voltria Group 2025 | Đội ngũ HR Voltria</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-2xl">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
               </div>

               <button onClick={() => setSelectedLetter(null)} className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2.5rem] transition-all mt-16 text-xl shadow-2xl active:scale-95 uppercase tracking-widest">Đã hiểu</button>
            </div>
          </div>
        )}

        <div className="mt-auto pt-10 border-t border-gray-100">
          <button onClick={onClose} className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] hover:shadow-2xl hover:bg-black transition-all text-xl uppercase tracking-widest active:scale-95">Quay lại trang chủ</button>
        </div>
      </div>
    </div>
  );
};

export default MyActivities;
