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
      default: "青烟威 · 5日山海路线",
      template: "%s · 青烟威旅行",
    },
    description: "一份围绕中秋假期、城际动车与沿海点位整理的青岛、烟台、威海旅行攻略。",
    openGraph: {
      type: "website",
      locale: "zh_CN",
      url: origin,
      title: "青烟威 · 沿着海岸，慢慢换城",
      description: "2026.09.25—09.29｜地图点位、换城动线、抢票提醒与逐日安排",
      images: [{ url: imageUrl, width: 1735, height: 910, alt: "青烟威沿海旅行手帖" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "青烟威 · 沿着海岸，慢慢换城",
      description: "2026.09.25—09.29｜5日山海路线",
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
