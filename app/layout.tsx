import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yet To Do",
  description: "A to do list for many things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
