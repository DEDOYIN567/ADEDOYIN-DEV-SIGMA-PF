# Adedoyin Adebola Samuel | Portfolio and Academic Planner

A responsive, multi-page student portfolio and academic management website, built with semantic HTML5, CSS and vanilla JavaScript. There are no frameworks and no build step: every page is plain HTML that runs directly in the browser.

**Live site:** https://adedoyin-sigma-pf.vercel.app  
**Repository:** https://github.com/DEDOYIN567/ADEDOYIN-SIGMA-PF

Built for **COS 106: Introduction to Web Technologies**, Miva Open University.

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Welcome section with rolling role words, photograph, skills and tools, short biography |
| About | `about.html` | Audio introduction, education, experience, career aspirations, technical skills table, hobbies and interests |
| Projects | `projects.html` | Three projects with descriptions, screenshots and links, plus live search |
| Planner | `planner.html` | Task manager with email and calendar reminders, plus a course transcript and grade calculator |
| Contact | `contact.html` | Validated message form delivered by email |
| CV | `resume.html` | Printable curriculum vitae |
| Not found | `404.html` | Custom error page |

## Features

- **Academic planner:** add, complete, delete, search and filter tasks; four-stage status; overdue flags; progress bar; backup export and import. Tasks are saved in the browser with `localStorage`.
- **Reminders:** email reminders through EmailJS, and downloadable calendar alerts (`.ics`).
- **Contact form:** JavaScript validation (no empty field, valid email format, digits-only phone number) and delivery through Formspree.
- **Audio introduction:** a custom player built on the `<audio>` element, with play and pause, seek bar, speed control, mute and a waveform animation.
- **Theme:** light and dark mode, remembered between visits.
- **Responsive:** mobile-first layout using CSS Grid and Flexbox, with a menu for small screens.
- **Accessible:** skip link, labelled form controls, visible focus, keyboard support and reduced-motion support.

## Technologies

HTML5 · CSS3 (custom properties, Grid, Flexbox, transitions) · JavaScript (ES6+) · Web Storage API · EmailJS · Formspree · Git and GitHub · Vercel

## Project structure

```
.
├── index.html  about.html  projects.html  planner.html  contact.html  resume.html  404.html
├── css/
│   └── styles.css          one external stylesheet for every page
├── js/
│   ├── main.js             theme toggle, mobile menu, footer year
│   ├── extras.js           rolling role words, header date, planner search, backup and transcript
│   ├── planner.js          task manager and reminders
│   ├── contact.js          form validation and sending
│   ├── projects.js         project search
│   └── about.js            audio player
├── assets/
│   ├── audio/              recorded introduction
│   └── images/             portrait, project screenshots, skill illustrations
├── vercel.json             security headers for hosting
└── README.md
```

## Run locally

Open `index.html` in a browser, or serve the folder so paths behave exactly as they do online:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`. In VS Code you can also use the Live Server extension, opened on this folder.

## Deployment

The site is static, so it is hosted straight from this repository: GitHub holds the source and Vercel serves it. Every push to the `main` branch publishes a new version automatically.

## Author

Adedoyin Adebola Samuel, Abuja, Nigeria.
