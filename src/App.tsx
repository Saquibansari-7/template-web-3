import { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import Site from './components/Site';
import AdminPasswordGate from './components/admin-password-gate/AdminPasswordGate.tsx';
import { WebsiteContent } from './types';
import { loadContent, loadContentByCustomer, type LoadContentByCustomerResult } from './services/loadContent';
import { defaultContent } from './context/WebsiteContext';
import { loadLocalData } from './services/loadLocalData';

const EXPECTED_TEMPLATE_ID = 'royal-red';

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

function validateCustomer(subdomain: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/.test(subdomain);
}

export default function App() {
  const [adminOpen, setAdminOpen] = useState(() => {
    const path = window.location.pathname;
    return path === '/admin' || path.startsWith('/admin/');
  });
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [site, setSite] = useState<LoadContentByCustomerResult['site'] | null>(null);
  const [ready, setReady] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [passwordResetKey, setPasswordResetKey] = useState(0);

  const customer = (() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('customer')?.trim().toLowerCase() || null;
  })();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (customer && customer.trim()) {
        const subdomain = customer.trim().toLowerCase();
        if (!validateCustomer(subdomain)) {
          setNotFound(true);
          setReady(true);
          return;
        }

        try {
          const result = await withTimeout(loadContentByCustomer(subdomain), 5000);
          if (!cancelled && result) {
            if (result.site.template_id && result.site.template_id !== EXPECTED_TEMPLATE_ID) {
              console.warn('[App] site template_id mismatch:', result.site.template_id);
              setNotFound(true);
              setReady(true);
              return;
            }
            if (result.site.status && result.site.status !== 'active') {
              console.warn('[App] site status is not active:', result.site.status);
              setNotFound(true);
              setReady(true);
              return;
            }
            setContent(result.content);
            setSite(result.site);
            setReady(true);
            return;
          }
        } catch (err) {
          console.error('[App] customer load failed:', err);
        }
        setNotFound(true);
        setReady(true);
        return;
      }

      if (adminOpen) {
        setReady(true);
      }

      try {
        const local = await withTimeout(loadLocalData(), 5000);
        if (!cancelled && local) {
          setContent(local);
          if (!adminOpen) setReady(true);
          return;
        }
      } catch {
        /* fall through to Supabase only as last resort */
      }

      if (!cancelled) {
        try {
          const result = await withTimeout(loadContent('isabel-kevin'), 5000);
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
  }, [adminOpen, customer]);

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

  if (notFound) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#333', fontFamily: 'serif', fontSize: '2rem' }}>
        404 — Site not found
      </div>
    );
  }

  if (adminOpen) {
    if (!ready) {
      return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
          <div>Loading admin...</div>
        </div>
      );
    }

    return (
      <AdminPasswordGate key={passwordResetKey} customer={customer}>
        <AdminPanel
          initialContent={content}
          site={site}
          onClose={() => setAdminOpen(false)}
          onLogout={() => {
            if (customer) {
              localStorage.removeItem(`admin_pass_${customer}`);
              setPasswordResetKey(k => k + 1);
            }
          }}
        />
      </AdminPasswordGate>
    );
  }

  return <Site content={content} />;
}