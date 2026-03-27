import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-[#f8f6f1] text-neutral-950 antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}