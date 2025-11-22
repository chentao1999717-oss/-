
import React from 'react';
import { Wand2 } from 'lucide-react';
import { AnimationSettings } from '../types';

interface SettingsSectionProps {
  settings: AnimationSettings;
  onSettingsChange: (settings: AnimationSettings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  disabled
}) => {
  
  const handleChange = (key: keyof AnimationSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">2</div>
        <h2 className="text-lg font-semibold text-gray-800">动画设置</h2>
      </div>

      <div className="space-y-5">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">动作提示词</label>
          <textarea
            value={settings.prompt}
            onChange={(e) => handleChange('prompt', e.target.value)}
            placeholder="例如：开心行走，施展魔法，跳跃..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none h-24"
          />
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">生成帧数</label>
             <select 
              value={settings.frameCount}
              onChange={(e) => handleChange('frameCount', Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500"
             >
               <option value={2}>2 帧 (快速)</option>
               <option value={4}>4 帧 (均衡)</option>
               <option value={6}>6 帧 (流畅)</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>播放速度</span>
                <span className="bg-gray-100 px-1.5 rounded text-xs text-gray-500 flex items-center">{settings.fps} FPS</span>
            </label>
            <div className="h-[42px] flex items-center">
                <input 
                type="range" 
                min="1" 
                max="12" 
                value={settings.fps}
                onChange={(e) => handleChange('fps', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
            </div>
          </div>
        </div>
        
        {/* Scale removed to ensure character consistency */}
        <div className="text-xs text-gray-400 italic">
            * 系统将自动保持角色原始大小和背景一致性
        </div>

      </div>

      {/* Generate Button */}
      <div className="mt-8 sticky bottom-4 z-10">
        <button
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-xl shadow-brand-500/20 transition-all
            ${disabled || isGenerating ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:scale-[1.02] active:scale-[0.98]'}`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>生成中...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>生成动画</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
