
import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a162e] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">Voltria</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Nền tảng kết nối sinh viên với doanh nghiệp, giúp bạn khởi đầu sự nghiệp thành công thông qua trí tuệ nhân tạo và dữ liệu thực tế.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 hover:bg-purple-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 hover:bg-purple-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 hover:bg-purple-600 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Sản phẩm</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Quét CV</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Dự án thực tế</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Blog kinh nghiệm</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Công ty</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Về chúng tôi</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Đội ngũ</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Liên hệ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="hover:text-purple-400 cursor-pointer transition-colors">FAQ</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Bảo mật</li>
              <li className="hover:text-purple-400 cursor-pointer transition-colors">Điều khoản</li>
            </ul>
          </div>

        </div>

        {/* Contact Strip */}
        <div className="border-y border-white/5 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm font-medium">voltriagroup@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-sm font-medium">0343362453</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-sm font-medium">Tp. HCM, Việt Nam</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <p>© 2024 Voltria AI. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Chính sách bảo mật</span>
            <span className="hover:text-white cursor-pointer transition-colors">Điều khoản dịch vụ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
