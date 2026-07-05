# Abdul Shakoor - Animated Developer Portfolio

A high-fidelity, interactive, and responsive multi-page developer portfolio tailored for a Full-Stack Web Developer & AI Automation Engineer. Designed with a custom playful retro-terminal/comic aesthetic utilizing bold accent borders, custom terminal frames, breathing gradients, and smooth hover micro-animations.

## 📂 Site Structure & Pages

1. **Home (`index.html`)** — Hero interactive terminal typing loop, rotating bio descriptions, skill tag list, and featured project grids.
2. **About Me (`about.html`)** — Dynamic bio, work experience timeline with drawing connector paths, SZABIST AI studies cards.
3. **Skills (`skills.html`)** — Categorized technical competency dashboard with animated progress bar sliders.
4. **Projects (`projects.html`)** — Portfolio grid filtering by category (Full-Stack, AI Automations, Mobile Apps).
5. **Contact (`contact.html`)** — Integrated direct communication cards (Gmail compose & WhatsApp click-to-chat links) and an interactive AJAX console form.

---

## 🛠️ Technical Stack & Architecture

- **Core**: HTML5 + Vanilla CSS3 (Custom design system with CSS custom properties) + Vanilla Javascript.
- **Typography**: Space Grotesk (headings) and Space Mono (code/mono variables) imported from Google Fonts.
- **Icons**: Responsive SVGs via Lucide Icons CDN.
- **Forms**: Zero-configuration AJAX integration with FormSubmit.

---

## ⚡ Interactive Features & Animation Engine

### 1. Retro Terminal Typing (Home Page)
- Implemented a multi-stage typed loop sequence inside `#hero-terminal-body`.
- Dynamically prints the introductory lines with blinking cursor loops, counts progress percentages in real-time, and beams static system status cards.

### 2. Scroll-Linked Drawing Line Segment (About Page)
- Connector line segments (`.timeline-item::before`) are styled with a gradient shifting color loop (`flow-line`).
- As job cards scroll into view, their specific line segment draws down to the next dot in sync.
- Active cards execute an alternate breathing float loop (`float-card`) to make sections feel responsive and alive.

### 3. AJAX Submission & Mailto Fallback (Contact Page)
- Intercepts form submissions using `e.preventDefault()`.
- Disables the submit button, sets it to `"Deploying..."`, and prints `> Sending payload...` to the terminal log.
- Submits inputs as a `FormData` POST to FormSubmit. On success, prints `> Message delivered successfully ✓` and resets fields.

---

## 🚀 How to Set Up & Deploy

### Running Locally
To launch a local development server, run:
```bash
npm install
npm run dev
```

### Form Activation (FormSubmit)
1. The contact form points to `https://formsubmit.co/ajax/a.shakoor9744@gmail.com`.
2. **Important**: The first time you submit the form on the live site, FormSubmit will send a verification email to **`a.shakoor9744@gmail.com`**.
3. Open Gmail, click **"Activate Form"** to confirm your email, and the form is fully functional!
