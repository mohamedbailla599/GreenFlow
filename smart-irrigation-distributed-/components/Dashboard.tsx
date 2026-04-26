import React from 'react';
import { Droplets, Thermometer, Wind, Activity, CloudRain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SensorData } from '../types';

interface DashboardProps {
  data: SensorData;
}

// Dynamic status helpers
const getMoistureStatus = (v: number) =>
  v < 35 ? { label: 'Dry', color: 'bg-red-100 text-red-600' }
  : v > 70 ? { label: 'Wet', color: 'bg-blue-100 text-blue-600' }
  : { label: 'Optimal', color: 'bg-emerald-100 text-emerald-600' };

const getTempStatus = (v: number) =>
  v > 35 ? { label: 'Hot', color: 'bg-red-100 text-red-600' }
  : v < 18 ? { label: 'Cold', color: 'bg-blue-100 text-blue-600' }
  : { label: 'Normal', color: 'bg-orange-100 text-orange-600' };

const getHumidityStatus = (v: number) =>
  v > 80 ? { label: 'High', color: 'bg-indigo-100 text-indigo-600' }
  : v < 30 ? { label: 'Low', color: 'bg-yellow-100 text-yellow-600' }
  : { label: 'Good', color: 'bg-teal-100 text-teal-600' };

const getWaterLevelStatus = (v: number) =>
  v < 15 ? { label: 'Critical', color: 'bg-red-100 text-red-600' }
  : v < 25 ? { label: 'Low', color: 'bg-orange-100 text-orange-600' }
  : { label: 'Ok', color: 'bg-purple-100 text-purple-600' };

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  status: string;
  statusColor: string;
  colorClass: string;
}> = ({ icon, label, value, unit, status, statusColor, colorClass }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-xl ${colorClass} bg-opacity-10`}>
        {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${colorClass.replace('bg-', 'text-')}` })}
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColor} font-medium`}>
        {status}
      </span>
    </div>
    <div>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
      </div>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const moistureSt = getMoistureStatus(data.moisture);
  const tempSt = getTempStatus(data.temperature);
  const humiditySt = getHumidityStatus(data.humidity);
  const waterSt = getWaterLevelStatus(data.waterLevel);

  // Live rolling chart — keep last 13 points
  const [chartData, setChartData] = React.useState<{ time: string; moisture: number }[]>([]);

  React.useEffect(() => {
    const point = {
      time: data.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      moisture: Math.round(data.moisture),
    };
    setChartData(prev => {
      const next = [...prev, point];
      return next.length > 13 ? next.slice(next.length - 13) : next;
    });
  }, [data.timestamp]);

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Status Overview</h2>
          <span className="text-xs text-gray-400 font-mono">
            {data.timestamp.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Live Updates from Sensors</p>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Droplets />}
            label="Soil Moisture"
            value={data.moisture.toFixed(0)}
            unit="%"
            status={moistureSt.label}
            statusColor={moistureSt.color}
            colorClass="bg-blue-500 text-blue-600"
          />
          <StatCard
            icon={<Thermometer />}
            label="Temperature"
            value={data.temperature.toFixed(1)}
            unit="°C"
            status={tempSt.label}
            statusColor={tempSt.color}
            colorClass="bg-orange-500 text-orange-600"
          />
          <StatCard
            icon={<Wind />}
            label="Humidity"
            value={data.humidity.toFixed(0)}
            unit="%"
            status={humiditySt.label}
            statusColor={humiditySt.color}
            colorClass="bg-teal-500 text-teal-600"
          />
          <StatCard
            icon={<CloudRain />}
            label="Rain Sensor"
            value={data.isRaining ? 'Raining' : 'Dry'}
            status={data.isRaining ? 'Wet' : 'Clear'}
            statusColor={data.isRaining ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}
            colorClass="bg-indigo-500 text-indigo-600"
          />
          <StatCard
            icon={<Activity />}
            label="Water Level"
            value={data.waterLevel.toFixed(0)}
            unit="%"
            status={waterSt.label}
            statusColor={waterSt.color}
            colorClass="bg-purple-500 text-purple-600"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-800 font-semibold mb-1">Moisture Trends (Live)</h3>
        <p className="text-xs text-gray-400 mb-4">Updates every 3 seconds</p>
        <div className="h-48 w-full">
          {chartData.length < 2 ? (
            <div className="flex items-center justify-center h-full text-xs text-gray-400 animate-pulse">
              Collecting data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  dy={10}
                  interval="preserveStartEnd"
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                  formatter={(v: number) => [`${v}%`, 'Moisture']}
                />
                <Area
                  type="monotone"
                  dataKey="moisture"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMoisture)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
