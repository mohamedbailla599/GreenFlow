import { Alert, LogEntry } from './types';

export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Water level low (< 20%)',
    timestamp: '03/12/2025 21:48:25'
  },
  {
    id: '2',
    type: 'info',
    message: 'System scheduled auto-watering completed',
    timestamp: '03/12/2025 20:26:45'
  },
  {
    id: '3',
    type: 'error',
    message: 'Pump disconnected',
    timestamp: '02/12/2025 21:50:05'
  }
];

export const MOCK_HISTORY: LogEntry[] = [
  { id: '1',  timestamp: '02/12/2025 • 18:50', moisture: 72, temperature: 24.2, status: 'Wet' },
  { id: '2',  timestamp: '02/12/2025 • 19:50', moisture: 65, temperature: 25.0, status: 'Wet' },
  { id: '3',  timestamp: '02/12/2025 • 20:50', moisture: 57, temperature: 26.1, status: 'Optimal' },
  { id: '4',  timestamp: '02/12/2025 • 21:50', moisture: 49, temperature: 29.4, status: 'Optimal' },
  { id: '5',  timestamp: '02/12/2025 • 22:50', moisture: 43, temperature: 28.0, status: 'Optimal' },
  { id: '6',  timestamp: '02/12/2025 • 23:50', moisture: 36, temperature: 27.5, status: 'Dry' },
  { id: '7',  timestamp: '03/12/2025 • 00:50', moisture: 30, temperature: 22.0, status: 'Dry' },
  { id: '8',  timestamp: '03/12/2025 • 01:50', moisture: 28, temperature: 22.6, status: 'Dry' },
  { id: '9',  timestamp: '03/12/2025 • 02:50', moisture: 68, temperature: 21.3, status: 'Wet' }, // watered
  { id: '10', timestamp: '03/12/2025 • 03:50', moisture: 74, temperature: 20.8, status: 'Wet' },
  { id: '11', timestamp: '03/12/2025 • 04:50', moisture: 70, temperature: 21.0, status: 'Wet' },
  { id: '12', timestamp: '03/12/2025 • 05:50', moisture: 62, temperature: 22.4, status: 'Optimal' },
];

export const CHART_DATA = [
  { time: '00:00', moisture: 72 },
  { time: '02:00', moisture: 65 },
  { time: '04:00', moisture: 57 },
  { time: '06:00', moisture: 48 },
  { time: '08:00', moisture: 38 },
  { time: '10:00', moisture: 30 },
  { time: '12:00', moisture: 26 }, // driest point
  { time: '14:00', moisture: 23 },
  { time: '16:00', moisture: 68 }, // watered
  { time: '18:00', moisture: 74 },
  { time: '20:00', moisture: 69 },
  { time: '22:00', moisture: 63 },
  { time: '23:59', moisture: 58 },
];