import type { Metadata } from "next";
import Provider from "@/core/redux/provider";
import Notification from "@/core/ui/components/Notification";
import localFont from "next/font/local";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Time Planner",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className}>
      <body className="bg-whiteShade">
        <Notification />
        <div id="deleteWarningDialog"></div>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
