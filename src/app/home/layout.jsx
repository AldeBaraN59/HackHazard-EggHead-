import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/ui/app-sidebar"
import { ModeToggle } from "@/components/modeToggle"
import { ThemeProvider } from "@/components/theme-provider"

export default function Layout({ children }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <div className="relative flex h-screen overflow-hidden">
                    <AppSidebar />
                    <main className="relative flex flex-1 flex-col overflow-y-auto">
                        
                        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
                            <SidebarTrigger />
                            <div className="ml-auto">
                                <ModeToggle />
                            </div>
                        </header>
                        <div className="flex-1 p-4">
                            {children}
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        </ThemeProvider>
        
    )
}