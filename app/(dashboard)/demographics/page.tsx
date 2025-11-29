"use client";

import { Doughnut, Bar } from "react-chartjs-2";
import { demographicsData } from "@/lib/mocks";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DemographicsPage() {
    const [deptMode, setDeptMode] = useState<'simple' | 'detail'>('simple');

    const getPositionColor = (label: string, index: number) => {
        if (label === '기타') return '#475569'; // slate-600
        if (label === '정보없음') return '#94a3b8'; // slate-400
        const blues = ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
        return blues[index] || '#cbd5e1';
    };

    // 1. Position Chart Data
    const positionChartData = {
        labels: demographicsData.positionLabels,
        datasets: [{
            data: demographicsData.positionCounts,
            backgroundColor: demographicsData.positionLabels.map((label, index) => getPositionColor(label, index)),
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    const positionChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: { position: 'bottom' as const, labels: { usePointStyle: true, padding: 20 } },
            datalabels: {
                color: '#fff',
                font: { weight: 'bold' as const, size: 11 },
                formatter: (value: number, ctx: any) => {
                    let sum = 0;
                    const dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map((data: number) => { sum += data; });
                    const percentage = (value * 100 / sum).toFixed(1) + "%";
                    return percentage;
                },
                display: function (context: any) {
                    return context.dataset.data[context.dataIndex] > 15;
                }
            }
        }
    };

    // 2. Department Chart Data
    const deptChartData = {
        labels: demographicsData.deptTop10Labels,
        datasets: deptMode === 'simple'
            ? [{
                label: '전체 연구자 수',
                data: demographicsData.deptTop10Values,
                backgroundColor: '#0ea5e9',
                borderRadius: 4,
                barThickness: 20
            }]
            : demographicsData.positionLabels.map((label, index) => ({
                label: label,
                data: (demographicsData as any).deptTop10Breakdown[label],
                backgroundColor: getPositionColor(label, index),
                stack: 'Stack 0'
            }))
    };

    const deptChartOptions = {
        indexAxis: 'y' as const,
        maintainAspectRatio: false,
        plugins: {
            datalabels: { display: false },
            legend: { display: deptMode === 'detail' }
        },
        scales: {
            x: { beginAtZero: true, stacked: deptMode === 'detail' },
            y: { stacked: deptMode === 'detail' }
        }
    };

    // 3. Year Chart Data
    const yearChartData = {
        labels: demographicsData.yearLabels,
        datasets: [{
            label: '임용 인원 (명)',
            data: demographicsData.yearValues,
            backgroundColor: (context: any) => {
                const index = context.dataIndex;
                return index === 5 ? '#f59e0b' : '#cbd5e1';
            },
            borderRadius: 4,
            barPercentage: 0.7
        }]
    };

    const yearChartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end' as const,
                align: 'top' as const,
                color: '#64748b',
                font: { size: 10 }
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
        }
    };

    return (
        <div className="p-8 space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">인력 구성 및 분포</h1>
                    <p className="text-slate-500 text-sm mt-1">구로병원 연구자 직위, 소속, 경력 현황 심층 분석</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Position Distribution */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 border-b pb-2">직위별 연구자 분포</h3>
                    <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
                        <Doughnut data={positionChartData} options={positionChartOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-slate-400 text-sm font-medium">Total</span>
                            <span className="text-3xl font-bold text-slate-800">329<span className="text-base font-normal ml-1">명</span></span>
                        </div>
                    </div>
                </div>

                {/* 2. Top 10 Departments */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-lg font-bold">Top 10 진료과 연구 인력</h3>
                        <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium gap-1">
                            <Button
                                variant={deptMode === 'simple' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setDeptMode('simple')}
                                className={deptMode === 'simple' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}
                            >
                                단순 보기
                            </Button>
                            <Button
                                variant={deptMode === 'detail' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setDeptMode('detail')}
                                className={deptMode === 'detail' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}
                            >
                                상세 분포
                            </Button>
                        </div>
                    </div>
                    <div className="relative flex-1 min-h-[300px]">
                        <Bar data={deptChartData} options={deptChartOptions} />
                    </div>
                </div>
            </div>

            {/* 3. Year Distribution & Recruitment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Year Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-2">연구자 의대 입학 연도 분포</h3>
                    <p className="text-xs text-slate-400 mb-6">X축: 입학 연도 (5년 단위 구간), Y축: 해당 기간 입학한 연구자 수</p>
                    <div className="relative h-64">
                        <Bar data={yearChartData} options={yearChartOptions} />
                    </div>
                </div>

                {/* Recruitment Card (Mock) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-lg font-bold mb-2">2025년 신규 임용 및 전출 현황</h3>
                    <p className="text-xs text-slate-400 mb-6">* 실제 데이터가 아닌 예시입니다.</p>

                    <div className="flex-1 flex flex-col justify-center gap-6">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div>
                                <div className="text-sm text-blue-600 font-medium mb-1">신규 임용</div>
                                <div className="text-3xl font-bold text-slate-800">12<span className="text-base font-normal ml-1">명</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500">전년 대비</div>
                                <div className="text-sm font-bold text-blue-600">+20%</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <div className="text-sm text-slate-600 font-medium mb-1">전출 / 퇴직</div>
                                <div className="text-3xl font-bold text-slate-800">4<span className="text-base font-normal ml-1">명</span></div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500">전년 대비</div>
                                <div className="text-sm font-bold text-slate-600">-10%</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">주요 영입 분야</div>
                                <div className="font-bold text-slate-700">순환기내과</div>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <div className="text-xs text-slate-500 mb-1">평균 연령</div>
                                <div className="font-bold text-slate-700">38.5세</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
