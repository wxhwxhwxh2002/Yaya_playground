import React, { useState } from 'react';
import { GameMode, AppSettings, DetectionMode, GameAssets, BackgroundSetting } from './types';
import { DEFAULT_ASSETS, BACKGROUND_PRESETS } from './constants';
import { usePeckDetection } from './hooks/usePeckDetection';
import { PeckTheBug } from './components/Games/PeckTheBug';
import { FallingFruit } from './components/Games/FallingFruit';
import { Screensaver } from './components/Games/Screensaver';
import { audioGen } from './services/audioGenService';

// Icons
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [activeGame, setActiveGame] = useState<GameMode>(GameMode.PECK_THE_BUG);
  const [assets, setAssets] = useState<GameAssets>(DEFAULT_ASSETS);
  const [peckTriggerCount, setPeckTriggerCount] = useState(0);
  
  const [config, setConfig] = useState<AppSettings>({
    soundThreshold: 0.2, // Lowered default slightly for better UX
    vibrationThreshold: 5.0,
    detectionMode: DetectionMode.MIXED,
    debugMode: true
  });

  const handlePeck = (source: string) => {
    setPeckTriggerCount(c => c + 1);
    
    // Sound Feedback
    if (source === 'sound') audioGen.playPeckSound();
    else audioGen.playPopSound();
    
    // Global visual flash
    const flash = document.getElementById('global-flash');
    if (flash) {
        flash.style.opacity = '0.3';
        setTimeout(() => flash.style.opacity = '0', 150);
    }
  };

  const { initAudio, requestMotionPermission, micPermission, motionPermission, handleTouch } = usePeckDetection({
    settings: config,
    onPeck: handlePeck,
    isActive: !settingsOpen
  });

  const changeBackground = (bg: BackgroundSetting) => {
      setAssets(prev => ({ ...prev, background: bg }));
  };

  const toggleSettings = () => {
      setSettingsOpen(!settingsOpen);
      if (settingsOpen) {
          audioGen.resume();
      }
  };

  return (
    <div className="relative w-full h-full overflow-hidden" onClick={handleTouch}>
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ 
            backgroundColor: assets.background.type === 'color' ? assets.background.value : '#000',
            backgroundImage: assets.background.type === 'image' ? `url(${assets.background.value})` : 'none',
            filter: assets.background.type === 'image' ? 'brightness(0.7)' : 'none'
        }}
      />

      {/* Global Visual Feedback Layer */}
      <div id="global-flash" className="absolute inset-0 bg-white pointer-events-none opacity-0 transition-opacity duration-75 z-20 mix-blend-overlay"></div>

      {/* Game Stage */}
      <main className="absolute inset-0 z-10">
        {activeGame === GameMode.PECK_THE_BUG && <PeckTheBug assets={assets} peckTrigger={peckTriggerCount} />}
        {activeGame === GameMode.FALLING_FRUIT && <FallingFruit assets={assets} peckTrigger={peckTriggerCount} />}
        {activeGame === GameMode.SCREENSAVER && <Screensaver assets={assets} peckTrigger={peckTriggerCount} />}
      </main>

      {/* Settings Toggle */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleSettings(); }}
        className="absolute top-4 left-4 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white/80 hover:bg-white/30 transition-all shadow-lg border border-white/10"
      >
        {settingsOpen ? <CloseIcon /> : <CogIcon />}
      </button>

      {/* Settings Overlay */}
      {settingsOpen && (
        <div className="absolute inset-0 z-40 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="max-w-md w-full space-y-6 text-white pb-10">
            
            <div className="text-center space-y-1">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
                    鸦鸦游乐场
                </h1>
                <p className="text-slate-400 text-xs tracking-wider uppercase">Interactive Corvid Playground</p>
            </div>

            {/* Input Permissions */}
            <div className="bg-slate-800/50 p-4 rounded-xl space-y-4 border border-slate-700/50">
                <h2 className="font-semibold text-sm text-slate-300 uppercase tracking-wide">传感器开关</h2>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={initAudio}
                        className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${micPermission === 'granted' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/50' : 'bg-slate-700 hover:bg-slate-600'}`}
                    >
                        {micPermission === 'granted' ? '麦克风 (听)' : '开启麦克风'}
                    </button>
                    <button 
                        onClick={requestMotionPermission}
                        className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${motionPermission === 'granted' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/50' : 'bg-slate-700 hover:bg-slate-600'}`}
                    >
                        {motionPermission === 'granted' ? '震动 (感)' : '开启震动'}
                    </button>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-700/50">
                    <div>
                        <label className="flex justify-between text-xs mb-2 text-slate-400">
                            <span>声音阈值</span>
                            <span>{Math.round(config.soundThreshold * 100)}%</span>
                        </label>
                        <input 
                            type="range" min="0.01" max="0.8" step="0.01"
                            value={config.soundThreshold}
                            onChange={(e) => setConfig({...config, soundThreshold: parseFloat(e.target.value)})}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                        />
                    </div>
                    <div>
                        <label className="flex justify-between text-xs mb-2 text-slate-400">
                            <span>震动阈值</span>
                            <span>{config.vibrationThreshold.toFixed(1)}</span>
                        </label>
                        <input 
                            type="range" min="1.0" max="15.0" step="0.5"
                            value={config.vibrationThreshold}
                            onChange={(e) => setConfig({...config, vibrationThreshold: parseFloat(e.target.value)})}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                        />
                    </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">触发模式</span>
                        <select 
                            value={config.detectionMode}
                            onChange={(e) => setConfig({...config, detectionMode: e.target.value as DetectionMode})}
                            className="bg-slate-700 border-none rounded px-2 py-1 text-white text-xs focus:ring-1 focus:ring-yellow-400 outline-none"
                        >
                            <option value={DetectionMode.MIXED}>混合 (Sound + Vib)</option>
                            <option value={DetectionMode.SOUND}>仅声音</option>
                            <option value={DetectionMode.VIBRATION}>仅震动</option>
                            <option value={DetectionMode.TOUCH}>仅触摸 (测试)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Game Selection */}
            <div className="space-y-2">
                <h2 className="font-semibold text-sm text-slate-300 uppercase tracking-wide px-1">选择游戏</h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: GameMode.PECK_THE_BUG, label: '啄虫子', icon: '🐛' },
                        { id: GameMode.FALLING_FRUIT, label: '掉果子', icon: '🍎' },
                        { id: GameMode.SCREENSAVER, label: '屏保', icon: '✨' },
                    ].map(g => (
                        <button
                            key={g.id}
                            onClick={() => setActiveGame(g.id)}
                            className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all border ${
                                activeGame === g.id 
                                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                            }`}
                        >
                            <span className="text-2xl filter drop-shadow-md">{g.icon}</span>
                            <span className="text-xs font-bold">{g.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Background Selection */}
            <div className="space-y-2">
                <h2 className="font-semibold text-sm text-slate-300 uppercase tracking-wide px-1">环境背景</h2>
                <div className="grid grid-cols-4 gap-2">
                    {BACKGROUND_PRESETS.map((bg, idx) => (
                        <button
                            key={idx}
                            onClick={() => changeBackground(bg)}
                            className={`aspect-square rounded-lg overflow-hidden relative border-2 transition-all ${
                                assets.background.value === bg.value ? 'border-yellow-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                            title={bg.name}
                        >
                            {bg.type === 'color' ? (
                                <div className="w-full h-full" style={{ backgroundColor: bg.value }} />
                            ) : (
                                <img src={bg.value} alt={bg.name} className="w-full h-full object-cover" />
                            )}
                            {assets.background.value === bg.value && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}