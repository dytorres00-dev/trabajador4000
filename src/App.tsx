import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { PomodoroTimer } from './components/pomodoro/PomodoroTimer';
import { IdeasBoard } from './components/ideas/IdeasBoard';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Task, Idea, Section } from './types';

export default function App() {
  const [currentSection, setCurrentSection] = useState<Section>('tareas');
  const [tasks, setTasks] = useLocalStorage<Task[]>('wf-tasks', []);
  const [ideas, setIdeas] = useLocalStorage<Idea[]>('wf-ideas', []);

  return (
    <Layout currentSection={currentSection} setSection={setCurrentSection}>
      <div className="h-full transition-opacity duration-300 ease-in-out">
        {currentSection === 'tareas' && (
          <KanbanBoard tasks={tasks} setTasks={setTasks} />
        )}
        {currentSection === 'pomodoro' && (
          <PomodoroTimer activeTasks={tasks.filter(t => t.status !== 'Completado')} />
        )}
        {currentSection === 'ideas' && (
          <IdeasBoard ideas={ideas} setIdeas={setIdeas} />
        )}
      </div>
    </Layout>
  );
}
