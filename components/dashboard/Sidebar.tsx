"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartLine, FaUsers, FaTrophy, FaFlask, FaSearch, FaBuilding } from "react-icons/fa";
import { signout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
    const pathname = usePathname();
    const menuItems = [
        { name: "핵심 요약 (KPI)", href: "/", icon: FaChartLine },
        { name: "인력 구성 및 분포", href: "/demographics", icon: FaUsers },
        { name: "연구 성과 분석", href: "/performance", icon: FaTrophy },
        { name: "연구 플랫폼 현황", href: "/platforms", icon: FaFlask },
        { name: "연구자 탐색", href: "/search", icon: FaSearch },
        { name: "기업 탐색", href: "/companies", icon: FaBuilding },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0 z-20 shadow-sm">
            <div className="h-auto py-6 flex flex-col items-center px-6 border-b border-gray-100 bg-white">
                <div className="w-16 h-16 mb-3 relative flex items-center justify-center">
                    <img
                        src="https://i.namu.wiki/i/27VbLRhws-7lhRxn4UUGxnJ0fy6zfhPIP5Z1wtm3KTqsB_88zoePIJMB65v2Wp5iHkAKqx1OTRSZEWQto8f4Xg.svg"
                        alt="Korea University Guro Hospital Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <span className="font-bold text-lg text-slate-800 text-center leading-tight">Guro Research Hub</span>
            </div>
            <nav className="flex-1 py-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-6 py-3 font-medium transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-900 border-r-4 border-blue-600'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-100">
                <form action={signout}>
                    <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50" type="submit">
                        Sign Out
                    </Button>
                </form>
            </div>
        </aside>
    );
}
