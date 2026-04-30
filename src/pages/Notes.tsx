import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StickyNote, Plus, Trash2, Edit3 } from 'lucide-react';
import { useProfile } from '../lib/store';
import type { Note } from '../lib/store';

export const Notes: React.FC = () => {
  const { notes, setNotes } = useProfile();

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10">
        <div>
          <div className="w-12 h-12 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <Edit3 size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-forest dark:text-ivory-warm tracking-tighter leading-none mb-2">
            Scratchpad.
          </h1>
          <p className="text-base text-text-secondary dark:text-text-dark-secondary font-medium">
            Quick thoughts, lecture bits, life admin.
          </p>
        </div>
        <Button size="sm" onClick={addNote} className="shadow-md px-6 shrink-0 active:scale-95 transition-transform">
          <Plus size={16} /> New Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-ivory-warm/40 dark:bg-dark-card/30 rounded-[2rem] border-2 border-dashed border-ivory-deep dark:border-forest-mid/30">
          <StickyNote size={48} strokeWidth={1.5} className="mb-4 text-terracotta opacity-40" />
          <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary mb-1">Your scratchpad is empty</h3>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm max-w-sm">
            Start a thought, paste a link, or jot down an upcoming deadline. It all syncs locally.
          </p>
          <Button variant="secondary" size="sm" onClick={addNote} className="mt-6 shadow-sm border-none bg-white dark:bg-dark-surface hover:bg-ivory-warm">
            Create first note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          {notes.map(note => (
            <Card 
              key={note.id} 
              className="p-5 sm:p-6 relative group bg-white/60 dark:bg-dark-card/60 backdrop-blur-md border-none shadow-sm transition-all hover:shadow-float focus-within:shadow-float focus-within:bg-white dark:focus-within:bg-dark-card"
            >
              {/* Delete Button */}
              <button
                onClick={() => deleteNote(note.id)}
                title="Delete note"
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-terracotta hover:bg-terracotta/10 rounded-lg sm:opacity-0 sm:group-hover:opacity-100 transition-all focus:opacity-100 outline-none"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex flex-col h-full gap-3">
                <input 
                  className="w-[85%] bg-transparent border-none text-lg font-bold text-text-primary dark:text-text-dark-primary focus:outline-none placeholder:opacity-30 placeholder:font-medium"
                  value={note.title}
                  placeholder="Untitled Note"
                  onChange={(e) => updateNote(note.id, { title: e.target.value })}
                />
                <textarea 
                  className="w-full bg-transparent border-none text-sm text-text-secondary dark:text-text-dark-secondary focus:outline-none resize-none min-h-[140px] placeholder:opacity-40 leading-relaxed custom-scrollbar"
                  value={note.content}
                  placeholder="Start writing..."
                  onChange={(e) => {
                    updateNote(note.id, { content: e.target.value });
                    // Auto-resize magic
                    e.target.style.height = '140px';
                    e.target.style.height = `${Math.max(140, e.target.scrollHeight)}px`;
                  }}
                  onFocus={(e) => {
                    e.target.style.height = `${Math.max(140, e.target.scrollHeight)}px`;
                  }}
                />
                
                <div className="pt-3 mt-auto border-t border-ivory-deep dark:border-dark-border/50 flex justify-between items-center opacity-60">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted">
                    {new Date(note.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                  </span>
                  <StickyNote size={12} className="text-text-muted" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
