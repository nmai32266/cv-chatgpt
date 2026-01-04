
import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, FileText, Search, X } from 'lucide-react';
import { UploadState } from '../types';

// Cache pdfjs để tránh load nhiều lần
let pdfjsLib: any = null;

// Load pdf.js - ưu tiên từ window (đã load trong HTML), sau đó thử ESM
const loadPdfJs = async (): Promise<any> => {
  if (pdfjsLib) return pdfjsLib;
  
  // Version pdf.js để sử dụng
  const PDFJS_VERSION = '3.11.174';
  // Sử dụng unpkg cho worker vì có nhiều version hơn
  const WORKER_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
  
  // Kiểm tra xem đã có trên window chưa (từ script tag trong HTML)
  if ((window as any).pdfjsLib) {
    pdfjsLib = (window as any).pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
    return pdfjsLib;
  }
  
  // Thử từ global pdfjs
  if ((window as any).pdfjs) {
    pdfjsLib = (window as any).pdfjs;
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
    return pdfjsLib;
  }
  
  // Thử import từ ESM (từ importmap)
  try {
    const pdfjsModule = await import('pdfjs-dist');
    pdfjsLib = pdfjsModule.default || pdfjsModule;
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;
    return pdfjsLib;
  } catch (error) {
    console.error('Lỗi load pdfjs:', error);
    throw new Error('Không thể load thư viện PDF.js. Vui lòng kiểm tra kết nối mạng.');
  }
};

/**
 * Chuyển đổi PDF sang PNG sử dụng pdf.js từ CDN
 * @param file - File PDF
 * @returns Promise<string> - Base64 string của PNG
 */
const convertPdfToPng = async (file: File): Promise<string> => {
  try {
    console.log('Bắt đầu chuyển đổi PDF:', file.name);
    
    // Load pdfjs
    const pdfjs = await loadPdfJs();
    console.log('Đã load pdfjs:', !!pdfjs);
    
    if (!pdfjs || !pdfjs.getDocument) {
      throw new Error('pdfjs không có method getDocument');
    }
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('Đã đọc file, kích thước:', arrayBuffer.byteLength);
    
    // Load PDF document
    const loadingTask = pdfjs.getDocument({ 
      data: arrayBuffer,
      verbosity: 0 // Giảm log
    });
    
    const pdf = await loadingTask.promise;
    console.log('Đã load PDF, số trang:', pdf.numPages);
    
    if (pdf.numPages === 0) {
      throw new Error('PDF không có trang nào');
    }
    
    // Lấy trang đầu tiên
    const page = await pdf.getPage(1);
    console.log('Đã lấy trang đầu tiên');
    
    // Tính toán viewport với scale phù hợp
    const scale = 2.0; // Scale cao hơn cho chất lượng tốt
    const viewport = page.getViewport({ scale });
    console.log('Viewport size:', viewport.width, 'x', viewport.height);
    
    // Tạo canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Không thể tạo canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    console.log('Canvas size:', canvas.width, 'x', canvas.height);
    
    // Render PDF page vào canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    console.log('Bắt đầu render PDF vào canvas...');
    await page.render(renderContext).promise;
    console.log('Đã render xong');
    
    // Chuyển canvas thành base64 PNG
    const dataUrl = canvas.toDataURL('image/png');
    const base64Content = dataUrl.split(',')[1];
    
    if (!base64Content || base64Content.length === 0) {
      throw new Error('Không thể tạo ảnh từ canvas');
    }
    
    console.log('Đã tạo PNG, kích thước base64:', base64Content.length);
    return base64Content;
  } catch (error) {
    console.error('Lỗi chuyển đổi PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
    throw new Error(
      `Không thể chuyển đổi PDF sang ảnh: ${errorMessage}. ` +
      `Vui lòng thử lại hoặc chuyển PDF sang ảnh thủ công (chụp màn hình hoặc xuất PDF sang PNG/JPG).`
    );
  }
};


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

    try {
      let base64Content: string;
      let finalMimeType: string;
      let finalFileName: string = file.name;

      // Kiểm tra nếu là PDF, chuyển đổi sang PNG
      const isPdf = file.type === 'application/pdf' || 
                    file.name.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        // Chuyển PDF sang PNG
        base64Content = await convertPdfToPng(file);
        finalMimeType = 'image/png';
        finalFileName = file.name.replace(/\.pdf$/i, '.png');
      } else {
        // Normalize MIME type for iOS compatibility
        let normalizedMimeType = file.type;
        if (!normalizedMimeType || normalizedMimeType === '' || normalizedMimeType === 'application/octet-stream') {
          const fileName = file.name.toLowerCase();
          if (fileName.endsWith('.png')) {
            normalizedMimeType = 'image/png';
          } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            normalizedMimeType = 'image/jpeg';
          } else if (fileName.endsWith('.webp')) {
            normalizedMimeType = 'image/webp';
          } else {
            normalizedMimeType = 'image/png'; // Default fallback
          }
        }
        
        // Normalize jpg to jpeg for consistency
        if (normalizedMimeType === 'image/jpg') {
          normalizedMimeType = 'image/jpeg';
        }

        finalMimeType = normalizedMimeType;

        // Use Promise-based FileReader for better error handling on iOS
        base64Content = await new Promise<string>((resolve, reject) => {
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
      }
      
      onAnalyze({
        fileData: base64Content,
        targetJob: targetJob,
        mimeType: finalMimeType,
        fileName: finalFileName
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
