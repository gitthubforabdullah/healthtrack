import React, { useEffect } from 'react';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '../site-config';

const pageMeta = {
  '/': {
    title: 'HealthTrack | Personal Health & Fitness Tracker',
    description: 'Track daily wellness habits, fitness activity, sleep, water, weight, heart rate and personal health records in one simple dashboard.'
  },
  '/about': {
    title: 'About HealthTrack | Personal Wellness Tracking',
    description: 'Learn why HealthTrack was created and how it helps people organize everyday health and fitness information in one private dashboard.'
  },
  '/features': {
    title: 'HealthTrack Features | Health & Fitness Tracking Tools',
    description: 'Explore HealthTrack features for daily records, health history, fitness trends, sleep, water, exercise, weight and personal wellness notes.'
  },
  '/how-it-works': {
    title: 'How HealthTrack Works | Start Tracking in Minutes',
    description: 'See how to create an account, record daily health and fitness information, review your history and understand your personal trends.'
  },
  '/blog': {
    title: 'HealthTrack Blog | Health & Fitness Tracking Ideas',
    description: 'Read practical ideas for building consistent health and fitness tracking habits, keeping useful records and reviewing your progress.'
  },
  '/contact': {
    title: 'Contact HealthTrack',
    description: 'Get in touch about HealthTrack, share feedback or report a problem with the personal health and fitness tracking website.'
  },
  '/privacy': {
    title: 'Privacy Policy | HealthTrack',
    description: 'Read how the current HealthTrack website uses account information, Supabase storage and browser settings for personal health tracking.'
  },
  '/health-guides': {
    title: 'Health Guides | HealthTrack',
    description: 'Explore simple, non-diagnostic guides for keeping useful records about exercise, sleep, hydration, weight and blood pressure readings.'
  }
};

