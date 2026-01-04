import React from 'react';
import { Star, Zap, Hash, Globe } from 'lucide-react';

const Marquee: React.FC = () => {
  const content1 = [
    "VOLTRIA AI", "PHÂN TÍCH CV", "ĐỊNH HƯỚNG SỰ NGHIỆP", "KẾT NỐI VIỆC LÀM", "PHÁT TRIỂN KỸ NĂNG"
  ];
  
  const content2 = [
    "DỰ ÁN THỰC TẾ", "MENTOR 1-1", "CƠ HỘI THỰC TẬP", "PROFILE CHUYÊN NGHIỆP", "AI POWERED"
  ];

  const content3 = [
    "INTERNSHIP", "GLOBAL JOBS", "NETWORKING", "GROWTH HACKING", "SUCCESS", "LEADERSHIP"
  ];

  const content4 = [
    "STARTUP", "INNOVATION", "TECHNOLOGY", "FUTURE READY", "SKILL UP", "CONNECT"
  ];

  // Helper to repeat content for smooth loop
  const getRepeatedContent = (items: string[]) => [...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full h-64 overflow-hidden bg-transparent z-20 -mt-24 mb-12 flex items-center justify-center pointer-events-none select-none">
      
      {/* Strip 3: Deep Background, Blue/Cyan, Rotated -2deg, Lower opacity */}
      <div className="absolute w-[120%] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500 shadow-lg transform -rotate-[2deg] py-2 border-y border-white/20 opacity-90 top-[35%] z-0">
         <div className="flex overflow-hidden">
            <div className="animate-marquee flex items-center gap-8 pl-4 min-w-full">
              {getRepeatedContent(content3).map((text, idx) => (
                <div key={idx} className="flex items-center gap-8 shrink-0">
                  <span className="text-lg font-bold text-white/90 uppercase tracking-wider">
                    {text}
                  </span>
                  <Globe className="w-4 h-4 text-cyan-200" />
                </div>
              ))}
            </div>
         </div>
      </div>

       {/* Strip 4: Deep Background, Pink/Red, Rotated 8deg */}
      <div className="absolute w-[120%] bg-gradient-to-r from-rose-500 via-pink-600 to-fuchsia-600 shadow-lg transform rotate-[8deg] py-2 border-y border-white/20 opacity-90 bottom-[30%] z-0">
         <div className="flex overflow-hidden">
            <div className="animate-marquee-reverse flex items-center gap-8 pl-4 min-w-full">
              {getRepeatedContent(content4).map((text, idx) => (
                <div key={idx} className="flex items-center gap-8 shrink-0">
                  <span className="text-lg font-bold text-white/90 uppercase tracking-wider">
                    {text}
                  </span>
                  <Hash className="w-4 h-4 text-pink-200" />
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* Strip 1: Foreground, Bottom, Yellow/Orange, Rotated 4deg */}
      <div className="absolute w-[120%] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-xl transform rotate-[4deg] py-3 border-y-2 border-white/30 backdrop-blur-sm z-10">
         <div className="flex overflow-hidden">
            <div className="animate-marquee-reverse flex items-center gap-8 pl-4 min-w-full">
              {getRepeatedContent(content2).map((text, idx) => (
                <div key={idx} className="flex items-center gap-8 shrink-0">
                  <span className="text-xl font-black text-white uppercase tracking-widest italic drop-shadow-sm">
                    {text}
                  </span>
                  <Zap className="w-5 h-5 text-purple-800 fill-purple-800 shrink-0" />
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* Strip 2: Foreground, Top, Purple/Pink, Rotated -4deg */}
      <div className="absolute w-[120%] bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 shadow-2xl transform -rotate-[4deg] py-4 border-y-2 border-white/30 backdrop-blur-md z-20">
        <div className="flex overflow-hidden">
            <div className="animate-marquee flex items-center gap-8 pl-4 min-w-full">
               {getRepeatedContent(content1).map((text, idx) => (
                <div key={idx} className="flex items-center gap-8 shrink-0">
                  <span className="text-2xl font-black text-white uppercase tracking-widest italic drop-shadow-md">
                    {text}
                  </span>
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
                </div>
              ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default Marquee;