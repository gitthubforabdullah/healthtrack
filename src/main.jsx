import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import HealthApp from './HealthApp';
import PublicSite from './public/PublicSite';
import { SITE_NAME, SITE_URL } from './site-config';
import './styles.css';
import './public/public.css';

function AppRoute() {
  const pathname = window.location.pathname.length > 1
    ? window.location.pathname.replace(/\/+$/, '')
    : '/';

  useEffect(() => {
    if (pathname === '/app') {
      document.title = `Log in | ${SITE_NAME}`;
      const upsertMeta = (name, content) => {
        let el = document.head.querySelector(`meta[name="${name}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };
      upsertMeta('description', 'Sign in to your private HealthTrack dashboard.');
      upsertMeta('robots', 'noindex,nofollow');
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `${SITE_URL}/app`;
    }
  }, [pathname]);

  if (pathname === '/app') return <HealthApp />;
  return <PublicSite pathname={pathname} />;
}

createRoot(document.getElementById('root')).render(<AppRoute />);
