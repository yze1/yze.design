# brandname static site

Minimal streetwear template for small brands.

The purpose of this site is to provide a minimalist streetwear page for small
brands. It is designed as a reusable template that can be changed easily to fit
a brand's visual identity and product catalogue. Payments and customer messages
can be implemented externally using links to Shopify, email marketing tools, or
similar services.

## Implemented changes

- Brutalist, hyperlegible typography.
- Header: Home, Shop, About left; brandname centered; Contact and Shopify right.
- White loading screen with placeholder logo.
- Hero text overlay removed; email signup remains bottom-centred.
- Email signup posts to the private server-side `subscribe.php` handler.
- Product gallery loads from this project folder's `data/products.json`.
- Product gallery uses two horizontally scrollable rows.
- Product thumbnail paths point to the local `products/product_slug/thumbnail.jpeg` folders.
- Product data includes `name`, `description`, `thumbnailImage`, and `additionalImages`.
- Product popups cycle through each product's local images after `thumbnail.jpeg`.
- Product pages load product data by JavaScript.
- Product popup close control uses `assets/icons/close.svg`.
- CSS includes a `--brand-colour` variable in this project's `css/styles.css` for changing the core brand colour from one place.
- About page includes placeholder contact details: `hello@brandname.com` and `+44 1234 567890`.
- Footer has Instagram, YouTube, TikTok icons and full-width `brandname©2026`.

## Mailing list setup

The public site folder contains `subscribe.php`, but the Brevo credentials are
loaded from `private-config.php` one directory above this folder. On cPanel-style
hosting, place it outside `public_html`, for example:

```php
<?php
return [
    'brevo_api_key' => 'your-brevo-api-key',
    'brevo_list_id' => 2,
];
```

Do not put the real Brevo API key in HTML, CSS, or public JavaScript files.

## Placeholder areas

Brand logo, brand colour, hero video, poster image, product images, Shopify URLs,
social links, product copy, contact email, contact number.
