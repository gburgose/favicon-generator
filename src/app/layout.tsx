import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "Favicon Generator",
  description: "Generate favicons in multiple sizes from your image",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: 'toast-custom',
            style: {
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              className: 'toast-custom success',
              iconTheme: {
                primary: '#231F20',
                secondary: '#7EBDC2',
              },
            },
            error: {
              duration: 4000,
              className: 'toast-custom error',
              iconTheme: {
                primary: '#EFE6DD',
                secondary: '#BB4430',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
