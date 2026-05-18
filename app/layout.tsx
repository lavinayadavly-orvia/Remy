import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyDesk",
  description: "Private executive execution assistant for senior healthcare strategy outputs."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
