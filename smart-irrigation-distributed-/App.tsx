import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sliders, History as HistoryIcon, Bell, LogOut } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Control from './components/Control';
import History from './components/History';
import Alerts from './components/Alerts';
import GeminiInsight from './components/GeminiInsight';
import { Tab, SensorData } from './types';
import { MOCK_ALERTS } from './constants';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dash');

  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [pumpState, setPumpState] = useState(false);

  const [sensorData, setSensorData] = useState<SensorData>({
    moisture: 33,
    temperature: 25.1,
    humidity: 47,
    waterLevel: 78,
    isRaining: false,
    timestamp: new Date()
  });

  // Simulate live data updates — ALL sensors including humidity
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      setSensorData(prev => {
        const shouldToggleRain = Math.random() > 0.9;
        const newRainingState = shouldToggleRain ? !prev.isRaining : prev.isRaining;

        const moistureDelta = pumpState ? (Math.random() * 1.5) : (Math.random() * -1.2);

        // Humidity rises when raining, drops slightly otherwise
        const humidityDelta = newRainingState
          ? (Math.random() * 1.5)
          : (Math.random() * 0.6 - 0.4);

        return {
          ...prev,
          moisture: Math.min(100, Math.max(0, prev.moisture + moistureDelta)),
          temperature: Math.min(40, Math.max(15, prev.temperature + (Math.random() * 0.4 - 0.2))),
          humidity: Math.min(100, Math.max(20, prev.humidity + humidityDelta)),
          waterLevel: Math.min(100, Math.max(0, prev.waterLevel + (pumpState ? -0.3 : 0.05))),
          isRaining: newRainingState,
          timestamp: new Date()
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoggedIn, pumpState]);

  // Auto-mode logic
  useEffect(() => {
    if (mode === 'auto' && !sensorData.isRaining) {
      if (sensorData.moisture < 35 && sensorData.waterLevel > 10) {
        setPumpState(true);
      } else if (sensorData.moisture >= 65) {
        setPumpState(false);
      }
    }
  }, [sensorData.moisture, sensorData.waterLevel, sensorData.isRaining, mode]);

  // Safety: stop pump if raining
  useEffect(() => {
    if (sensorData.isRaining && pumpState) {
      setPumpState(false);
    }
  }, [sensorData.isRaining, pumpState]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dash':
        return (
          <>
            <Dashboard data={sensorData} />
            <GeminiInsight data={sensorData} />
          </>
        );
      case 'control':
        return (
          <Control
            mode={mode}
            setMode={setMode}
            pumpState={pumpState}
            setPumpState={setPumpState}
            isRaining={sensorData.isRaining}
          />
        );
      case 'history':
        return <History />;
      case 'alerts':
        return <Alerts />;
      default:
        return <Dashboard data={sensorData} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 relative shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="bg-[#059669] px-6 pt-6 pb-4 flex items-center justify-between text-white shadow-md z-10 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">GreenFlow</h1>
          <p className="text-xs text-emerald-100 opacity-90">Smart Irrigation Client</p>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="p-2 bg-emerald-700/50 rounded-full hover:bg-emerald-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 px-6 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 z-20">
        <ul className="flex justify-between items-center">
          {(['dash', 'control', 'history', 'alerts'] as Tab[]).map((tab) => {
            const icons = {
              dash: <LayoutDashboard className={`w-6 h-6 mb-1 ${activeTab === tab ? 'stroke-[2.5px]' : 'stroke-2'}`} />,
              control: <Sliders className={`w-6 h-6 mb-1 ${activeTab === tab ? 'stroke-[2.5px]' : 'stroke-2'}`} />,
              history: <HistoryIcon className={`w-6 h-6 mb-1 ${activeTab === tab ? 'stroke-[2.5px]' : 'stroke-2'}`} />,
              alerts: (
                <div className="relative">
                  <Bell className={`w-6 h-6 mb-1 ${activeTab === tab ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {MOCK_ALERTS.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
              ),
            };
            const labels = { dash: 'Dash', control: 'Control', history: 'History', alerts: 'Alerts' };
            return (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === tab ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-500'}`}
                >
                  {icons[tab]}
                  <span className="text-[10px] font-medium">{labels[tab]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default App;
