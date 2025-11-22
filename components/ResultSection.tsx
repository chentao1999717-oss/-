
import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Download, Film, Image as ImageIcon, FileArchive, Grid, Clapperboard, Trash2, AlertCircle } from 'lucide-react';
import { GeneratedFrame } from '../types';

interface ResultSectionProps {
  frames: GeneratedFrame[];
  fps: number;
  onDeleteFrame?: (id: string) => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ frames, fps, onDeleteFrame }) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'preview' | 'grid'>('preview');
  const timerRef = useRef<number | null>(null);

  // Loop Logic
  useEffect(() => {
    if (frames.length === 0) return;
    
    // Ensure current index is valid if frames were deleted
    if (currentFrameIndex >= frames.length) {
        setCurrentFrameIndex(0);
    }

    if (viewMode === 'grid') {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
    }
    
    if (isPlaying && frames.length > 0) {
      timerRef.current = window.setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
      }, 1000 / fps);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [frames.length, isPlaying, fps, viewMode]);

  // Reset if frames array generates from scratch
  useEffect(() => {
    if (frames.length > 0 && currentFrameIndex === 0) {
       // Initial load logic if needed
    }
  }, [frames]); 

  if (frames.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full min-h-[500px] flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">3</div>
          <h2 className="text-lg font-semibold text-gray-800">生成结果</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
          <Film className="w-12 h-12 mb-3 opacity-20" />
          <p>预览画面将在这里显示</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">3</div>
            <h2 className="text-lg font-semibold text-gray-800">生成结果</h2>
            <span className="text-xs font-normal text-gray-400 ml-2">({frames.length} 帧)</span>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${viewMode === 'preview' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Clapperboard className="w-4 h-4" />
                预览
            </button>
            <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${viewMode === 'grid' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Grid className="w-4 h-4" />
                关键帧
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex-1 w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex flex-col">
        {viewMode === 'preview' ? (
            // Animation Preview
            <div className="relative w-full h-full bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] flex items-center justify-center">
                <div className="relative w-full h-full p-8 flex items-center justify-center">
                <img 
                    src={frames[currentFrameIndex]?.dataUrl} 
                    alt={`Frame ${currentFrameIndex + 1}`}
                    className="max-w-full max-h-full object-contain drop-shadow-xl transition-none" 
                />
                </div>

                {/* Frame Counter Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm text-sm font-medium text-gray-600 border border-gray-200">
                    Frame {currentFrameIndex + 1} / {frames.length}
                </div>

                {/* Play/Pause Overlay */}
                <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur hover:bg-white rounded-full shadow-sm transition-all border border-gray-200"
                >
                {isPlaying ? <Pause className="w-5 h-5 text-gray-700" /> : <Play className="w-5 h-5 text-gray-700 ml-0.5" />}
                </button>
            </div>
        ) : (
            // Keyframe Grid View
            <div className="w-full h-full overflow-y-auto p-4 custom-scrollbar bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                    {frames.map((frame, idx) => (
                        <div key={frame.id} className="group relative bg-white rounded-xl border border-gray-200 p-2 shadow-sm hover:shadow-md transition-all hover:border-brand-200">
                            
                            {/* Delete Button - Only visible on hover */}
                            {onDeleteFrame && frames.length > 1 && (
                                <button 
                                    onClick={() => onDeleteFrame(frame.id)}
                                    className="absolute -top-2 -right-2 z-10 bg-white text-red-500 p-1.5 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                    title="移除此帧"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <div className="aspect-square w-full bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] bg-gray-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden relative">
                                <img src={frame.dataUrl} alt={`Keyframe ${idx + 1}`} className="w-full h-full object-contain p-2" />
                                <div className="absolute top-1 left-1 w-5 h-5 bg-gray-900/10 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-700">
                                  {idx + 1}
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-xs font-medium text-gray-500">第 {idx + 1} 帧</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                {frames.length < 2 && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 text-xs bg-amber-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        <span>至少需要 2 帧才能预览动画</span>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Download Actions */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-green-50/50 hover:bg-green-50 hover:border-green-200 transition-all group">
          <Download className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-gray-800">下载 APNG</span>
          <span className="text-[10px] text-green-600 font-medium">最佳质量</span>
        </button>

        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-200 transition-all group">
          <ImageIcon className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-gray-800">下载 GIF</span>
          <span className="text-[10px] text-purple-600 font-medium">兼容性好</span>
        </button>

        <button className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all group">
          <FileArchive className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold text-gray-800">下载序列帧</span>
          <span className="text-[10px] text-blue-600 font-medium">PNG ZIP包</span>
        </button>
      </div>
    </div>
  );
};
