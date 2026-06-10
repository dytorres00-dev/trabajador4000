import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Plus, Trash2, Calendar } from 'lucide-react';
import type { Task, Priority } from '../../types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const TaskCard = ({ task, onDelete }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const priorityColors = {
    Alta: 'bg-red-500/10 text-red-400 border-red-500/20',
    Media: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Baja: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative p-4 mb-3 bg-slate-800 border border-slate-700 rounded-xl shadow-sm
        cursor-grab active:cursor-grabbing hover:border-indigo-500/50 transition-all
        ${isDragging ? 'opacity-50 ring-2 ring-indigo-500' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity rounded-md hover:bg-red-400/10"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <h4 className="font-semibold text-slate-100 mb-1 leading-tight">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-1 text-[10px] text-slate-500">
        <Calendar size={10} />
        {format(new Date(task.createdAt), 'dd MMM yyyy')}
      </div>
    </div>
  );
};

const DroppableColumn = ({ id, label, tasks, children }: { id: string, label: string, tasks: Task[], children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-300">{label}</h3>
          <span className="text-xs font-medium bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full border border-slate-700">
            {tasks.length}
          </span>
        </div}
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-2xl p-3 transition-colors hover:bg-slate-900/80"
      >
        {children}
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const KanbanBoard = ({ tasks, setTasks }: KanbanBoardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Media' as Priority });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: { id: Task['status']; label: string }[] = [
    { id: 'Pendiente', label: 'Pendiente' },
    { id: 'En progreso', label: 'En progreso' },
    { id: 'Completado', label: 'Completado' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    setTasks((prev) => {
      const activeTask = prev.find((t) => t.id === activeId);
      if (!activeTask) return prev;

      const overTask = prev.find((t) => t.id === overId);

      if (overTask) {
        return prev.map((t) => (t.id === activeId ? { ...t, status: overTask.status } : t));
      }

      const statusMatch = columns.find(c => c.id === overId);
      if (statusMatch) {
        return prev.map((t) => (t.id === activeId ? { ...t, status: statusMatch.id } : t));
      }

      return prev;
    });
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      ...newTask,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'Media' });
    setIsAdding(false);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gestión de Tareas</h2>
          <p className="text-slate-400">Organiza tu flujo de trabajo con el tablero Kanban.</p>
        </div}
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} />
          Nueva Tarea
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={addTask}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl transition-all"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Nueva Tarea</h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Título</label>
                <input
                  autoFocus
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 ring-indigo-500 outline-none transition-all"
                  placeholder="Ej: Implementar autenticación"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Descripción</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 ring-indigo-500 outline-none transition-all h-24 resize-none"
                  placeholder="Detalles adicionales..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Prioridad</label>
                <div className="flex gap-2">
                  {(['Baja', 'Media', 'Alta'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                        newTask.priority === p
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Crear Tarea
            </button>
          </form>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map(({ id, label }) => (
            <DroppableColumn
              key={id}
              id={id}
              label={label}
              tasks={tasks.filter(t => t.status === id)}
            >
              <SortableContext items={tasks.filter((t) => t.status === id)} strategy={verticalListSortingStrategy}>
                {tasks
                  .filter((t) => t.status === id)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} onDelete={deleteTask} />
                  ))}
                {tasks.filter((t) => t.status === id).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-slate-600 italic text-sm opacity-50">
                    No hay tareas aquí
                  </div>
                )}
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
};
