import { useState, useEffect } from 'react';
import { WebsiteContent } from '../types';
import { saveContent, saveContentToSite } from '../services/saveContent';
import { uploadImage } from '../services/uploadImage';
import { defaultContent } from '../context/WebsiteContext';
import type { SiteRow } from '../lib/siteResolver';

interface AdminPanelProps {
  initialContent: WebsiteContent | null;
  site: SiteRow | null;
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminPanel({ initialContent, site, onClose, onLogout }: AdminPanelProps) {
  const initContent = initialContent || defaultContent;
  const [content, setContent] = useState<WebsiteContent>({
    ...initContent,
    timeline: initContent.timeline?.length ? initContent.timeline : defaultContent.timeline,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeSection, setActiveSection] = useState('couple');

  const customerSiteId = site?.id || 'isabel-kevin';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const update = (path: string, value: any) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(customerSiteId, file);
      update(path, url || '');
      setMessage({ type: 'success', text: 'Image uploaded successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Upload failed' });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const frontNames = `${content.couple.name1} & ${content.couple.name2}`;
      const endNames = `${content.couple.name1} & ${content.couple.name2}`;
      const payload = { ...content, frontNames, endNames };
      if (site) {
        await saveContentToSite(site.id, payload);
      } else {
        await saveContent('isabel-kevin', payload, {});
      }
      setMessage({ type: 'success', text: 'Content saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetAll = async () => {
    setSaving(true);
    setMessage(null);
    const reset = JSON.parse(JSON.stringify(defaultContent));
    setContent(reset);
    try {
      const frontNames = `${reset.couple.name1} & ${reset.couple.name2}`;
      const endNames = `${reset.couple.name1} & ${reset.couple.name2}`;
      const payload = { ...reset, frontNames, endNames };
      if (site) {
        await saveContentToSite(site.id, payload);
      } else {
        await saveContent('isabel-kevin', payload, {});
      }
      setMessage({ type: 'success', text: 'All content reset to default' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Reset failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetBroken = async () => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, image: '' },
      story: { ...prev.story, image: '' },
      invitationCard: { ...prev.invitationCard, image: '' },
    }));
    setMessage({ type: 'success', text: 'Broken image fields reset' });
  };

  const sections = [
    { id: 'couple', label: 'Couple & Hero', icon: 'fa-heart' },
    { id: 'countdown', label: 'Countdown', icon: 'fa-clock' },
    { id: 'story', label: 'Story', icon: 'fa-book' },
    { id: 'entourage', label: 'Entourage', icon: 'fa-users' },
    { id: 'events', label: 'Events', icon: 'fa-calendar' },
    { id: 'quote', label: 'Quote', icon: 'fa-quote-left' },
    { id: 'footer', label: 'Footer', icon: 'fa-shoe-prints' },
    { id: 'timeline', label: 'Timeline', icon: 'fa-hourglass-end' },
  ];

  const viewSiteHref = (() => {
    if (typeof window === 'undefined') return '/';
    const params = new URLSearchParams(window.location.search);
    const customer = params.get('customer');
    return customer ? '/?customer=' + encodeURIComponent(customer) : '/';
  })();

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center sm:items-start justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl my-6 sm:my-8 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <div className="bg-crimson text-white p-4 sm:p-6 rounded-t-lg flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif">Website Editor</h2>
            <p className="text-blush text-xs sm:text-sm">Edit your wedding website content</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blush text-xl sm:text-2xl font-bold leading-none ml-4">
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 font-serif ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-400'
                  : 'bg-red-100 text-red-700 border border-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-4 py-2 rounded-lg font-serif font-bold text-sm transition ${
                  activeSection === s.id
                    ? 'bg-crimson text-white'
                    : 'bg-gray-100 text-dark hover:bg-gray-200'
                }`}
              >
                <i className={`fas ${s.icon} mr-2`}></i>
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeSection === 'couple' && (
              <Section title="Couple & Hero">
                <Input label="Name 1" value={content.couple.name1} onChange={v => update('couple.name1', v)} />
                <Input label="Name 2" value={content.couple.name2} onChange={v => update('couple.name2', v)} />
                <Input label="Hashtag" value={content.couple.hashtag} onChange={v => update('couple.hashtag', v)} />
                <Input label="Hero Date" type="datetime-local" value={content.hero.date} onChange={v => update('hero.date', v)} />
                <ImageInput label="Hero Image" value={content.hero.image} onChange={v => update('hero.image', v)} onUpload={e => handleImageUpload(e, 'hero.image')} />
              </Section>
            )}

            {activeSection === 'countdown' && (
              <Section title="Countdown">
                <Input label="Target Date" type="datetime-local" value={content.countdown.targetDate} onChange={v => update('countdown.targetDate', v)} />
              </Section>
            )}

            {activeSection === 'story' && (
              <Section title="Love Story">
                <Input label="Paragraph 1" value={content.story.paragraph1} onChange={v => update('story.paragraph1', v)} textarea />
                <Input label="Paragraph 2" value={content.story.paragraph2} onChange={v => update('story.paragraph2', v)} textarea />
                <ImageInput label="Story Image" value={content.story.image} onChange={v => update('story.image', v)} onUpload={e => handleImageUpload(e, 'story.image')} />
              </Section>
            )}

            {activeSection === 'events' && (
              <Section title="Events">
                <h3 className="font-serif font-bold text-crimson mb-4">Ceremony</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Input label="Time" value={content.events.ceremony.time} onChange={v => update('events.ceremony.time', v)} />
                  <Input label="Venue" value={content.events.ceremony.venue} onChange={v => update('events.ceremony.venue', v)} />
                  <Input label="Location" value={content.events.ceremony.location} onChange={v => update('events.ceremony.location', v)} className="md:col-span-2" />
                  <Input label="Map Latitude" value={content.events.ceremony.mapCoords?.latitude || ''} onChange={v => update('events.ceremony.mapCoords', { ...(content.events.ceremony.mapCoords || {}), latitude: v })} />
                  <Input label="Map Longitude" value={content.events.ceremony.mapCoords?.longitude || ''} onChange={v => update('events.ceremony.mapCoords', { ...(content.events.ceremony.mapCoords || {}), longitude: v })} />
                </div>
                <h3 className="font-serif font-bold text-crimson mb-4">Reception</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Input label="Time" value={content.events.reception.time} onChange={v => update('events.reception.time', v)} />
                  <Input label="Venue" value={content.events.reception.venue} onChange={v => update('events.reception.venue', v)} />
                  <Input label="Location" value={content.events.reception.location} onChange={v => update('events.reception.location', v)} className="md:col-span-2" />
                </div>
                <h3 className="font-serif font-bold text-crimson mb-4">Menu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageInput label="Menu Image" value={content.events.menuImage} onChange={v => update('events.menuImage', v)} onUpload={e => handleImageUpload(e, 'events.menuImage')} className="md:col-span-2" />
                </div>
              </Section>
            )}

            {activeSection === 'entourage' && (
              <Section title="Entourage">
                <Input label="Parents" value={content.entourage.parents} onChange={v => update('entourage.parents', v)} className="md:col-span-2" textarea />
                <Input label="Principal Sponsors" value={content.entourage.sponsors} onChange={v => update('entourage.sponsors', v)} className="md:col-span-2" textarea />
                <Input label="Maid of Honor" value={content.entourage.maidOfHonor} onChange={v => update('entourage.maidOfHonor', v)} />
                <Input label="Best Man" value={content.entourage.bestMan} onChange={v => update('entourage.bestMan', v)} />
              </Section>
            )}

            {activeSection === 'footer' && (
              <Section title="Footer">
                <ImageInput label="Footer Image" value={content.footer.image} onChange={v => update('footer.image', v)} onUpload={e => handleImageUpload(e, 'footer.image')} className="md:col-span-2" />
              </Section>
            )}

            {activeSection === 'quote' && (
              <Section title="Quote">
                <Input label="Text" value={content.quote.text} onChange={v => update('quote.text', v)} textarea />
              </Section>
            )}

            {activeSection === 'timeline' && (
              <Section title="Timeline">
                <div className="space-y-4">
                  {content.timeline.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <Input label="Event" value={item.event} onChange={v => {
                          const arr = [...content.timeline];
                          arr[i] = { ...arr[i], event: v };
                          update('timeline', arr);
                        }} />
                        <Input label="Time" value={item.time} onChange={v => {
                          const arr = [...content.timeline];
                          arr[i] = { ...arr[i], time: v };
                          update('timeline', arr);
                        }} />
                      </div>
                      <Input label="Description" value={item.description} onChange={v => {
                        const arr = [...content.timeline];
                        arr[i] = { ...arr[i], description: v };
                        update('timeline', arr);
                      }} textarea />
                      <div className="flex justify-between items-center mt-2">
                        <Input label="Icon class" value={item.icon} onChange={v => {
                          const arr = [...content.timeline];
                          arr[i] = { ...arr[i], icon: v };
                          update('timeline', arr);
                        }} className="w-64" />
                        <button onClick={() => update('timeline', content.timeline.filter((_, idx) => idx !== i))} className="text-red-600 font-bold text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => update('timeline', [...content.timeline, { event: '', description: '', time: '', icon: 'fas fa-star' }])}
                    className="bg-gray-200 hover:bg-gray-300 text-dark font-bold py-2 px-4 rounded-lg transition duration-300"
                  >
                    + Add Timeline Item
                  </button>
                </div>
              </Section>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            <a
              href={viewSiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 hover:bg-gray-300 text-dark font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              View Site
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-crimson hover:bg-burgundy text-white font-bold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleResetAll}
              disabled={saving}
              className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-50"
            >
              Reset All
            </button>
            <button
              onClick={handleResetBroken}
              className="bg-gray-200 hover:bg-gray-300 text-dark font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Reset Broken Images
            </button>
            <button onClick={onLogout} className="bg-transparent border-2 border-gray-300 hover:border-crimson text-dark font-bold py-3 px-8 rounded-lg transition duration-300">
              Logout
            </button>
            <button onClick={onClose} className="bg-transparent border-2 border-gray-300 hover:border-crimson text-dark font-bold py-3 px-8 rounded-lg transition duration-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold font-serif text-crimson mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block font-serif font-bold text-dark mb-2 text-sm">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-crimson font-serif"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-crimson"
        />
      )}
    </div>
  );
}

function ImageInput({
  label,
  value,
  onChange,
  onUpload,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <div className={`md:col-span-2 ${className}`.trim()}>
      <label className="block font-serif font-bold text-dark mb-2 text-sm">{label}</label>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Image URL or upload below"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-crimson mb-2"
          />
          <input type="file" accept="image/*" onChange={onUpload} className="text-sm text-gray-500" />
        </div>
        {value && (
          <div className="w-32 h-32 flex-shrink-0">
            <img src={value} alt={label} className="w-full h-full object-cover rounded-lg border-2 border-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
}
