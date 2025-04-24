import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/ui/app-sidebar"
import { ModeToggle } from "@/components/modeToggle"
import { ThemeProvider } from "@/components/theme-provider"

export default function Layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SidebarTrigger />
                    <ModeToggle/>
                    {children}
                </ThemeProvider>
            </main>
        </SidebarProvider>
    )
}
