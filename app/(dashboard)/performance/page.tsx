"use client";

import { Bar } from "react-chartjs-2";
import { performanceData, avgStatsData } from "@/lib/mocks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaSackDollar, FaBook } from "react-icons/fa6";

export default function PerformancePage() {
    const [sortMode, setSortMode] = useState<'budget' | 'paper'>('budget');

    // 1. Dual Axis Chart Data
    const sortedData = [...performanceData].sort((a, b) => {
        return sortMode === 'budget' ? b.budget - a.budget : b.papers - a.papers;
    });

    const dualChartData = {
        labels: sortedData.map(d => d.name),
        datasets: [
            {
                label: '연구비 (억원)',
                data: sortedData.map(d => d.budget),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                yAxisID: 'y',
                order: 1
            },
            {
                label: '논문 수 (편)',
                data: sortedData.map(d => d.papers),
                backgroundColor: 'rgba(147, 51, 234, 0.7)',
                borderColor: 'rgba(147, 51, 234, 1)',
                borderWidth: 1,
                yAxisID: 'y1',
                order: 2
            }
        ]
    };

    const dualChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                anchor: 'end' as const, align: 'top' as const, color: '#64748b', font: { size: 10, weight: 'bold' as const },
                formatter: (value: number, context: any) => {
                    if (sortMode === 'budget' && context.datasetIndex === 0) return value;
                    if (sortMode === 'paper' && context.datasetIndex === 1) return value;
                    return '';
                }
            },
            tooltip: { mode: 'index' as const, intersect: false }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                type: 'linear' as const, display: true, position: 'left' as const,
                title: { display: true, text: '연구비 (억원)', color: '#10b981' },
                grid: { borderDash: [2, 2] }
            },
            y1: {
                type: 'linear' as const, display: true, position: 'right' as const,
                title: { display: true, text: '논문 수 (편)', color: '#9333ea' },
                grid: { drawOnChartArea: false }
            }
        }
    };



    return (
        <div className="p-8 space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">연구 성과 분석</h1>
                    <p className="text-slate-500 text-sm mt-1">국가 R&D 수주액 및 논문 실적 심층 분석 (Top 10 진료과 & 직위별 분포)</p>
                </div>
            </header>

            {/* 1. Dual Axis Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">진료과별 국가 R&D 및 논문 현황 (Top 10)</h3>
                        <p className="text-xs text-slate-400 mt-1">왼쪽 막대: 연구비(억원), 오른쪽 막대: 논문 수(편)</p>
                    </div>
                    <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium shrink-0 gap-1">
                        <Button
                            variant={sortMode === 'budget' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSortMode('budget')}
                            className={sortMode === 'budget' ? "bg-white text-emerald-700 shadow-sm border border-emerald-100" : "text-slate-500"}
                        >
                            <FaSackDollar className="mr-1" /> 연구비 순 정렬
                        </Button>
                        <Button
                            variant={sortMode === 'paper' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSortMode('paper')}
                            className={sortMode === 'paper' ? "bg-white text-purple-700 shadow-sm border border-purple-100" : "text-slate-500"}
                        >
                            <FaBook className="mr-1" /> 논문 수 순 정렬
                        </Button>
                    </div>
                </div>

                <div className="relative h-[350px]">
                    <Bar data={dualChartData} options={dualChartOptions as any} />
                </div>
            </div>

            {/* 2. Average Stats Bar Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-1">직위별 평균 논문 실적</h3>
                    <p className="text-xs text-slate-400 mb-4">각 직위별 연구자 1인당 평균 논문 수 (편)</p>
                    <div className="relative h-64">
                        <Bar
                            data={{
                                labels: avgStatsData.labels,
                                datasets: [{
                                    label: '평균 논문 (편)',
                                    data: avgStatsData.avgPapers,
                                    backgroundColor: avgStatsData.labels.map((label: string, index: number) => {
                                        if (label === '기타') return '#475569';
                                        if (label === '정보없음') return '#94a3b8';
                                        const blues = ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
                                        return blues[index] || '#cbd5e1';
                                    }),
                                    borderRadius: 4
                                }]
                            }}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    datalabels: {
                                        anchor: 'end', align: 'top', color: '#1e40af', font: { weight: 'bold' },
                                        formatter: (v) => v + '편'
                                    }
                                },
                                scales: { y: { beginAtZero: true, grid: { display: false }, grace: '10%' }, x: { grid: { display: false } } }
                            }}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-1">직위별 평균 연구비 수주</h3>
                    <p className="text-xs text-slate-400 mb-4">각 직위별 연구자 1인당 평균 연구비 (억원)</p>
                    <div className="relative h-64">
                        <Bar
                            data={{
                                labels: avgStatsData.labels,
                                datasets: [{
                                    label: '평균 연구비 (억원)',
                                    data: avgStatsData.avgBudget,
                                    backgroundColor: avgStatsData.labels.map((label: string, index: number) => {
                                        if (label === '기타') return '#064e3b'; // Dark green for Others in budget chart? Or keep consistent?
                                        // Let's keep consistent with position colors but maybe green shades?
                                        // Actually user liked the green shades for budget.
                                        // Let's use green shades for budget.
                                        if (label === '기타') return '#475569';
                                        if (label === '정보없음') return '#94a3b8';
                                        const greens = ['#064e3b', '#065f46', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
                                        return greens[index] || '#cbd5e1';
                                    }),
                                    borderRadius: 4
                                }]
                            }}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    datalabels: {
                                        anchor: 'end', align: 'top', color: '#065f46', font: { weight: 'bold' },
                                        formatter: (v) => v + '억'
                                    }
                                },
                                scales: { y: { beginAtZero: true, grid: { display: false }, grace: '10%' }, x: { grid: { display: false } } }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
