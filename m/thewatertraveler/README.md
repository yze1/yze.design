# The Water Traveler — Website Project

## File Structure

```
thewatertraveler/
├── index.html               ← Home page
├── key-west.html            ← Key West overview
├── yacht-just-chillin.html  ← Yacht Just Chillin' detail
├── in-stay-rentals.html     ← In-Stay Rentals & Services
├── lake-tahoe.html          ← Lake Tahoe overview
├── winter-excursions.html   ← Winter Excursions & Add-Ons
├── san-francisco.html       ← San Francisco (new)
├── our-crew.html            ← Our Crew
├── contact.html             ← Contact
├── css/
│   └── styles.css           ← All shared styles
├── js/
│   └── main.js              ← Hamburger nav + form logic
├── images/                  ← Drop your photos here
│   ├── hero-home.jpg
│   ├── hero-keywest.jpg
│   ├── hero-yacht.jpg
│   ├── hero-instay.jpg
│   ├── hero-tahoe.jpg
│   ├── hero-winter.jpg
│   ├── hero-sf.jpg
│   ├── hero-crew.jpg
│   ├── hero-contact.jpg
│   ├── feature-why-twt.jpg
│   ├── feature-keywest-addons.jpg
│   ├── feature-tahoe-intro.jpg
│   ├── feature-tahoe-winter.jpg
│   ├── feature-sf.jpg
│   ├── winter-boat.jpg
│   ├── winter-holiday.jpg
│   ├── winter-shuttle.jpg
│   ├── winter-snowshoe.jpg
│   ├── crew-ali.jpg
│   ├── crew-larry.jpg
│   └── crew-kevin.jpg
└── _partials.html           ← Reference: copy/paste nav & footer snippets
```

## Adding Your Images

1. Put all your photos in the `images/` folder using the filenames above.
2. That's it — every page already references them by those names.

If you'd like to use different filenames, do a find & replace in the HTML files
for the old name → new name.

## Deploying to Netlify

1. Drag the entire `thewatertraveler/` folder into app.netlify.com
2. Netlify will serve `index.html` as the homepage automatically.
3. All internal links use relative paths so they work without any config.

## Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| > 900px | Full desktop nav, 3-col grids |
| 600–900px | Hamburger nav, 2-col crew/footer |
| < 600px | Single column everything, stacked buttons |
