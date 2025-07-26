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
