
import React, { useState } from 'react';
import { ActivityItem, ApplicationStatus } from '../types';
import { ShieldCheck, User, Briefcase, Calendar, CheckCircle, XCircle, Clock, Trash2, Eye, FileText, X } from 'lucide-react';

interface HRDashboardProps {
  applications: ActivityItem[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
  hrUser: any;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ applications, onUpdateStatus, hrUser, onDelete }) => {
  const [viewingCV, setViewingCV] = useState<ActivityItem | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Profile */}
      <div className="bg-slate-900 rounded-[4rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center gap-8">
             <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-xl">
               <ShieldCheck className="w-12 h-12 text-white" />
             </div>
             <div className="text-center md:text-left">
               <h2 className="text-4xl font-black tracking-tight">{hrUser.name}</h2>
               <p className="text-purple-400 font-bold uppercase tracking-[0.3em] text-xs mt-2 italic">{hrUser.role} @ VOLTRIA ORGANIZATION</p>
             </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-10 py-6 rounded-[2.5rem] border border-white/10 text-center">
             <p className="text-purple-300 font-black text-xs uppercase tracking-widest mb-1">Total Applications</p>
             <p className="text-4xl font-black">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* Talent Pool Table */}
      <div className="bg-white rounded-[4rem] p-10 md:p-14 shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between mb-12">
           <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase flex items-center gap-4">
             <Briefcase className="w-8 h-8 text-purple-600" /> Talent Pool
           </h3>
           <div className="flex gap-4">
              <div className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-xl text-xs font-black uppercase border border-yellow-100">Reviewing</div>
              <div className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black uppercase border border-green-100">Approved</div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-6 text-xs font-black uppercase tracking-widest text-gray-400 pl-4">Candidate</th>
                <th className="pb-6 text-xs font-black uppercase tracking-widest text-gray-400">Target Role</th>
                <th className="pb-6 text-xs font-black uppercase tracking-widest text-gray-400">Date Applied</th>
                <th className="pb-6 text-xs font-black uppercase tracking-widest text-gray-400 text-center">Current Status</th>
                <th className="pb-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 font-medium italic">Hiện chưa có ứng viên nào ứng tuyển cho tổ chức của bạn.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-8 pl-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-black">
                          {app.candidateName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{app.candidateName || 'Candidate'}</p>
                          <p className="text-xs text-gray-400 font-medium">Verified Talent</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8">
                      <p className="font-bold text-gray-800">{app.name}</p>
                      <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest">{app.provider}</p>
                    </td>
                    <td className="py-8">
                      <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <Calendar className="w-4 h-4" /> {app.appliedDate}
                      </div>
                    </td>
                    <td className="py-8 text-center">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        app.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-8 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        {app.cvFileContent && (
                          <button 
                            onClick={() => setViewingCV(app)}
                            className="p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                            title="View CV"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'approved')}
                          className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(app.id, 'rejected')}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        {onDelete && (
                          <button onClick={() => onDelete(app.id)} className="p-3 text-gray-300 hover:text-gray-900 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CV Preview Modal */}
      {viewingCV && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl h-[90vh] shadow-2xl relative flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><FileText className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase">CV Review: {viewingCV.candidateName}</h3>
                  <p className="text-xs font-bold text-gray-400">Apply for: {viewingCV.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingCV(null)} 
                className="p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-full border border-gray-100 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 bg-gray-200 overflow-auto p-8 flex justify-center items-start">
              {viewingCV.cvMimeType?.includes('image') ? (
                <img 
                  src={`data:${viewingCV.cvMimeType};base64,${viewingCV.cvFileContent}`} 
                  alt="CV Preview" 
                  className="max-w-full shadow-2xl rounded-lg"
                />
              ) : (
                <iframe 
                  src={`data:${viewingCV.cvMimeType};base64,${viewingCV.cvFileContent}#toolbar=0`} 
                  className="w-full h-full rounded-lg shadow-2xl bg-white"
                  title="PDF CV Preview"
                />
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-center gap-6 bg-slate-50">
               <button 
                  onClick={() => { onUpdateStatus(viewingCV.id, 'approved'); setViewingCV(null); }}
                  className="px-10 py-4 bg-green-600 text-white font-black rounded-2xl shadow-lg hover:bg-green-700 transition-all"
               >
                 Approve Applicant
               </button>
               <button 
                  onClick={() => { onUpdateStatus(viewingCV.id, 'rejected'); setViewingCV(null); }}
                  className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg hover:bg-red-700 transition-all"
               >
                 Reject Applicant
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HRDashboard;
