import type { Metadata } from "next";
import { headers } from "next/headers";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "青烟威 · 4日海岸线",
      template: "%s · 青烟威旅行",
    },
    description: "2026年9月26日至29日，青岛、烟台、威海四日旅行攻略。",
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: origin,
      title: "青烟威 · 海岸线",
      description: "2026.09.26—09.29｜高德地图点位、换城动线与四日安排",
      images: [{ url: imageUrl, width: 1731, height: 909, alt: "青烟威沿海旅行手帖" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "青烟威 · 海岸线",
      description: "2026.09.26—09.29｜四日三城",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
