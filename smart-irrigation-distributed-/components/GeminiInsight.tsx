import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Clock } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { SensorData } from '../types';

interface GeminiInsightProps {
  data: SensorData;
}

const GeminiInsight: React.FC<GeminiInsightProps> = ({ data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [insightTime, setInsightTime] = useState<Date | null>(null);
  const [isStale, setIsStale] = useState(false);
  const prevDataRef = useRef<SensorData | null>(null);

  // Mark insight as stale when sensor data changes significantly
  useEffect(() => {
    if (!insight || !prevDataRef.current) {
      prevDataRef.current = data;
      return;
    }
    const prev = prevDataRef.current;
    const moistureDiff = Math.abs(data.moisture - prev.moisture);
    const waterLevelDiff = Math.abs(data.waterLevel - prev.waterLevel);
    const rainChanged = data.isRaining !== prev.isRaining;

    if (moistureDiff > 5 || waterLevelDiff > 5 || rainChanged) {
      setIsStale(true);
    }
    prevDataRef.current = data;
  }, [data, insight]);

  const getLocalInsight = (d: SensorData): string => {
    const moisture = d.moisture.toFixed(0);
    const temp = d.temperature.toFixed(1);
    const waterLevel = d.waterLevel.toFixed(0);

    // Priority 1: Critical water level — always check regardless of rain
    if (d.waterLevel < 15) {
      return `⚠️ Water tank is critically low (${waterLevel}%) — refill immediately before any irrigation cycle.`;
    }
    // Priority 2: Rain detected
    if (d.isRaining) {
      return `🌧️ Rain detected — irrigation is not needed right now. Soil moisture is at ${moisture}%.`;
    }
    // Priority 3: Low moisture + low water
    if (d.moisture < 35 && d.waterLevel < 25) {
      return `Soil moisture is low (${moisture}%) but water tank is also low (${waterLevel}%) — refill tank soon then irrigate.`;
    }
    // Priority 4: Low moisture
    if (d.moisture < 35) {
      return `Soil moisture is low (${moisture}%) at ${temp}°C — irrigation is recommended soon.`;
    }
    // Priority 5: Low water tank warning
    if (d.waterLevel < 25) {
      return `💧 Water tank is low (${waterLevel}%) — consider refilling before the next irrigation cycle.`;
    }
    // Default: conditions good
    return `Soil moisture is at ${moisture}% and temperature is ${temp}°C — conditions are currently optimal, no irrigation needed.`;
  };

  const getInsight = async () => {
    setIsStale(false);
    if (!process.env.API_KEY) {
      setInsight(getLocalInsight(data));
      setInsightTime(new Date());
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an irrigation AI assistant. Analyze these sensor readings:
- Soil Moisture: ${data.moisture.toFixed(0)}%
- Temperature: ${data.temperature.toFixed(1)}°C
- Humidity: ${data.humidity.toFixed(0)}%
- Water Tank Level: ${data.waterLevel.toFixed(0)}%
- Rain Detected: ${data.isRaining ? 'Yes' : 'No'}

Give a single, clear sentence telling the farmer whether to irrigate now and why.`,
      });
      setInsight(response.text ?? getLocalInsight(data));
      setInsightTime(new Date());
    } catch (error) {
      console.error(error);
      setInsight(getLocalInsight(data));
      setInsightTime(new Date());
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setInsight(null);
    setInsightTime(null);
    setIsStale(false);
  };

  return (
    <div className="mt-4">
      {!insight && !loading && (
        <button
          onClick={getInsight}
          className="flex items-center justify-center w-full py-2 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100"
        >
          <Sparkles className="w-3 h-3 mr-2" />
          Get Smart AI Insight
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-2 text-xs text-gray-400 animate-pulse">
          <Sparkles className="w-3 h-3 mr-2" />
          Analyzing sensor data...
        </div>
      )}

      {insight && (
        <div className={`p-3 rounded-lg border text-xs flex flex-col gap-2 transition-all ${
          isStale
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 text-emerald-800'
        }`}>
          <div className="flex items-start">
            <Sparkles className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${isStale ? 'text-amber-500' : 'text-emerald-600'}`} />
            <p className="flex-1">{insight}</p>
            <button
              onClick={handleRefresh}
              className={`ml-2 transition-colors flex-shrink-0 ${isStale ? 'text-amber-400 hover:text-amber-600' : 'text-emerald-400 hover:text-emerald-600'}`}
              title="Refresh insight"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center justify-between pl-6">
            {insightTime && (
              <span className="flex items-center text-[10px] text-gray-400">
                <Clock className="w-2.5 h-2.5 mr-1" />
                Analyzed at {insightTime.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            )}
            {isStale && (
              <button
                onClick={getInsight}
                className="text-[10px] text-amber-600 font-medium hover:underline"
              >
                ↻ Refresh with new data
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiInsight;
