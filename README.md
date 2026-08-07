# yze.design

Portfolio website for YZE. The main site is a static HTML, CSS, and JavaScript
project. Shared layout, navigation, project data, media behaviour, and
presentation behaviour live in the root-level system; selected microsites and
process pages remain self-contained.

## Local setup

The site has no build step or package dependencies. Serve the repository root
over HTTP so that shared partials and JSON data can be fetched:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

Opening pages directly from the filesystem is not supported because browsers
restrict the `fetch()` calls used for partials, projects, reviews, archive
content, and presentation slides.

Deployment is configured in `.cpanel.yml`, which synchronises the repository
to the cPanel web root.

## Directory structure

```text
/
├── index.html              Landing page
├── css/                    Shared variables, typography, layout and cursor styles
├── js/                     Shared site behaviour
├── partials/               Shared header and footer
├── data/                   Project and review content
├── assets/                 Shared fonts and media
├── work/                   Project listing
├── archive/                Archive page and archive data
├── analyst/                Analyst presentation, slide manifest and media
├── tictactoad/             Tictactoad presentation, slide manifest and media
├── about/, contact/        General information pages
├── brand/                  Brand page
├── curve/, democratising/  Project pages
├── dynamic/, offgrid/      Project pages
├── papas/, tamagotchu/     Project pages
├── m/                      Standalone microsites
├── */process/              Standalone project process pages
├── arts/                   Standalone Arts site
├── blog.yze.design/        Blog subdomain files
└── !OG/                    Legacy reference files
```

The shared page system loads `/css/`, `/js/`, and the header and footer from
`/partials/`. Project content is sourced from `/data/projects.json`.
Presentation pages use `/js/presentation.js` and their own `slides.json`
manifests.

Files in `/m/`, microsite directories, and `/process/` are intentionally
self-contained and should not be migrated into the shared system without
checking them individually.
