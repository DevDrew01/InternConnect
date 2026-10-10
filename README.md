# InternConnect

A front-end prototype of an OJT / internship management platform with three roles:
**Coordinator**, **Student / Alumni**, and **Industry Partner**.

It is a static site (HTML + Tailwind + vanilla JS). Data is kept in `localStorage`, so there is no backend or build step.

## Run it

Open `index.html` in a browser (or serve the folder with any static server, e.g. `python3 -m http.server`). It redirects to the login page.

## Project structure

```
InternConnect/
├── index.html                  Entry point (redirects to the login page)
├── assets/
│   ├── css/
│   │   └── styles.css          Shared styles and theme variables
│   └── js/
│       ├── theme.js            Applies the logged-in user's colour theme (loaded first)
│       └── script.js           App logic: navigation, storage, and all page behaviour
└── pages/
    ├── auth/                   Sign in and sign up
    │   ├── login.html
    │   ├── forgot-password.html
    │   └── register-{coordinator,student,partner}-{1,2,3}.html
    ├── coordinator/            Coordinator dashboard
    │   ├── overview, classes, roster, requests, classwork,
    │   │   task-detail, attendance, directory, audit,
    │   │   placements, intern  (.html)
    └── student/                Student / alumni portal
        └── overview, attendance, day-log, classwork,
            task-detail, resume-builder, job-matching  (.html)
```

## Conventions

- Every page lives exactly one folder below `pages/`, so shared assets are always referenced as `../../assets/...` and other pages as `../<section>/<page>.html`.
- Page links used by JavaScript are defined once at the top of `assets/js/script.js` (`pages`, `studentPages`, `registerPages`). Update them there when adding or renaming a page.
- File names are lowercase kebab-case, without role prefixes (the folder already says which role a page belongs to).
