export type Priority = 'Alta' | 'Media' | 'Baja';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: 'Pendiente' | 'En progreso' | 'Completado';
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  body: string;
  category: 'Contenido' | 'Negocio' | 'Personal' | 'Copy';
  color: string;
  createdAt: string;
}

export type Section = 'tareas' | 'pomodoro' | 'ideas';
