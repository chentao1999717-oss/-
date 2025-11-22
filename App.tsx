
import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { SettingsSection } from './components/SettingsSection';
import { ResultSection } from './components/ResultSection';
import { AnimationSettings, GeneratedFrame } from './types';
import { generateAnimationFrames } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<AnimationSettings>({
    prompt: '发送爱心',
    frameCount: 6,
    fps: 6,
    // scale removed
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFrames, setGeneratedFrames] = useState<GeneratedFrame[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedImage) return;
    if (!process.env.API_KEY) {
      setError("未找到 API Key。请配置环境变量。");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedFrames([]); // Clear previous

    try {
      const frames = await generateAnimationFrames(
        process.env.API_KEY,
        selectedImage,
        settings.prompt || "Simple idle motion",
        settings.frameCount
      );
      setGeneratedFrames(frames);
    } catch (err: any) {
      setError(err.message || "生成动画失败，请重试。");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDeleteFrame = (id: string) => {
    setGeneratedFrames(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <UploadSection 
              selectedImage={selectedImage} 
              onImageSelect={setSelectedImage} 
            />
            
            <SettingsSection 
              settings={settings} 
              onSettingsChange={setSettings}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              disabled={!selectedImage}
            />
          </div>

          {/* RIGHT COLUMN: Output */}
          <div className="lg:col-span-7 h-full">
            <ResultSection 
              frames={generatedFrames} 
              fps={settings.fps} 
              onDeleteFrame={handleDeleteFrame}
            />
          </div>

        </div>

        {/* Info / Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>ToonMotion 使用 Gemini 2.5 Flash Image 模型来理解角色并生成连贯的动作帧。</p>
        </div>
      </main>
    </div>
  );
};

export default App;
