"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUsers, FaFlask, FaTrophy, FaChartLine, FaSearch, FaBuilding } from "react-icons/fa";
import { demographicsData, performanceData } from "@/lib/mocks";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

            {/* Hero Section with Image and Actions */}
            <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-xl mb-8 group bg-slate-900">
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/images/dashboard_hero.jpg"
                        alt="Research Hub Hero"
                        className="w-full h-full object-contain transform transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                    <div className="text-white max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Research Hub & Analytics</h2>
                        <p className="text-slate-200 text-lg">고려대학교 구로병원 연구 생태계의 중심</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Link href="/search" className="flex-1 md:flex-none">
                            <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg hover:shadow-indigo-500/30 transition-all text-lg h-14 px-8 rounded-xl">
                                <FaSearch className="mr-2" />
                                연구 파트너 찾기
                            </Button>
                        </Link>
                        <Link href="/companies" className="flex-1 md:flex-none">
                            <Button size="lg" variant="outline" className="w-full bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white shadow-lg text-lg h-14 px-8 rounded-xl">
                                <FaBuilding className="mr-2" />
                                기업 매칭 신청
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <header className="relative z-10 mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-600 mt-1">핵심 성과 지표 (KPI)</p>
                </div>
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
