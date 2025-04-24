import type { Metadata } from "next";
import "./globals.css";
import "./styles/chatbot.css";

export const metadata: Metadata = {
  title: "32Mins Learning Partner Device",
  description: "User Testing Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
