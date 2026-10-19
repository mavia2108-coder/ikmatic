# Ikmatic website

Static site: plain HTML, CSS and vanilla JS. No build step. Works on GitHub Pages.

## 1. File tree

```
index.html            Homepage
driving-schools.html  Driving schools page
privacy.html          Privacy notice TEMPLATE (needs legal review)
terms.html            Website terms TEMPLATE (needs legal review)
404.html              Not-found page (uses root-absolute asset paths)
robots.txt            Crawler rules and sitemap link
sitemap.xml           Page list
CNAME.example         Rename to CNAME for a custom domain
favicon.ico           Add this yourself, in the repository root
assets/css/styles.css All styling
assets/js/main.js     Config block, menu, FAQ, form, year, fade-up
assets/img/           Add your prepared logos, icon, favicons and social image here
```

The image files and favicon.ico are NOT included in this package. Copy your prepared files into `assets/img/` and the root using the exact file names listed in the brief.

The header and footer are copied into every page. Change them in all pages together.

## 2. Placeholders to fill

**In `assets/js/main.js` (the `CONFIG` block at the top):**

| Key | What to set |
|---|---|
| `SITE_URL` | Your final address, for example `https://ikmatic.co.uk` |
| `CONTACT_EMAIL` | Public contact email. Shown in the footer and used for the mailto fallback |
| `FORM_ENDPOINT` | Form service URL (see below) |
| `DEMO_TURNAROUND_DAYS` | Number of working days for a demo |
| `NOTICE_PERIOD_DAYS` | Cancellation notice, for example 30. Shown only if set |
| `PRICES` | `{ setup: 500, monthly: 199 }` in GBP. Shown as "from" prices only if both are set |

Anything left empty is hidden or replaced with honest wording.

**In the HTML files, `robots.txt` and `sitemap.xml`:** find and replace `https://YOUR-DOMAIN` with your `SITE_URL`. Social crawlers do not run JavaScript, so canonical and Open Graph URLs must be set in the HTML.

**In `privacy.html` and `terms.html`:** replace `[ENTITY NAME]`, `[ADDRESS]`, `[CONTACT EMAIL]`, `[RETENTION PERIOD]`, `[FORM PROVIDER]`, the governing law and the liability clause. Have a qualified person review both pages, then delete the template notices.

**In `404.html`:** on a project site (`USERNAME.github.io/REPO/`) change `/assets` to `/REPO/assets` and `href="/"` to `href="/REPO/"`.

### Form setup

*Formspree:* create an account, create a form, copy the form URL (`https://formspree.io/f/xxxxxxx`) into `FORM_ENDPOINT`.

*Web3Forms:* get an access key for your email, then use `https://api.web3forms.com/submit`. Add `<input type="hidden" name="access_key" value="YOUR_KEY">` inside each `<form>`.

Either service becomes a data processor. Name it in `privacy.html`.

### Analytics

None is included and no cookies are set. If you want analytics later, use a privacy-friendly, cookie-free service such as Plausible or Simple Analytics, and update the privacy notice first.

## 3. Deploy on GitHub Pages

1. Create a new public repository on GitHub.
2. Upload all files (Add file > Upload files, or `git add . && git commit && git push`). Keep the folder structure.
3. Go to Settings > Pages. Under Build and deployment choose Deploy from a branch, branch `main`, folder `/ (root)`. Save.
4. Wait a minute or two. The URL appears at the top of the Pages settings: `https://USERNAME.github.io/REPO/`.
5. Custom domain (optional): rename `CNAME.example` to `CNAME` and put your domain in it. In your DNS, for an apex domain add four A records (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`). For `www`, add a CNAME record pointing to `USERNAME.github.io`. Enter the domain in Settings > Pages.
6. Tick Enforce HTTPS once the certificate is ready.

## 4. Pre-launch checklist

- [ ] CONFIG values set; `https://YOUR-DOMAIN` replaced everywhere
- [ ] Image files and favicon.ico added; logo `width`/`height` attributes match your real image sizes
- [ ] Form tested end to end, including error and success messages
- [ ] Tested on a real phone (360 px wide) and a desktop: no sideways scrolling
- [ ] Contrast checked (for example with the WebAIM contrast checker)
- [ ] HTML validated at validator.w3.org
- [ ] Every link and image path checked on the live URL
- [ ] Privacy notice and terms reviewed by a qualified person
- [ ] Social preview checked after sharing a link
