import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { 
  getPackageNavItems, 
  getModelNavItems, 
  getRegistryTasks, 
  getWorkflowNavItems, 
  getAllCheatsheetIds 
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
  title: "AI Engineering Handbook",
  description: "Personal AI Engineering Knowledge System",
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
  const registryTasks = getRegistryTasks();
  const workflows = getWorkflowNavItems();
  const cheatsheets = getAllCheatsheetIds();

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="h-full flex overflow-hidden bg-background text-foreground text-sm leading-relaxed">
        {/* Sidebar Navigation (Desktop only) */}
        <div className="hidden md:block shrink-0 h-full">
          <Sidebar 
            packages={packages}
            mlModels={mlModels}
            dlModels={dlModels}
            llmModels={llmModels}
            registryTasks={registryTasks}
            workflows={workflows}
            cheatsheets={cheatsheets}
          />
        </div>

        {/* Dynamic Main Workspace panel */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <TopBar 
            packages={packages}
            mlModels={mlModels}
            dlModels={dlModels}
            llmModels={llmModels}
            registryTasks={registryTasks}
            workflows={workflows}
            cheatsheets={cheatsheets}
          />
          <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="max-w-4xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
