
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Khối logo đã được gỡ bỏ tại đây */}

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-purple-100 text-purple-700 font-bold mb-8 shadow-sm backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <span className="text-sm tracking-wide uppercase">AI Career Intelligence Platform</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
          Nâng Tầm Tương Lai Với <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500">
            Trí Tuệ Voltria
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed font-medium">
          Khám phá tiềm năng thực sự trong hồ sơ của bạn. Voltria sử dụng AI thế hệ mới để định hướng lộ trình, kết nối dự án và xây dựng profile chuyên nghiệp.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={onStart}
            className="group flex items-center justify-center gap-2 bg-gray-900 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-purple-900 transition-all shadow-2xl hover:shadow-purple-200 hover:-translate-y-1 active:scale-95"
          >
            Phân Tích CV Ngay
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
          <div className="flex items-center gap-2 group cursor-default">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-purple-600">AI Feedback</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-purple-600">Career Roadmap</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-purple-600">Global Jobs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