function useSeo(pathname, noindex = false) {
  useEffect(() => {
    const meta = pageMeta[pathname] || {
      title: `Page Not Found | ${SITE_NAME}`,
      description: SITE_TAGLINE
    };
    document.title = meta.title;

    const setMeta = (name, content) => {
      let el = document.head.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    const setProperty = (property, content) => {
      let el = document.head.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', meta.description);
    setMeta('robots', noindex ? 'noindex,nofollow' : 'index,follow');
    setProperty('og:title', meta.title);
    setProperty('og:description', meta.description);
    setProperty('og:type', 'website');
    setProperty('og:url', `${SITE_URL}${pathname === '/' ? '/' : pathname}`);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE_URL}${pathname === '/' ? '/' : pathname}`);

    document.documentElement.classList.remove('dark');
  }, [pathname, noindex]);
}

const navLinks = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/features', 'Features'],
  ['/how-it-works', 'How It Works'],
  ['/blog', 'Blog'],
  ['/health-guides', 'Health Guides'],
  ['/contact', 'Contact']
];

function Brand() {
  return <a className="public-brand" href="/" aria-label="HealthTrack home">Health<span>Track</span></a>;
}

function PublicLayout({ pathname, children }) {
  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-nav-wrap">
          <Brand />
          <nav className="public-nav" aria-label="Main navigation">
            {navLinks.map(([href, label]) => (
              <a key={href} className={pathname === href ? 'active' : ''} href={href}>{label}</a>
            ))}
          </nav>
          <a className="public-app-button" href="/app">Open app</a>
        </div>
      </header>
      {children}
      <footer className="public-footer">
        <div>
          <Brand />
          <p>{SITE_TAGLINE}</p>
        </div>
        <div className="footer-links">
          <a href="/features">Features</a>
          <a href="/health-guides">Health Guides</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
          <a href="/app">Log in</a>
        </div>
        <div className="footer-note">HealthTrack is for personal tracking and education. It does not provide medical diagnosis or treatment.</div>
      </footer>
    </div>
  );
}

function HomePage() {
  return <>
    <section className="public-hero">
      <div className="hero-copy">
        <span className="eyebrow">PERSONAL HEALTH & FITNESS TRACKING</span>
        <h1>Build a clearer picture of your everyday wellness.</h1>
        <p>Keep daily health and fitness records in one place, review your history and notice patterns in the habits you choose to track.</p>
        <div className="hero-actions">
          <a className="public-primary" href="/app">Start tracking</a>
          <a className="public-secondary" href="/how-it-works">See how it works</a>
        </div>
        <div className="trust-line"><span>✓ Private account</span><span>✓ Simple daily logging</span><span>✓ Trend charts</span></div>
      </div>
      <div className="hero-preview" aria-label="HealthTrack dashboard preview">
        <div className="preview-top"><strong>Today at a glance</strong><span>Personal dashboard</span></div>
        <div className="preview-grid">
          <div><small>Blood pressure</small><b>120/80</b><span>example</span></div>
          <div><small>Heart rate</small><b>72</b><span>BPM example</span></div>
          <div><small>Exercise</small><b>30</b><span>minutes example</span></div>
          <div><small>Sleep</small><b>8</b><span>hours example</span></div>
        </div>
        <div className="preview-chart"><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <p>Example values shown for illustration only.</p>
      </div>
    </section>

    <section className="public-section">
      <div className="section-heading"><span className="eyebrow">WHAT YOU CAN TRACK</span><h2>One simple place for the habits and measurements you care about.</h2></div>
      <div className="public-card-grid three">
        <InfoCard icon="♡" title="Daily health records" text="Save blood pressure, heart rate, weight and personal notes by date." />
        <InfoCard icon="↗" title="Fitness activity" text="Record exercise minutes and review how consistently you are staying active." />
        <InfoCard icon="☾" title="Sleep & hydration" text="Keep simple sleep-hour and water-intake records alongside the rest of your journal." />
      </div>
    </section>

    <section className="public-band">
      <div><span className="eyebrow">YOUR HISTORY, ORGANIZED</span><h2>Turn scattered notes into a useful personal record.</h2><p>Search previous entries, filter by date and review charts without mixing your data with anyone else's account.</p></div>
      <a className="public-secondary" href="/features">Explore all features</a>
    </section>

    <section className="public-section">
      <div className="section-heading"><span className="eyebrow">HEALTH GUIDES</span><h2>Learn how to keep better personal records.</h2><p>Our guides focus on tracking habits and organizing information, not diagnosing conditions.</p></div>
      <div className="public-card-grid three">
        <ArticleCard category="Tracking basics" title="How to build a daily health-tracking habit" href="/health-guides#daily-tracking" />
        <ArticleCard category="Fitness journal" title="What to record when you track exercise progress" href="/health-guides#exercise" />
        <ArticleCard category="Wellness journal" title="Keeping useful sleep and hydration notes" href="/health-guides#sleep-water" />
      </div>
    </section>

    <section className="cta-section"><h2>Ready to start your personal health journal?</h2><p>Create an account and add your first record in a few minutes.</p><a className="public-primary" href="/app">Open HealthTrack</a></section>
  </>;
}

function AboutPage() {
  return <PageIntro eyebrow="ABOUT HEALTHTRACK" title="A simpler way to organize everyday health and fitness records." text="HealthTrack is designed for people who want one clear place to log personal wellness information and review it over time.">
    <div className="split-section">
      <div><h2>Why HealthTrack exists</h2><p>Health information often ends up scattered across notes, apps and memory. HealthTrack brings basic daily records together so you can build a consistent personal history.</p><p>The goal is organization and self-awareness. HealthTrack does not interpret your entries as a diagnosis and does not replace professional medical care.</p></div>
      <div className="value-list"><Value title="Simple by design" text="The interface focuses on a small set of useful daily fields instead of overwhelming you with options."/><Value title="Your records, your account" text="Authenticated users view the records associated with their own account."/><Value title="Built for reflection" text="History, filters and charts help you look back at the information you entered."/></div>
    </div>
    <div className="public-band compact"><div><span className="eyebrow">OUR APPROACH</span><h2>Track first. Interpret carefully.</h2><p>Measurements can have medical meaning, but that meaning depends on context. Use HealthTrack to organize records and discuss health concerns with a qualified professional when needed.</p></div></div>
  </PageIntro>;
}

function FeaturesPage() {
  const features = [
    ['Daily records','Log date, blood pressure, heart rate, weight, exercise, sleep, water and notes.'],
    ['Health history','Review previous entries in a searchable, date-filtered table.'],
    ['Trend charts','Visualize selected measurements across your saved records.'],
    ['Record editing','Correct or update your own records whenever you need to.'],
    ['Personal profile','Keep basic profile information connected to your signed-in account.'],
    ['Dark mode','Switch between light and dark themes and keep the preference in your browser.'],
    ['Daily reminder setting','Save a preferred reminder time in the browser as a personal cue to record your day.'],
    ['Private sign-in','Use account authentication so personal dashboards are not public pages.'],
    ['Mobile-friendly layout','Use the tracker on smaller screens as well as desktop browsers.']
  ];
  return <PageIntro eyebrow="FEATURES" title="Everything you need for a focused personal tracking routine." text="HealthTrack keeps the workflow intentionally straightforward: record, review, filter and reflect.">
    <div className="public-card-grid three feature-grid">{features.map(([title,text],i)=><InfoCard key={title} icon={String(i+1).padStart(2,'0')} title={title} text={text}/>)}</div>
    <div className="cta-section"><h2>See the workflow in four steps.</h2><p>Learn what happens from account creation to reviewing your trends.</p><a className="public-primary" href="/how-it-works">How HealthTrack works</a></div>
  </PageIntro>;
}

function HowItWorksPage() {
  const steps = [
    ['1','Create your account','Sign up with your email and password, then log in to reach your private dashboard.'],
    ['2','Add a daily record','Choose a date and enter only the measurements or habits you want to keep in your journal.'],
    ['3','Review your history','Search previous entries, filter by date and edit or remove records when necessary.'],
    ['4','Look for personal patterns','Use the analytics view to review your own trends over time. For medical interpretation, speak with a qualified professional.']
  ];
  return <PageIntro eyebrow="HOW IT WORKS" title="From first record to useful personal history." text="You do not need a complicated setup. HealthTrack is built around a repeatable four-step routine.">
    <div className="steps-list">{steps.map(([n,title,text])=><div className="step-row" key={n}><span>{n}</span><div><h2>{title}</h2><p>{text}</p></div></div>)}</div>
    <section className="public-band compact"><div><span className="eyebrow">GOOD TRACKING HABIT</span><h2>Consistency is more useful than perfection.</h2><p>Choose a realistic routine and record information in a consistent way. Notes about unusual circumstances can make your history easier to understand later.</p></div><a className="public-secondary" href="/health-guides#daily-tracking">Read tracking guide</a></section>
  </PageIntro>;
}

function BlogPage() {
  return <PageIntro eyebrow="BLOG" title="Ideas for building a more useful health and fitness journal." text="Short educational articles about tracking habits, record keeping and getting more value from your own data.">
    <div className="article-list">
      <BlogRow tag="Tracking basics" title="Start small: building a daily health-tracking routine" text="A useful health journal does not have to capture everything. Start with the information that matters to your goal and make the routine easy to repeat." href="/health-guides#daily-tracking" />
      <BlogRow tag="Fitness" title="Use exercise records to focus on consistency, not perfect days" text="Exercise logs are most useful when the format stays consistent. Record the same basic details so you can compare weeks without relying on memory." href="/health-guides#exercise" />
      <BlogRow tag="Sleep & hydration" title="Why context matters in a wellness journal" text="A number can be more useful when it is paired with a short note about schedule changes, travel, illness, unusual activity or other context." href="/health-guides#sleep-water" />
      <BlogRow tag="Data quality" title="How to keep personal records easier to review" text="Use consistent units, check dates before saving and correct obvious entry mistakes. Clean records make charts and comparisons easier to understand." href="/health-guides#record-quality" />
    </div>
  </PageIntro>;
}

function ContactPage() {
  return <PageIntro eyebrow="CONTACT" title="Questions, feedback or a problem to report?" text="HealthTrack is an evolving web project. Feedback about usability, accessibility and tracking features is welcome.">
    <div className="contact-grid">
      <div className="contact-card"><h2>Project feedback</h2><p>The easiest public contact channel for this project is the GitHub repository. You can review the project or open an issue there.</p><a className="public-primary" href="https://github.com/gitthubforabdullah/healthtrack" target="_blank" rel="noreferrer">Open GitHub project</a></div>
      <div className="contact-card"><h2>Health questions</h2><p>HealthTrack does not provide individual medical advice, diagnosis or emergency support. If you have a medical concern, contact an appropriate healthcare professional or local emergency service.</p></div>
    </div>
  </PageIntro>;
}

function PrivacyPage() {
  return <PageIntro eyebrow="PRIVACY" title="Privacy information for the current HealthTrack build." text="This page explains how the current version is designed to handle account, tracking and browser data. It is a project privacy notice, not legal advice.">
    <div className="policy-content">
      <Policy title="Account information"><p>HealthTrack uses Supabase authentication for account sign-up and login. Basic profile details may be associated with your authenticated account.</p></Policy>
      <Policy title="Health and fitness records"><p>When you choose to save a record, the app can store fields such as date, blood pressure, heart rate, weight, exercise minutes, sleep hours, water intake and notes in the configured Supabase database.</p></Policy>
      <Policy title="Browser storage"><p>The current app uses browser local storage for settings such as theme preference and the optional daily reminder time. These settings stay in that browser unless you clear them.</p></Policy>
      <Policy title="Public pages"><p>The pages you are reading are public. Your signed-in dashboard and saved records are intended to be accessed through the authenticated app area rather than published as public website content.</p></Policy>
      <Policy title="Third-party services"><p>The current project relies on services such as Netlify for website hosting and Supabase for authentication and database functionality. Their own privacy terms and infrastructure practices also apply.</p></Policy>
      <Policy title="Medical disclaimer"><p>HealthTrack is a personal record-keeping tool. It does not provide medical diagnosis, treatment recommendations or emergency services.</p></Policy>
      <Policy title="Before a commercial launch"><p>If this project becomes a real public service, review this notice with appropriate legal and privacy expertise and update it to match the exact data practices, retention rules, contact details and applicable laws.</p></Policy>
    </div>
  </PageIntro>;
}

function HealthGuidesPage() {
  return <PageIntro eyebrow="HEALTH GUIDES" title="Better records start with a consistent tracking routine." text="These guides focus on how to organize personal health and fitness information. They are educational and non-diagnostic.">
    <div className="guide-layout">
      <aside className="guide-toc"><strong>On this page</strong><a href="#daily-tracking">Daily tracking</a><a href="#exercise">Exercise journal</a><a href="#sleep-water">Sleep & water</a><a href="#blood-pressure">Blood pressure records</a><a href="#record-quality">Record quality</a></aside>
      <div className="guide-content">
        <Guide id="daily-tracking" title="Building a daily tracking habit"><p>Choose a small set of fields that connect to your reason for tracking. Record them at roughly the same point in your routine when possible, and use notes when the day was unusual.</p><p>Missing a day does not make the journal useless. Resume the routine rather than filling gaps from memory when you are unsure.</p></Guide>
        <Guide id="exercise" title="Keeping an exercise journal"><p>Use a consistent unit such as minutes for activity duration. If the type or intensity of activity matters to you, add a short note so later entries have context.</p><p>Review longer patterns instead of judging progress from one unusually active or inactive day.</p></Guide>
        <Guide id="sleep-water" title="Tracking sleep and water"><p>For sleep, decide what your entry means and keep that definition consistent. For water, use the same cup or glass convention when possible so entries are comparable.</p><p>These records describe your routine; they do not by themselves determine whether your sleep or hydration is medically adequate.</p></Guide>
        <Guide id="blood-pressure" title="Keeping blood pressure records"><p>If you track blood pressure, enter the values exactly as measured and confirm that systolic and diastolic values have not been swapped. Add notes about measurement circumstances when useful.</p><p>HealthTrack stores readings but does not diagnose them. Follow instructions from your healthcare professional or validated measurement guidance for how and when to take readings.</p></Guide>
        <Guide id="record-quality" title="Making records easier to review"><p>Check dates, units and obvious typing errors before saving. Use notes for context rather than changing the meaning of a field from one day to another.</p><p>When you edit a mistaken entry, keep the corrected value as faithful as possible to what was actually measured or recorded.</p></Guide>
        <div className="guide-warning"><strong>Important:</strong> If a measurement or symptom worries you, seek appropriate professional medical advice. Do not rely on this website to decide whether a situation is urgent.</div>
      </div>
    </div>
  </PageIntro>;
}

function NotFoundPage() {
  return <PageIntro eyebrow="404" title="That page was not found." text="The address may have changed or the page may no longer exist."><a className="public-primary" href="/">Return home</a></PageIntro>;
}

function PageIntro({ eyebrow, title, text, children }) {
  return <main className="public-main"><section className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></section>{children}</main>;
}
function InfoCard({icon,title,text}) { return <article className="info-card"><span className="card-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>; }
function ArticleCard({category,title,href}) { return <article className="article-card"><span>{category}</span><h3>{title}</h3><a href={href}>Read guide →</a></article>; }
function Value({title,text}) { return <div><strong>{title}</strong><p>{text}</p></div>; }
function BlogRow({tag,title,text,href}) { return <article className="blog-row"><div><span>{tag}</span><h2>{title}</h2><p>{text}</p></div><a href={href}>Read more →</a></article>; }
function Policy({title,children}) { return <section><h2>{title}</h2>{children}</section>; }
function Guide({id,title,children}) { return <section id={id}><h2>{title}</h2>{children}</section>; }

export default function PublicSite({ pathname }) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  const pages = {
    '/': <HomePage />,
    '/about': <AboutPage />,
    '/features': <FeaturesPage />,
    '/how-it-works': <HowItWorksPage />,
    '/blog': <BlogPage />,
    '/contact': <ContactPage />,
    '/privacy': <PrivacyPage />,
    '/health-guides': <HealthGuidesPage />
  };
  const found = pages[normalized];
  useSeo(found ? normalized : '/404', !found);
  return <PublicLayout pathname={normalized}>{found || <NotFoundPage />}</PublicLayout>;
}
