
import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, FileText, Search, X } from 'lucide-react';
import { UploadState } from '../types';

interface UploadSectionProps {
  onAnalyze: (state: UploadState) => void;
  isAnalyzing: boolean;
  initialJob?: string;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isAnalyzing, initialJob = '' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [targetJob, setTargetJob] = useState(initialJob);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialJob) {
      setTargetJob(initialJob);
    }
  }, [initialJob]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    // iOS Safari sometimes returns different MIME types, so we check both type and extension
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
    const fileName = selectedFile.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Check both MIME type and file extension for iOS compatibility
    const isValidType = validTypes.includes(selectedFile.type) || 
                       validTypes.includes(selectedFile.type.toLowerCase()) ||
                       validExtensions.includes(fileExtension);
    
    if (!isValidType) {
      setError("Vui lòng tải lên tệp PDF hoặc Hình ảnh (PNG, JPG).");
      setFile(null);
      return;
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError("Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 10MB.");
      setFile(null);
      return;
    }
    
    setError(null);
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Vui lòng tải lên CV trước.");
      return;
    }

    setError(null);

    // Normalize MIME type for iOS compatibility
    let normalizedMimeType = file.type;
    if (!normalizedMimeType || normalizedMimeType === '' || normalizedMimeType === 'application/octet-stream') {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.pdf')) {
        normalizedMimeType = 'application/pdf';
      } else if (fileName.endsWith('.png')) {
        normalizedMimeType = 'image/png';
      } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        normalizedMimeType = 'image/jpeg';
      } else if (fileName.endsWith('.webp')) {
        normalizedMimeType = 'image/webp';
      } else {
        normalizedMimeType = 'application/pdf'; // Default fallback
      }
    }
    
    // Normalize jpg to jpeg for consistency
    if (normalizedMimeType === 'image/jpg') {
      normalizedMimeType = 'image/jpeg';
    }

    // Use Promise-based FileReader for better error handling on iOS
    try {
      const base64Content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
          const base64String = reader.result as string;
          if (!base64String || !base64String.includes(',')) {
            reject(new Error("Không thể đọc tệp. Vui lòng thử lại."));
            return;
          }
          const content = base64String.split(',')[1];
          if (!content || content.length === 0) {
            reject(new Error("Tệp rỗng hoặc không hợp lệ."));
            return;
          }
          resolve(content);
        };
        
        reader.onerror = () => {
          reject(new Error("Không thể đọc tệp. Vui lòng thử lại với tệp khác."));
        };
        
        reader.onabort = () => {
          reject(new Error("Đã hủy đọc tệp."));
        };
        
        // Start reading the file
        reader.readAsDataURL(file);
      });
      
      onAnalyze({
        fileData: base64Content,
        targetJob: targetJob,
        mimeType: normalizedMimeType,
        fileName: file.name
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể đọc tệp. Vui lòng thử lại.";
      setError(errorMessage);
      console.error("File read error:", err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-20" id="upload-area">
      <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sẵn Sàng Phân Tích?</h2>

        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
              Vị trí ứng tuyển (Tùy chọn)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="ví dụ: Senior Product Designer, Lập trình viên React..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div 
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 text-center ${
              dragActive 
                ? "border-purple-500 bg-purple-50 scale-[1.02]" 
                : "border-gray-300 hover:border-purple-400 bg-white/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ touchAction: 'manipulation' }}
          >
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              onChange={handleChange}
              accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/jpg,image/webp"
              multiple={false}
            />
            
            {!file ? (
              <div 
                className="flex flex-col items-center cursor-pointer" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (inputRef.current) {
                    setTimeout(() => {
                      inputRef.current?.click();
                    }, 0);
                  }
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                }}
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium text-gray-700">
                  {typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
                    ? "Nhấp để chọn tệp từ thiết bị" 
                    : "Nhấp để tải lên hoặc kéo thả vào đây"}
                </p>
                <p className="text-sm text-gray-500 mt-2">PDF, PNG, JPG (Tối đa 10MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isAnalyzing || !file}
            className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
              isAnalyzing || !file
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-200 hover:-translate-y-0.5"
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang Phân Tích Hồ Sơ...
              </>
            ) : (
              "Bắt Đầu Đánh Giá"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
