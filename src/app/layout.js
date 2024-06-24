import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundries";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dog Breeds",
  description: "Get Dog breed details",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        </body>
    </html>
  );
}
