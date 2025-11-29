"use client";

import { Pie, Bar } from "react-chartjs-2";
import { platformData, demographicsData, recruitmentData } from "@/lib/mocks";
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function PlatformsPage() {
    // 1. Participation Pie Chart
    const participationData = {
        labels: ['미참여', '참여중'],
        datasets: [{
            data: platformData.participation,
            backgroundColor: ['#e2e8f0', '#f97316'],
            borderWidth: 0
        }]
    };

    const participationOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' as const },
            datalabels: {
                color: (ctx: any) => ctx.dataIndex === 0 ? '#475569' : '#fff',
                font: { weight: 'bold' as const, size: 12 },
                textAlign: 'center' as const,
                formatter: (value: number, ctx: any) => {
                    let sum = 0;
                    ctx.chart.data.datasets[0].data.map((data: number) => sum += data);
                    const percentage = (value * 100 / sum).toFixed(1) + "%";
                    return `${value}명\n(${percentage})`;
                }
            }
        }
    };

    // 2. Platform Stacked Bar Chart (Dynamic breakdown)
    const stackLabels = platformData.labels;

    // Helper for colors
    const getPositionColor = (label: string, index: number) => {
        if (label === '기타') return '#475569'; // slate-600
        if (label === '정보없음') return '#94a3b8'; // slate-400
        const blues = ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
        return blues[index] || '#cbd5e1';
    };

    const stackData = {
        labels: stackLabels,
        datasets: demographicsData.positionLabels.map((label, index) => ({
            label: label,
            data: (platformData as any).breakdown[label],
            backgroundColor: getPositionColor(label, index)
        }))
    };

    const stackOptions = {
        indexAxis: 'y' as const,
        maintainAspectRatio: false,
        scales: {
            x: { stacked: true, beginAtZero: true, title: { display: true, text: '인원(명)' } },
            y: { stacked: true }
        },
        plugins: {
            legend: { position: 'top' as const, align: 'end' as const },
            datalabels: { display: false }
        }
    };

    // 3. Budget Bar Chart
    const budgetLabels = [...platformData.labels, '미참여(Non)'];
    const budgetChartData = {
        labels: budgetLabels,
        datasets: [{
            label: '연구비 총액 (억원)',
            data: platformData.budget,
            backgroundColor: (ctx: any) => {
                return ctx.dataIndex === 6 ? '#94a3b8' : '#10b981';
            },
            borderRadius: 4
        }]
    };

    const budgetOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end' as const, align: 'top' as const,
                color: '#0f172a', font: { weight: 'bold' as const },
                formatter: (v: number) => v + '억'
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { borderDash: [2, 2] } },
            x: { grid: { display: false } }
        }
    };

    // 4. Simulation Chart
    const simulationLabels = ['참여 연구자(명)', '총 연구비(억원)', '논문 실적(편)'];
    const simulationChartData = {
        labels: simulationLabels,
        datasets: [
            {
                label: '영입 효과 (증가분)',
                data: platformData.simulation.increase,
                backgroundColor: '#10b981', // Emerald
                borderRadius: 4,
                order: 0
            },
            {
                label: '현재 수준',
                data: platformData.simulation.current,
                backgroundColor: '#3b82f6', // Blue
                borderRadius: 4,
                order: 1
            }
        ]
    };

    const simulationOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        scales: {
            x: {
                stacked: true,
                grid: { display: false, drawBorder: false },
                ticks: { color: '#cbd5e1', font: { weight: 'bold' as const } }
            },
            y: {
                stacked: true,
                ticks: { color: 'white', font: { weight: 'bold' as const } },
                grid: { display: false }
            }
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { color: '#cbd5e1', boxWidth: 12 }
            },
            datalabels: {
                color: '#fff',
                font: { weight: 'bold' as const, size: 11 },
                formatter: (value: number, ctx: any) => {
                    const dsIndex = ctx.datasetIndex;
                    if (dsIndex === 0) return `+${value}`; // 증가분
                    return value;
                }
            }
        }
    };

    return (
        <div className="p-8 space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">연구 플랫폼 현황</h1>
                    <p className="text-slate-500 text-sm mt-1">6대 핵심 연구 분야 참여도 및 연구비 수주 분석</p>
                </div>
            </header>

            {/* Row 1: Participation Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-4">전체 참여 비율</h3>
                    <div className="relative flex-1 min-h-[250px]">
                        <Pie data={participationData} options={participationOptions} />
                    </div>
                    <div className="mt-4 text-center text-xs text-slate-400">
                        * 차트 내 수치는 인원수(비율)입니다.
                    </div>
                </div>

                {/* 2. Stacked Bar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-4">플랫폼별 참여 인원 구성 (직위별)</h3>
                    <div className="relative h-72">
                        <Bar data={stackData} options={stackOptions} />
                    </div>
                </div>
            </div>

            {/* Row 2: Budget Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-4">플랫폼별 연구비 총액 비교</h3>
                <div className="relative h-80">
                    <Bar data={budgetChartData} options={budgetOptions as any} />
                </div>
            </div>

            {/* Row 3: Potential Recruitment Analysis (New Section) */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                        <FaWandMagicSparkles size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">잠재 연구자 영입 효과 예측</h2>
                        <p className="text-sm text-slate-500">
                            현재 플랫폼에 참여하지 않은 연구자들의 2025년 연구 과제를 분석하여, 영입 시 기대되는 연구비 증대 효과를 시뮬레이션합니다.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Top Projects List */}
                    <div className="lg:col-span-1 border-r border-slate-100 pr-8">
                        <h3 className="text-lg font-bold mb-4 flex justify-between items-center">
                            <span>영입 대상 주요 과제</span>
                            <span className="text-xs font-normal text-slate-400">Top 20 (예산순)</span>
                        </h3>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {recruitmentData.topProjects.map((project: any, idx: number) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-emerald-200 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${project.platform === '데이터' ? 'bg-indigo-100 text-indigo-700' :
                                            project.platform === '신약' ? 'bg-emerald-100 text-emerald-700' :
                                                project.platform === '정밀의료기기' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-200 text-slate-700'
                                            }`}>
                                            {project.platform}
                                        </span>
                                        <span className="text-emerald-600 font-bold text-sm">{project.budget}억</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-1 line-clamp-2" title={project.title}>
                                        {project.title}
                                    </h4>
                                    <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                                        <span className="font-medium text-slate-700">{project.pi} 교수</span>
                                        <span className="text-slate-400 truncate max-w-[120px]">{project.project_name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Simulation Chart */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold mb-4">플랫폼별 연구비 증대 시뮬레이션</h3>
                        <div className="relative h-[500px]">
                            <Bar
                                data={{
                                    labels: platformData.labels,
                                    datasets: [
                                        {
                                            label: '현재 연구비',
                                            data: platformData.budget.slice(0, 6), // Exclude 'Non-participating'
                                            backgroundColor: '#cbd5e1',
                                            stack: 'Stack 0',
                                            order: 1
                                        },
                                        {
                                            label: '영입 시 추가 연구비',
                                            data: platformData.labels.map(label => (recruitmentData.platformPotential as any)[label] || 0),
                                            backgroundColor: '#10b981',
                                            stack: 'Stack 0',
                                            order: 0
                                        }
                                    ]
                                }}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'top' },
                                        tooltip: {
                                            callbacks: {
                                                footer: (tooltipItems) => {
                                                    let total = 0;
                                                    tooltipItems.forEach((item) => {
                                                        total += item.parsed.y || 0;
                                                    });
                                                    return 'Total: ' + total.toFixed(1) + '억';
                                                }
                                            }
                                        },
                                        datalabels: {
                                            color: '#fff',
                                            font: { weight: 'bold' },
                                            formatter: (value, ctx) => {
                                                if (value < 2) return ''; // Hide small labels
                                                return value.toFixed(1);
                                            }
                                        }
                                    },
                                    scales: {
                                        x: { grid: { display: false } },
                                        y: {
                                            beginAtZero: true,
                                            stacked: true,
                                            title: { display: true, text: '연구비 (억원)' }
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between">
                            <div>
                                <span className="text-emerald-800 font-bold text-lg">총 잠재 영입 효과</span>
                                <p className="text-emerald-600 text-sm">미참여 연구자 영입 시 기대되는 총 연구비 증가액</p>
                            </div>
                            <div className="text-3xl font-bold text-emerald-600">
                                +{recruitmentData.totalPotential}억
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
