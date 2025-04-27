'use client';
import { useEffect, useState } from "react";
import { Calendar, Gamepad, Home, Inbox, Settings, User2, ChevronUp } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Identity, Avatar, Name, Badge, Address } from "@coinbase/onchainkit/identity";
import Link from "next/link";

// Menu items.
const items = [
    { title: "Home", url: "/home", icon: Home },
    { title: "Notifications", url: "#", icon: Inbox },
    { title: "Become a member", url: "#", icon: Gamepad },
    { title: "Settings", url: "#", icon: Settings },
];

const creators = [
    { title: "Cgp grey", url: "#", icon: Settings },
    { title: "Pewdipie", url: "#", icon: Settings },
    { title: "Mr. Beast", url: "#", icon: Settings },
    { title: "BeastBoyShub", url: "#", icon: Settings },
    { title: "Technoblade", url: "#", icon: Settings },
];

export function AppSidebar() {
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            // Check if wallet is connected
            window.ethereum.request({ method: "eth_accounts" })
                .then(accounts => {
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                    }
                })
                .catch(error => {
                    console.error("Error fetching wallet address:", error);
                });
        }
    }, []);

    if (!walletAddress) {
        return <div>Loading...</div>; // You can show a loading state here if wallet is not connected
    }

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarSeparator />
                    <SidebarGroupLabel>Memberships</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {creators.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Identity
                                        address={walletAddress}
                                        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                                    >
                                        <Avatar />
                                        <Name>
                                            <Badge />
                                        </Name>
                                        <Address />
                                    </Identity>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/billing_dashboard">
                                    <span>Billing</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}