import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://lumera.app"),
  title: {
    default: "لومرا — رزرو آنلاین خدمات زیبایی و مراقبتی",
    template: "%s · لومرا",
  },
  description:
    "متخصص مورد اعتماد خودت را پیدا کن، نمونه‌کار و امتیازها را ببین، زمان مناسب را انتخاب کن و نوبتت را در چند قدم رزرو کن.",
  keywords: [
    "رزرو نوبت پوست",
    "کلینیک زیبایی",
    "متخصص مو",
    "میکاپ عروس",
    "ماساژ",
    "لومرا",
  ],
  authors: [{ name: "LUMERA" }],
  openGraph: {
    title: "لومرا | LUMERA — رزرو آنلاین خدمات زیبایی",
    description:
      "پلتفرم رزرو متخصص‌های زیبایی و مراقبت؛ جستجو، نمونه‌کار، قیمت شفاف و رزرو چندقدمی.",
    locale: "fa_IR",
    type: "website",
    siteName: "لومرا",
    images: [
      {
        url: "/img/og-1200.jpg",
        width: 1200,
        height: 630,
        alt: "لومرا؛ رزرو آنلاین خدمات زیبایی و مراقبتی",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0D0B10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="bg-bg">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Providers>
          <Navbar />
          <main
            id="main"
            className="relative z-10 flex-1 overflow-x-clip pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-0"
          >
            {children}
          </main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
