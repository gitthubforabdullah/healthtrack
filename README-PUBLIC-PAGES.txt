HealthTrack public SEO pages
============================

Added public routes:
/                 Home
/about            About
/features         Features
/how-it-works     How It Works
/blog             Blog
/contact          Contact
/privacy          Privacy Policy
/health-guides    Health Guides
/app              Existing private HealthTrack login/dashboard (noindex)

SEO files included:
public/sitemap.xml
public/robots.txt
public/google73af7aeed960207e.html
public/_redirects

IMPORTANT
- SITE_URL is currently https://myfittpro.netlify.app in src/site-config.js.
- If you rename your Netlify subdomain, update src/site-config.js, public/sitemap.xml,
  public/robots.txt, and the canonical/OG URL in index.html.
- The Privacy Policy is a project starter notice, not legal advice.

To use with your current GitHub project:
1. Back up your current project.
2. Copy these files into the current repository, preserving .git and any Netlify settings.
3. Run: npm install
4. Run: npm run dev
5. Test / and /app.
6. Commit and push:
   git add .
   git commit -m "Add public SEO pages"
   git push

After Netlify deploys, re-submit sitemap.xml in Google Search Console.
