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
        <div className="p-8 space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Research Hub Dashboard</h1>
                <p className="text-slate-500 mt-2">구로병원 연구 생태계 핵심 지표 요약</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">전체 연구자</CardTitle>
                        <FaUsers className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{totalResearchers}명</div>
                        <p className="text-xs text-slate-400 mt-1">+12% from last year</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">총 연구비 수주</CardTitle>
                        <FaChartLine className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{totalBudget}억</div>
                        <p className="text-xs text-slate-400 mt-1">Top 7 진료과 기준</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">SCI 논문 실적</CardTitle>
                        <FaTrophy className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{totalPapers}편</div>
                        <p className="text-xs text-slate-400 mt-1">최근 1년 누적</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">활성 연구 플랫폼</CardTitle>
                        <FaFlask className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">6개</div>
                        <p className="text-xs text-slate-400 mt-1">핵심 연구 분야</p>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
}
