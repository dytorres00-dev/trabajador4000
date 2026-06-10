import React, { useState } from 'react';
import { Plus, Trash2, Tag, Edit3, Search, X } from 'lucide-react';
import { Idea } from '../../types';

interface IdeaCardProps {
  idea: Idea;
  onDelete: (id: string) => void;
  onEdit: (idea: Idea) => void;
}

const IdeaCard = ({ idea, onDelete, onEdit }: IdeaCardProps) => {
  const categoryColors = {
    Contenido: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Negocio: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Personal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Copy: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="group relative p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[idea.category]}`}>
          {idea.category}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(idea)}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(idea.id)}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-3 leading-tight">{idea.title}</h3>
      <div className="text-slate-400 text-sm leading-relaxed flex-1 overflow-hidden whitespace-pre-wrap">
        {idea.body}
      </div>
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Tag size={12} />
          <span>{idea.category}</span>
        </div>
        <div className="text-[10px] text-slate-600">
          {new Date(idea.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

interface IdeasBoardProps {
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
}

export const IdeasBoard = ({ ideas, setIdeas }: IdeasBoardProps) => {
  const [filter, setFilter] = useState('Todos');
  const [isAdding, setIsAdding] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [form, setForm] = useState({ title: '', body: '', category: 'Contenido' as Idea['category'] });

  const categories = ['Todos', 'Contenido', 'Negocio', 'Personal', 'Copy'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingIdea) {
      setIdeas(ideas.map(i => i.id === editingIdea.id ? { ...i, ...form } : i));
    } else {
      const newIdea: Idea = {
        id: crypto.randomUUID(),
        ...form,
        createdAt: new Date().toISOString(),
      };
      setIdeas([...ideas, newIdea]);
    }

    setForm({ title: '', body: '', category: 'Contenido' });
    setIsAdding(false);
    setEditingIdea(null);
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  const startEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setForm({ title: idea.title, body: idea.body, category: idea.category });
    setIsAdding(true);
  };

  const filteredIdeas = filter === 'Todos' ? ideas : ideas.filter(i => i.category === filter);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Ideas & Contenido</h2>
          <p className="text-slate-400">Captura la inspiración antes de que se escape.</p>
        </div>
        <button
          onClick={() => {
            setForm({ title: '', body: '', category: 'Contenido' });
            setIsAdding(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} />
          Nueva Idea
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === cat ? 'bg-slate-800 text-white ring-1 ring-slate-700' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-xl shadow-2xl transition-all"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{editingIdea ? 'Editar Idea' : 'Nueva Idea'}</h3>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingIdea(null); }}
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
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 ring-indigo-500 outline-none transition-all"
                  placeholder="Título de la idea..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Cuerpo</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 ring-indigo-500 outline-none transition-all h-40 resize-none"
                  placeholder="Describe tu idea..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Categoría</label>
                <div className="flex gap-2">
                  {(['Contenido', 'Negocio', 'Personal', 'Copy'] as Idea['category'][]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                        form.category === cat
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              {editingIdea ? 'Guardar Cambios' : 'Guardar Idea'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map(idea => (
          <IdeaCard key={idea.id} idea={idea} onDelete={deleteIdea} onEdit={startEdit} />
        ))}
        {filteredIdeas.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center h-64 text-slate-600 italic opacity-50">
            <Lightbulb size={48} className="mb-4 opacity-20" />
            No hay ideas en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
};
