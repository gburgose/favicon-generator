This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables Setup

This project uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

### Required Environment Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://favicon-generator-beige.vercel.app
NEXT_PUBLIC_GTM_ID=GTM-P7FQSKFN
```

### Default Values

If the environment variables are not set, the application will use these default values:

- `NEXT_PUBLIC_SITE_URL`: `https://favicon-generator-beige.vercel.app`
- `NEXT_PUBLIC_GTM_ID`: `GTM-P7FQSKFN`

### Development Setup

1. Copy the example above to `.env.local`
2. Modify the values as needed for your environment
3. Restart the development server

### Production Setup

For production deployments (Vercel, Netlify, etc.), set these environment variables in your hosting platform's dashboard.

### Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- The `.env.local` file should not be committed to version control
- Always use HTTPS URLs for production environments

## Google Tag Manager Events

This project uses Google Tag Manager (GTM) to track user interactions. Below are the events available for each tool:

### Converter Events

The following events are triggered in the `/converter` page, ordered by user flow:

1. **`converter_image_uploaded`** - When user uploads an image via dropzone
   - Data: `file_name`, `file_size_mb`, `file_type`

2. **`converter_image_from_generator`** - When an image is loaded from the generator tool

3. **`converter_app_configured`** - When user configures app settings
   - Data: `app_name`, `theme_color`, `has_description`

4. **`converter_small_image_warning`** - When a small image warning is shown
   - Data: `image_width`, `image_height`, `recommended_size`

5. **`converter_generation`** - When favicon generation starts

6. **`converter_generation_error`** - When favicon generation fails
   - Data: `error_type`, `success: false`

7. **`converter_download`** - When favicon package download starts

8. **`converter_meta_tags_copied`** - When user copies meta tags

9. **`converter_manifest_copied`** - When user copies manifest

10. **`converter_all_cleared`** - When user clears all data

### Generator Events

The following events are triggered in the `/generator` page, ordered by user flow:

1. **`generator_tab_changed`** - When user changes between Text, Icons, or SVG tabs
   - Data: `tab_name`

2. **`generator_text_changed`** - When user modifies the text input
   - Data: `text_length`, `text_content`

3. **`generator_font_changed`** - When user selects a different font
   - Data: `font_name`

4. **`generator_icon_selected`** - When user selects an icon from the library
   - Data: `icon_name`

5. **`generator_svg_uploaded`** - When user uploads an SVG file
   - Data: `file_name`, `file_size_mb`

6. **`generator_background_color_changed`** - When user changes background color
   - Data: `color`

7. **`generator_text_color_changed`** - When user changes text color
   - Data: `color`

8. **`generator_fill_color_changed`** - When user changes fill color (for icons/SVGs)
   - Data: `color`

9. **`generator_stroke_color_changed`** - When user changes stroke color (for icons/SVGs)
   - Data: `color`

10. **`generator_align_vertical`** - When user clicks vertical alignment button

11. **`generator_align_horizontal`** - When user clicks horizontal alignment button

12. **`generator_download`** - When user downloads the generated favicon

13. **`generator_send_to_converter`** - When user sends the favicon to the converter tool
