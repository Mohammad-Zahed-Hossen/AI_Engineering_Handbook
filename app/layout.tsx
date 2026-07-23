import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import ReadingProgress from "@/components/shared/ReadingProgress";
import BackToTop from "@/components/shared/BackToTop";
import PageVisitTracker from "@/components/shared/PageVisitTracker";
import ThemeScript from "@/components/shared/ThemeScript";
import {
  getPackageNavItems,
  getModelNavItems,
  getRegistryNavItems,
  getWorkflowNavItems,
  getCheatsheetNavItems,
  getPatternNavItems,
  getDebugGuideNavItems,
  getDecisionGuideNavItems,
  getPrincipleNavItems
} from "@/lib/data";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AENS",
  description: "Personal AI Engineering Knowledge System",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/AENS_LOGO.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AENS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const packages = getPackageNavItems();
  const mlModels = getModelNavItems("ml");
  const dlModels = getModelNavItems("dl");
  const llmModels = getModelNavItems("llm");
  const registry = getRegistryNavItems();
  const workflows = getWorkflowNavItems();
  const cheatsheets = getCheatsheetNavItems();
  const patterns = getPatternNavItems();
  const debugGuides = getDebugGuideNavItems();
  const decisionGuides = getDecisionGuideNavItems();
  const principles = getPrincipleNavItems();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ backgroundColor: "rgb(9 9 11)" }}
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
     >
       <head>
         <ThemeScript />{/* Theme script for preventing flash of unstyled content */}
         <link rel="icon" href="/AENS_LOGO.svg" type="image/svg+xml" />
         <link rel="alternate icon" href="/favicon.ico" sizes="any" />
         <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
       </head>
       <body
         className="h-full flex overflow-hidden bg-background text-foreground text-sm leading-relaxed"
         style={{ backgroundColor: "rgb(9 9 11)" }}
       >
         <PageVisitTracker />
        <ReadingProgress />
        <BackToTop />
        <div className="hidden md:block shrink-0 h-full sticky top-0">
          <Sidebar
            packages={packages}
            mlModels={mlModels}
            dlModels={dlModels}
            llmModels={llmModels}
            registry={registry}
            workflows={workflows}
            cheatsheets={cheatsheets}
            patterns={patterns}
            debugGuides={debugGuides}
            decisionGuides={decisionGuides}
            principles={principles}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <TopBar
            packages={packages}
            mlModels={mlModels}
            dlModels={dlModels}
            llmModels={llmModels}
            registry={registry}
            workflows={workflows}
            cheatsheets={cheatsheets}
            patterns={patterns}
            debugGuides={debugGuides}
            decisionGuides={decisionGuides}
            principles={principles}
          />
          <main id="main-scroll" className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 dark:bg-zinc-950 px-3 py-4 min-[390px]:px-4 min-[390px]:py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
            <div className="w-full min-w-0 max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}