import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX } from 'lucide-react';
import type { Task } from '../../types';

interface PomodoroTimerProps {
  activeTasks: Task[];
}

export const PomodoroTimer = ({ activeTasks }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [sessions, setSessions] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  const modes = {
    work: { label: 'Enfoque', time: 25 * 60, color: 'text-indigo-500', bg: 'bg-indigo-500' },
    short: { label: 'Descanso Corto', time: 5 * 60, color: 'text-emerald-500', bg: 'bg-emerald-500' },
    long: { label: 'Descanso Largo', time: 15 * 60, color: 'text-blue-500', bg: 'bg-blue-500' },
  };

  const playSound = (frequency: number, duration: number, ramp: boolean = false) => {
    if (isMuted) return;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    if (ramp) {
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 2, audioCtx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  };

  const playStartSound = () => playSound(523.25, 0.3); // C5 note
  const playEndAlarm = () => playSound(440, 1, true); // A4 to A5 ramp

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playEndAlarm();
      if (mode === 'work') setSessions((s) => s + 1);
      setIsActive(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    if (!isActive) playStartSound();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const switchMode = (newMode: 'work' | 'short' | 'long') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(modes[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (1 - timeLeft / modes[mode].time) * 100;
  const strokeDasharray = 2 * Math.PI * 50; // radius = 50
  const offset = strokeDasharray - (progress / 100) * strokeDasharray;

  const selectedTask = activeTasks.find(t => t.id === selectedTaskId);

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Pomodoro</h2>
          <p className="text-slate-400">Mantén el enfoque y toma descansos regulares.</p>
        </div}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-xl border transition-all ${isMuted ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Timer Visual */}
        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-800"
            />
            <circle
              cx="128"
              cy="128"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              style={{
                strokeDashoffset: offset,
                transition: 'stroke-dashoffset 1s linear',
              }}
              strokeLinecap="round"
              className={`${modes[mode].color} transition-all duration-500`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold text-white tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest mt-2 ${modes[mode].color}`}>
              {modes[mode].label}
            </span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="space-y-6">
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl gap-1">
            {(Object.keys(modes) as Array<keyof typeof modes>).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  mode === m
                    ? `bg-slate-800 text-white shadow-sm ring-1 ring-slate-700`
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {modes[m].label}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetTimer}
              className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={toggleTimer}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
                isActive
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : `bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20`
              }`}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
              {isActive ? 'Pausar' : 'Comenzar'}
            </button>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Brain size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Pomodoros hoy</p>
                <p className="text-xl font-bold text-white">{sessions}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Coffee size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Descansos</p>
                <p className="text-xl font-bold text-white">{Math.floor(sessions / 4)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Task Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
          <Brain size={16} />
          Tarea Actual
        </h3>
        <div className="flex flex-wrap gap-2">
          {activeTasks.length === 0 ? (
            <p className="text-sm text-slate-600 italic">No hay tareas activas para asignar.</p>
          ) : (
            <>
              <button
                onClick={() => setSelectedTaskId(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedTaskId === null
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                Ninguna
              </button>
              {activeTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    selectedTaskId === task.id
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {task.title}
                </button>
              ))}
            </>
          )}
        </div}
        {selectedTask && (
          <div className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-indigo-300">Enfoque en: <strong className="text-white">{selectedTask.title}</strong></span
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
