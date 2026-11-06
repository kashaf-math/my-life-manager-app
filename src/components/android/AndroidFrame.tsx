import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor, Sun, Moon } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  deviceFrameMode: boolean;
  setDeviceFrameMode: (val: boolean) => void;
  appTitle?: string;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  themeMode,
  setThemeMode,
  deviceFrameMode,
  setDeviceFrameMode,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('08:00');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const timer = setInterval(update, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 font-sans ${
        themeMode === 'dark' ? 'bg-[#121115] text-[#E6E0E9]' : 'bg-[#EFEBF4] text-[#1D1B20]'
      } flex flex-col items-center justify-start p-0 md:py-6 md:px-4 select-none`}
    >
      {/* Top Controller Bar */}
      <div className="w-full max-w-4xl mx-auto mb-3 px-4 py-2 flex items-center justify-between text-xs font-medium text-[#49454F] dark:text-[#CAC4D0]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wide text-[#6750A4] dark:text-[#D0BCFF]">
            MY LIFE MANAGER
          </span>
          <span className="hidden sm:inline opacity-60">• Room DB Active</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Frame Toggle */}
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E7E0EC] dark:bg-[#2B2930] hover:bg-[#dcd5e2] dark:hover:bg-[#38353e] transition-all cursor-pointer"
            title={deviceFrameMode ? 'Switch to Full Screen View' : 'Switch to Android Pixel Frame'}
          >
            {deviceFrameMode ? <Monitor size={14} /> : <Smartphone size={14} />}
            <span className="hidden sm:inline">
              {deviceFrameMode ? 'Full View' : 'Pixel Frame'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-full bg-[#E7E0EC] dark:bg-[#2B2930] hover:bg-[#dcd5e2] dark:hover:bg-[#38353e] transition-all cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            {themeMode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Main Container */}
      {deviceFrameMode ? (
        // Android Device Chassis Simulation (Google Pixel 8 Pro style)
        <div className="relative w-full max-w-[430px] h-[92vh] max-h-[920px] rounded-[48px] p-3 shadow-2xl bg-[#1e1c24] border-[7px] border-[#2d2938] flex flex-col overflow-hidden ring-1 ring-black/40">
          {/* Hardware Buttons Decoration */}
          <div className="absolute -left-[10px] top-28 w-[3px] h-12 bg-[#3f3b4d] rounded-l" />
          <div className="absolute -left-[10px] top-44 w-[3px] h-20 bg-[#3f3b4d] rounded-l" />
          <div className="absolute -right-[10px] top-32 w-[3px] h-14 bg-[#3f3b4d] rounded-r" />

          {/* Inner Screen */}
          <div className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col bg-[#FEF7FF] dark:bg-[#141218]">
            {/* Android Status Bar */}
            <div className="h-9 px-6 flex items-center justify-between text-xs font-semibold text-[#1D1B20] dark:text-[#E6E0E9] select-none z-40 bg-transparent flex-shrink-0">
              <span className="tracking-tight">{currentTime}</span>

              {/* Camera Notch */}
              <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#18233c]" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 opacity-90">
                <Signal size={12} />
                <Wifi size={12} />
                <BatteryMedium size={14} />
              </div>
            </div>

            {/* Application Content Canvas */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative">
              {children}
            </div>

            {/* Android Gesture Bar */}
            <div className="h-5 flex items-center justify-center bg-transparent z-40 flex-shrink-0">
              <div className="w-32 h-1 bg-[#1D1B20]/40 dark:bg-[#E6E0E9]/40 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        // Responsive Desktop/Tablet Canvas
        <div className="w-full max-w-4xl min-h-[85vh] rounded-3xl overflow-hidden shadow-xl bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0]/30 dark:border-[#49454F]/40 flex flex-col">
          {/* Responsive Header Mini Bar */}
          <div className="h-8 px-6 flex items-center justify-between text-xs font-semibold text-[#49454F] dark:text-[#CAC4D0] border-b border-[#CAC4D0]/20 dark:border-[#49454F]/30 bg-[#F3EDF7]/60 dark:bg-[#211F26]/60">
            <span>Material 3 Jetpack Compose App</span>
            <div className="flex items-center gap-3">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1">
                <Wifi size={12} />
                <BatteryMedium size={14} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
