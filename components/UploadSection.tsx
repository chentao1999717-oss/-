import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { PRESET_IMAGES, PresetImage } from '../types';
import { urlToBase64, fileToBase64 } from '../utils/fileUtils';

interface UploadSectionProps {
  selectedImage: string | null;
  onImageSelect: (base64: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ selectedImage, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        onImageSelect(base64);
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  const handlePresetClick = async (preset: PresetImage) => {
    try {
      const base64 = await urlToBase64(preset.url);
      onImageSelect(base64);
    } catch (err) {
      console.error("Error loading preset", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">1</div>
        <h2 className="text-lg font-semibold text-gray-800">上传角色图片</h2>
      </div>

      <div 
        className={`relative w-full aspect-[4/3] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden group cursor-pointer
          ${selectedImage ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'}`}
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedImage ? (
          <img src={selectedImage} alt="Character" className="w-full h-full object-contain p-4" />
        ) : (
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-orange-100 text-brand-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-gray-600 font-medium">点击上传角色图片</p>
            <p className="text-gray-400 text-sm mt-1">支持 PNG, JPG 格式</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {/* Presets */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">或选择预设角色</p>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {PRESET_IMAGES.map((preset) => (
            <button
              key={preset.id}
              onClick={(e) => { e.stopPropagation(); handlePresetClick(preset); }}
              className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:ring-2 hover:ring-brand-500 transition-all flex-shrink-0 group"
              title={preset.label}
            >
              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};