import React from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const apiKey = process.env.API_KEY;
  const isConnected = !!apiKey;

  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Zap className="text-white w-6 h-6 fill-current" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">ToonMotion</h1>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Powered by Gemini</span>
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${isConnected ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
        <CheckCircle2 className="w-4 h-4" />
        <span>{isConnected ? '已连接' : '未配置 API Key'}</span>
      </div>
    </header>
  );
};