import type { Metadata } from "next";
import Link from "next/link";
import './global.css';

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
      <body>
        <nav>
          <h1>Yet To Do</h1>
          <ul>
            <li><Link href="./">Home</Link></li>
            <li><Link href="movies">Movies</Link></li>
            <li><Link href="comics">Comics</Link></li>
            <li><Link href="animation">Animation</Link></li>
            <li><Link href="books">Books</Link></li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
