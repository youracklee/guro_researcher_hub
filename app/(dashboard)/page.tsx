"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUsers, FaFlask, FaTrophy, FaChartLine } from "react-icons/fa";
import { demographicsData, performanceData } from "@/lib/mocks";

export default function DashboardPage() {
    // Calculate Summary Metrics
    const totalResearchers = demographicsData.positionCounts.reduce((a, b) => a + b, 0);
    const totalBudget = performanceData.reduce((a, b) => a + b.budget, 0).toFixed(1);
    const totalPapers = performanceData.reduce((a, b) => a + b.papers, 0);



    return (
        <div className="relative p-8 space-y-8 min-h-full overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
            <div className="absolute top-20 right-40 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>

            {/* Symbolic Image Placeholder (User to replace) */}
            <div className="absolute top-6 right-10 w-48 h-48 opacity-80 pointer-events-none z-0">
                <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full border-2 border-dashed border-indigo-300 flex items-center justify-center text-indigo-400 font-medium text-sm">
                    Symbolic Image Area
                </div>
            </div>

            <header className="relative z-10 mb-8">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Research Hub Dashboard</h1>
                <p className="text-slate-600 mt-2 text-lg">구로병원 연구 생태계 핵심 지표 요약</p>
            </header>

            {/* KPI Cards */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-indigo-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">전체 연구자</CardTitle>
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <FaUsers className="h-4 w-4 text-indigo-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{totalResearchers}명</div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                            <span className="text-emerald-500 font-bold mr-1">↑ 12%</span> from last year
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-indigo-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">총 연구비 수주</CardTitle>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <FaChartLine className="h-4 w-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{totalBudget}억</div>
                        <p className="text-xs text-slate-500 mt-1">Top 7 진료과 기준</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-indigo-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">SCI 논문 실적</CardTitle>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <FaTrophy className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">{totalPapers}편</div>
                        <p className="text-xs text-slate-500 mt-1">최근 1년 누적</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/80 backdrop-blur-sm border-indigo-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">활성 연구 플랫폼</CardTitle>
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <FaFlask className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-800">6개</div>
                        <p className="text-xs text-slate-500 mt-1">핵심 연구 분야</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
