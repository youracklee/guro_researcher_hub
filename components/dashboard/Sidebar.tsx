"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/matching", icon: Users, label: "Researcher Matching" },
    { href: "/resources", icon: BookOpen, label: "Resources" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col border-r bg-sidebar text-sidebar-foreground">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="">Guro Researcher Hub</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    pathname === item.href
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
