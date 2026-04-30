import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, type StudentProfile } from '../lib/store';
import { secureStorage } from '../lib/crypto';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';
import { Download, ShieldCheck, Trash2, Upload, Bot, Key, Server, UserCircle, Save } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Profile: React.FC = () => {
  const { profile, updateProfile, clearProfile } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<StudentProfile>>(profile || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof StudentProfile, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    updateProfile(formData);
    setTimeout(() => setIsSaving(false), 600); // UI feedback
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearProfile();
      navigate('/');
    }
  };

  const handleExport = () => {
    const data = {
      spes_profile: JSON.parse(secureStorage.getItem('spes_profile') || 'null'),
      spes_notes: JSON.parse(secureStorage.getItem('spes_notes') || '[]'),
      spes_events: JSON.parse(secureStorage.getItem('spes_events') || '[]'),
      spes_exams_list: JSON.parse(secureStorage.getItem('spes_exams_list') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spes_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.spes_profile) secureStorage.setItem('spes_profile', JSON.stringify(data.spes_profile));
        if (data.spes_notes) secureStorage.setItem('spes_notes', JSON.stringify(data.spes_notes));
        if (data.spes_events) secureStorage.setItem('spes_events', JSON.stringify(data.spes_events));
        if (data.spes_exams_list) secureStorage.setItem('spes_exams_list', JSON.stringify(data.spes_exams_list));

        alert('Data imported successfully. Refreshing page...');
        window.location.reload();
      } catch {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-forest text-ivory rounded-2xl flex items-center justify-center shadow-lg">
          <UserCircle size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-forest dark:text-ivory-warm">Your Profile</h1>
          <p className="text-text-secondary dark:text-text-dark-secondary">Your profile helps the AI give better advice.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-sm flex flex-col gap-5 p-6 bg-white dark:bg-dark-card/60">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">Faculty</label>
            <Select value={formData.faculty || ''} onChange={(e) => handleChange('faculty', e.target.value)}>
              <option value="">Select Faculty</option>
              <option value="Commerce">Commerce</option>
              <option value="Engineering">Engineering</option>
              <option value="Humanities">Humanities</option>
              <option value="Health Sciences">Health Sciences</option>
              <option value="Law">Law</option>
              <option value="Science">Science</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">Year of Study</label>
            <Select value={formData.year || ''} onChange={(e) => handleChange('year', e.target.value)}>
              <option value="">Select Year</option>
              <option value="1st year">1st year</option>
              <option value="2nd year">2nd year</option>
              <option value="3rd year">3rd year</option>
              <option value="4th year">4th year</option>
              <option value="Honours">Honours</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">Registered Credits</label>
            <Input
              type="number"
              placeholder="e.g. 120"
              value={formData.registeredCredits || ''}
              onChange={(e) => handleChange('registeredCredits', parseInt(e.target.value) || 0)}
            />
          </div>
        </Card>

        <Card className="border-none shadow-sm flex flex-col gap-5 p-6 bg-white dark:bg-dark-card/60">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">NSFAS Status</label>
            <Select value={formData.nsfasStatus || ''} onChange={(e) => handleChange('nsfasStatus', e.target.value)}>
              <option value="">Select Status</option>
              <option value="Yes — approved">Yes — approved</option>
              <option value="Pending / applied">Pending / applied</option>
              <option value="Not applicable">Not applicable</option>
              <option value="Declined">Declined</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">Monthly Budget</label>
              <span className="text-sm font-bold text-forest dark:text-ivory-warm">R{formData.budget?.toLocaleString() || 4500}</span>
            </div>
            <Slider
              min={1000} max={12000} step={100}
              value={formData.budget || 4500}
              onChange={(e) => handleChange('budget', parseInt(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">Home Province</label>
            <Select value={formData.homeProvince || ''} onChange={(e) => handleChange('homeProvince', e.target.value)}>
              <option value="">Select Province</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="Free State">Free State</option>
              <option value="Gauteng">Gauteng</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Limpopo">Limpopo</option>
              <option value="Mpumalanga">Mpumalanga</option>
              <option value="Northern Cape">Northern Cape</option>
              <option value="North West">North West</option>
              <option value="Western Cape">Western Cape</option>
              <option value="Outside SA">Outside SA</option>
            </Select>
          </div>
        </Card>
      </div>

      <div className="flex justify-end mb-10">
        <Button size="lg" onClick={handleSave} className="shadow-lg px-8 active:scale-95 transition-transform" isLoading={isSaving}>
          <Save size={18} className="mr-2" /> Save Context
        </Button>
      </div>

      {/* ── AI Settings ── */}
      <Card className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-white to-ivory-warm dark:from-dark-card dark:to-dark-surface border-none shadow-md overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Bot className="text-terracotta" size={22} />
            AI Settings
          </h3>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6 max-w-lg leading-relaxed">
            Choose how the AI connects. The shared key is free but rate-limited. Add your own API key for unlimited access.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {[
              { id: 'server' as const, icon: Server, label: 'Server Key', desc: 'Free, rate-limited' },
              { id: 'anthropic' as const, icon: Key, label: 'Anthropic', desc: 'BYOK — Claude 3.5' },
              { id: 'openai' as const, icon: Key, label: 'OpenAI', desc: 'BYOK — GPT-4o' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleChange('apiProvider', opt.id)}
                className={`flex-1 flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left ${(formData.apiProvider || 'server') === opt.id
                  ? 'border-terracotta bg-terracotta/5 shadow-sm'
                  : 'border-ivory-deep dark:border-dark-border bg-white dark:bg-dark-surface hover:border-terracotta/40'
                  }`}
              >
                <opt.icon size={18} className="text-terracotta shrink-0 mt-0.5" />
                <div>
                  <span className="block text-sm font-bold text-text-primary dark:text-text-dark-primary">{opt.label}</span>
                  <span className="block text-[11px] text-text-muted mt-0.5">{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>

          {(formData.apiProvider === 'anthropic' || formData.apiProvider === 'openai') && (
            <div className="max-w-[400px] animate-in slide-in-from-top-2 duration-300">
              <label className="text-[11px] font-black uppercase tracking-widest text-text-muted block mb-1.5">
                {formData.apiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API Key
              </label>
              <Input
                type="password"
                placeholder={formData.apiProvider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                value={formData.apiKey || ''}
                onChange={(e) => handleChange('apiKey', e.target.value)}
              />
              <p className="text-xs text-text-muted mt-2">
                Stored encrypted locally. Get one at{' '}
                <a
                  href={formData.apiProvider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://console.anthropic.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta hover:underline font-bold"
                >
                  {formData.apiProvider === 'openai' ? 'platform.openai.com' : 'console.anthropic.com'}
                </a>.
              </p>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      </Card>

      {/* ── Privacy & Portability ── */}
      <Card className="p-6 sm:p-8 bg-sage/5 dark:bg-sage/10 border-none shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="text-sage" size={22} />
            Your Data
          </h3>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-6 max-w-lg leading-relaxed">
            Your data lives on this device. Export a backup to sync across devices, or clear everything in one click.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={handleExport} className="bg-white dark:bg-dark-card shadow-sm border-none flex items-center gap-2">
              <Download size={16} /> Export JSON
            </Button>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="bg-white dark:bg-dark-card shadow-sm border-none flex items-center gap-2">
              <Upload size={16} /> Import JSON
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              className="hidden"
              accept=".json"
            />
            <Button variant="danger" size="sm" onClick={handleClear} className="flex items-center gap-2 ml-auto shadow-sm">
              <Trash2 size={16} /> Clear All Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
