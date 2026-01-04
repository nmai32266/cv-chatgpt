
import React, { useState } from 'react';
import Hero from './Hero';
import Marquee from './Marquee';
import { 
  Users, BookOpen, Calendar, Target, ShieldCheck, Cpu, 
  Briefcase, GraduationCap, X, CheckCircle2, ArrowRight, 
  Star, Award, MessageSquare, Zap, Linkedin, Github, Mail,
  Medal, Crown, Shield
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

interface FeatureDetail {
  id: string;
  title: string;
  // Use React.ReactElement instead of React.ReactNode to allow for cloning with props
  icon: React.ReactElement;
  color: string;
  description: string;
  benefits: string[];
  ctaText: string;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  initials: string;
  links: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(null);

  const teamMembers: TeamMember[] = [
    {
      name: "Trần Nguyễn Giang Nam",
      role: "Developer",
      initials: "GN",
      description: "Chuyên gia phát triển hệ thống và tối ưu hóa trải nghiệm người dùng.",
      links: { linkedin: "#", github: "#", email: "mailto:nam@voltria.com" }
    },
    {
      name: "Ngô Phước Thành",
      role: "Developer & Finance Officer",
      initials: "PT",
      description: "Quản lý tài chính và phát triển kiến trúc backend bền vững.",
      links: { linkedin: "#", github: "#", email: "mailto:thanh@voltria.com" }
    },
    {
      name: "Lê Trần Kim Ngân",
      role: "Art Director",
      initials: "KN",
      description: "Người thổi hồn vào ngôn ngữ thiết kế và nhận diện thương hiệu Voltria.",
      links: { linkedin: "#", github: "#", email: "mailto:ngan.le@voltria.com" }
    },
    {
      name: "Phạm Tuyết Nhi",
      role: "Product Manager",
      initials: "TN",
      description: "Định hướng chiến lược sản phẩm và kết nối nhu cầu người dùng.",
      links: { linkedin: "#", github: "#", email: "mailto:nhi@voltria.com" }
    },
    {
      name: "Trần Thị Kim Ngân",
      role: "Product Manager",
      initials: "KN",
      description: "Tối ưu hóa quy trình vận hành và phát triển hệ sinh thái đối tác.",
      links: { linkedin: "#", github: "#", email: "mailto:ngan.tran@voltria.com" }
    },
    {
      name: "Nguyễn Tấn Trung",
      role: "Developer & Product Manager",
      initials: "TT",
      description: "Cầu nối giữa kỹ thuật và kinh doanh, đảm bảo sản phẩm luôn đột phá.",
      links: { linkedin: "#", github: "#", email: "mailto:trung@voltria.com" }
    }
  ];

  const featureDetails: Record<string, FeatureDetail> = {
    mentor: {
      id: 'mentor',
      title: 'Hỗ trợ định hướng 1-1 cùng mentor',
      icon: <Users className="w-10 h-10 text-purple-600" />,
      color: 'purple',
      description: 'Chương trình Mentorship tại Voltria kết nối bạn với những chuyên gia có trên 5 năm kinh nghiệm tại các tập đoàn lớn.',
      benefits: ['Kết nối trực tiếp Senior Lead', 'Review CV chuyên sâu', 'Luyện phỏng vấn 1-1', 'Định hướng lộ trình 3-5 năm'],
      ctaText: 'Tìm Mentor của bạn'
    },
    course: {
      id: 'course',
      title: 'Khóa học nâng cao nghề nghiệp',
      icon: <BookOpen className="w-10 h-10 text-indigo-600" />,
      color: 'indigo',
      description: 'Hệ thống bài giảng thực chiến tập trung vào các kỹ năng thị trường đang "khát".',
      benefits: ['Khóa học Full-stack & AI', 'Kỹ năng mềm môi trường Global', 'Chứng chỉ quốc tế', 'Thực hành dự án thật'],
      ctaText: 'Khám phá khóa học'
    },
    event: {
      id: 'event',
      title: 'Dự thảo và sự kiện hiện tại',
      icon: <Calendar className="w-10 h-10 text-pink-600" />,
      color: 'pink',
      description: 'Cập nhật chuyển động mới nhất của thị trường lao động và các sự kiện networking.',
      benefits: ['Workshop hàng tuần', 'Career Fair trực tuyến', 'Dự án Freelance mới nhất', 'Cộng đồng 10.000+ sinh viên'],
      ctaText: 'Xem lịch sự kiện'
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Hero onStart={onStart} />
      <Marquee />

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-purple-600 tracking-wide uppercase mb-2">Hệ Sinh Thái Voltria</h2>
            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Giải Pháp Toàn Diện Cho Sự Nghiệp</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(featureDetails).map((f) => (
              <button 
                key={f.id}
                onClick={() => setSelectedFeature(f)}
                className="group text-left bg-slate-50 rounded-3xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-purple-200 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 ${
                  f.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-600' : 
                  f.color === 'indigo' ? 'bg-indigo-100 group-hover:bg-indigo-600' : 'bg-pink-100 group-hover:bg-pink-600'
                }`}>
                  {/* Fixed: Use React.ReactElement<any> to avoid TS error when injecting className during cloning */}
                  {React.cloneElement(f.icon as React.ReactElement<any>, { className: `w-7 h-7 group-hover:text-white transition-colors` })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-2">{f.description}</p>
                <span className="inline-flex items-center gap-2 text-purple-600 font-bold text-sm">
                  Xem chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden relative border border-white/20">
            <div className={`h-40 w-full relative flex items-center justify-center bg-gradient-to-br ${
              selectedFeature.color === 'purple' ? 'from-purple-600 to-indigo-700' :
              selectedFeature.color === 'indigo' ? 'from-indigo-600 to-blue-700' : 'from-pink-600 to-rose-700'
            }`}>
              <button onClick={() => setSelectedFeature(null)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md z-20"><X className="w-6 h-6" /></button>
              <div className="relative z-10 p-6 bg-white rounded-3xl shadow-xl transform -translate-y-2">{selectedFeature.icon}</div>
            </div>
            <div className="p-8 md:p-12">
              <h3 className="text-3xl font-black text-gray-900 mb-4">{selectedFeature.title}</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">{selectedFeature.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {selectedFeature.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className={`w-5 h-5 ${selectedFeature.color === 'purple' ? 'text-purple-600' : selectedFeature.color === 'indigo' ? 'text-indigo-600' : 'text-pink-600'}`} />
                    <span className="text-sm font-bold text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => { setSelectedFeature(null); onStart(); }} className={`flex-1 py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 ${selectedFeature.color === 'purple' ? 'bg-purple-600' : selectedFeature.color === 'indigo' ? 'bg-indigo-600' : 'bg-pink-600'}`}>{selectedFeature.ctaText}<Zap className="w-5 h-5 fill-current" /></button>
                <button onClick={() => setSelectedFeature(null)} className="px-8 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold">Quay lại</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About & Honor Board Section */}
      <section id="about" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-20">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic">
              "Voltria là một nền tảng kỹ thuật số đóng vai trò như một cầu nối, liên kết một cách liền mạch giữa sinh viên đang tìm kiếm kinh nghiệm thực tế với các doanh nghiệp và tổ chức cần nguồn nhân lực trẻ trung."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8">
              <h3 className="text-4xl font-black flex items-center gap-4">
                <Medal className="w-10 h-10 text-purple-500" />
                Dành cho Sinh viên
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                  <Target className="w-8 h-8 text-cyan-400 shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Hồ sơ Thông minh & Ghép đôi</h4>
                    <p className="text-gray-400">Tạo hồ sơ chi tiết với các kỹ năng, sở thích và nền tảng học vấn. Nhận đề xuất thực tập/dự án được cá nhân hóa.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Trung tâm Ứng tuyển Thống nhất</h4>
                    <p className="text-gray-400">Tìm kiếm và ứng tuyển vào vô số cơ hội từ các công ty khác nhau thông qua một giao diện đơn giản, thống nhất.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-cyan-500/40 z-10"></div>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale opacity-50" alt="Students" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                 <div className="bg-white/10 backdrop-blur-xl p-10 rounded-full border border-white/20 animate-pulse">
                    <GraduationCap className="w-20 h-20 text-white" />
                 </div>
              </div>
            </div>
          </div>

          {/* Honor Board (Vinh Danh) - NEW DESIGN */}
          <div className="mt-32 border-t border-white/10 pt-24">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-3 px-6 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 font-bold mb-6">
                <Crown className="w-5 h-5" />
                <span className="uppercase tracking-[0.2em] text-xs">Honorary Board</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Ban Điều Hành & Sáng Lập</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="group relative">
                  {/* Decorative Background Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-[2rem] opacity-0 group-hover:opacity-20 transition duration-500 blur-xl"></div>
                  
                  <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-all duration-300 flex flex-col items-center text-center">
                    
                    {/* Initials Placeholder instead of Photo */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-400/20 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      <span className="text-2xl font-black text-white tracking-tighter opacity-80 group-hover:opacity-100">{member.initials}</span>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors uppercase tracking-tight">{member.name}</h3>
                      <div className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                        <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">{member.role}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed mb-8 h-12 line-clamp-2 italic">
                      "{member.description}"
                    </p>

                    <div className="flex gap-4 mt-auto">
                      <a href={member.links.linkedin} className="p-2.5 bg-white/5 hover:bg-purple-600 rounded-xl transition-all border border-white/5 hover:border-purple-400">
                        <Linkedin className="w-4 h-4 text-gray-300" />
                      </a>
                      <a href={member.links.github} className="p-2.5 bg-white/5 hover:bg-gray-700 rounded-xl transition-all border border-white/5 hover:border-gray-400">
                        <Github className="w-4 h-4 text-gray-300" />
                      </a>
                      <a href={member.links.email} className="p-2.5 bg-white/5 hover:bg-indigo-600 rounded-xl transition-all border border-white/5 hover:border-indigo-400">
                        <Mail className="w-4 h-4 text-gray-300" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
               <div className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium">
                 <Shield className="w-4 h-4" />
                 <span>Cam kết dẫn đầu xu hướng công nghệ & tuyển dụng AI tại Việt Nam.</span>
               </div>
            </div>
          </div>

          <div className="mt-32 bg-white text-gray-900 rounded-[3rem] p-12 border border-white/10 relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-10 items-center">
             <div className="shrink-0 bg-purple-600 p-8 rounded-3xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
               <Cpu className="w-16 h-16 text-white" />
             </div>
             <div>
               <p className="text-xl md:text-2xl leading-relaxed font-bold tracking-tight">
                 Voltria không chỉ là trang tuyển dụng. Chúng tôi là <span className="text-purple-600">tương lai của sự nghiệp</span> với thuật toán ghép đôi AI độc quyền, giúp sinh viên chạm tới dự án thực tế nhanh nhất.
               </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
