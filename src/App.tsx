import { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Site from './components/Site';
import { WebsiteContent } from './types';
import { loadContent } from './services/loadContent';
import { defaultContent } from './context/WebsiteContext';
import { loadLocalData } from './services/loadLocalData';

function withTimeout(promise: Promise<any>, ms: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

export default function App() {
  const [adminOpen, setAdminOpen] = useState(() => {
    const path = window.location.pathname;
    return path === '/admin' || path.startsWith('/admin/');
  });
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('adminAuth') === 'true');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Don't block the admin UI on a slow/failed network call.
    if (adminOpen) setReady(true);

    (async () => {
      // data.json is the single source of truth for both the public site and
      // the admin. Load it first; only fall back to Supabase if it's missing
      // (never as an override, to avoid showing a different/stale record).
      try {
        const local = await withTimeout(loadLocalData(), 5000);
        if (!cancelled && local) {
          setContent(local);
          return;
        }
      } catch {
        /* fall through to Supabase only as last resort */
      }

      if (!cancelled) {
        try {
          const result = await withTimeout(loadContent('default'), 5000);
          if (result) setContent(result);
        } catch {
          /* keep default content */
        } finally {
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [adminOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (adminOpen) {
    if (!authenticated) {
      return <AdminLogin onLogin={() => setAuthenticated(true)} onClose={() => setAdminOpen(false)} />;
    }

    if (!ready) {
      return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
          <div>Loading admin...</div>
        </div>
      );
    }

    return (
      <AdminPanel
        initialContent={content}
        onClose={() => setAdminOpen(false)}
        onLogout={() => {
          sessionStorage.removeItem('adminAuth');
          setAuthenticated(false);
          setAdminOpen(false);
        }}
      />
    );
  }

  return <Site content={content} />;
}
