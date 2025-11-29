"use client";

import { useState, useMemo } from "react";
import { companiesData } from "@/lib/mocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    FaBuilding, FaGlobe, FaDna, FaCube, FaArrowRight, FaArrowLeft,
    FaRobot, FaFlask, FaMapMarkerAlt, FaLink, FaExternalLinkAlt,
    FaHandshake, FaMicrochip, FaUserMd
} from "react-icons/fa";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components for Radar
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function CompaniesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
    const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    // Filter Logic
    const filteredCompanies = useMemo(() => {
        return companiesData.filter(c => {
            const matchesSearch =
                searchTerm === "" ||
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.desc.includes(searchTerm) ||
                (c.tags && c.tags.some(t => t.includes(searchTerm)));

            const matchesPlatform = selectedPlatform === "all" ? true : c.platform === selectedPlatform;

            return matchesSearch && matchesPlatform;
        });
    }, [searchTerm, selectedPlatform]);

    const selectedCompany = useMemo(() =>
        companiesData.find(c => c.id === selectedCompanyId),
        [selectedCompanyId]);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'fa-cube': return <FaCube className="w-6 h-6" />;
            case 'fa-dna': return <FaDna className="w-6 h-6" />;
            case 'fa-globe': return <FaGlobe className="w-6 h-6" />;
            default: return <FaBuilding className="w-6 h-6" />;
        }
    };

    const getColorClass = (color: string) => {
        switch (color) {
            case 'indigo': return 'bg-indigo-100 text-indigo-600 border-indigo-100';
            case 'emerald': return 'bg-emerald-100 text-emerald-600 border-emerald-100';
            case 'slate': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    // Radar Chart Data
    const radarData = {
        labels: ['기술성', '시장성', '재무건전성', '인력', '투자유치', '협력실적'],
        datasets: [
            {
                label: '기업 역량 진단',
                data: [95, 85, 80, 90, 95, 85], // Mock data
                fill: true,
                backgroundColor: 'rgba(79, 70, 229, 0.2)', // Indigo
                borderColor: '#4f46e5',
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#4f46e5',
            },
        ],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: '#e2e8f0' },
                grid: { color: '#e2e8f0' },
                pointLabels: {
                    font: { size: 11, weight: 'bold' as const },
                    color: '#64748b'
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: { display: false, stepSize: 20 }
            }
        },
        plugins: {
            legend: { display: false }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="h-full flex flex-col p-8 space-y-6 overflow-hidden">
            <header className="shrink-0">
                <h1 className="text-2xl font-bold text-slate-800">기업 탐색</h1>
                <p className="text-slate-500 text-sm mt-1">원내 연계 기업 및 외부 잠재 협력 기업을 AI로 발굴하세요.</p>
            </header>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">

                    {/* Platform Filter */}
                    <div className="w-full md:w-48 shrink-0">
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">플랫폼 선택</label>
                        <select
                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer font-medium"
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                        >
                            <option value="all">전체 (All)</option>
                            <option value="data">데이터 플랫폼</option>
                            <option value="device">정밀의료기기</option>
                            <option value="drug">신약 개발</option>
                            <option value="regen">정밀재생</option>
                        </select>
                    </div>

                    {/* Web Search Toggle */}
                    <div className="shrink-0 flex flex-col items-center justify-center h-full pb-1 px-2">
                        <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Web Search</span>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="web-search-toggle"
                                checked={isWebSearchEnabled}
                                onCheckedChange={setIsWebSearchEnabled}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>
                    </div>

                    {/* NL Search Input */}
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">기술/기업 검색</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaRobot className="text-indigo-400 group-focus-within:text-indigo-600 transition" />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base py-3 pl-10 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm placeholder-slate-400"
                                placeholder="예: '영상의학 AI 진단 솔루션을 개발하는 스타트업 찾아줘'"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="absolute inset-y-0 right-2 flex items-center">
                                <div className="bg-indigo-600 hover:bg-indigo-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition shadow-md">
                                    <FaArrowRight className="text-sm" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">

                {/* View A: Company List */}
                {!selectedCompanyId && (
                    <div className="h-full overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center justify-between">
                            <span className="flex items-center"><FaBuilding className="mr-2" />검색 결과 <span className="ml-1 text-indigo-600">{filteredCompanies.length + (isWebSearchEnabled ? 1 : 0)}건</span></span>
                            <Badge variant="outline" className={`text-xs ${isWebSearchEnabled ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                {isWebSearchEnabled ? "원내 + 외부(Web) 검색" : "원내 DB 검색"}
                            </Badge>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-8">
                            {filteredCompanies.map((company) => (
                                <div
                                    key={company.id}
                                    onClick={() => setSelectedCompanyId(company.id)}
                                    className={`group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-${company.color}-300 transition cursor-pointer relative overflow-hidden`}
                                >
                                    <div className={`absolute top-0 left-0 w-1 h-full bg-${company.color}-500 group-hover:bg-${company.color}-600 transition`}></div>
                                    <div className="flex justify-between items-start mb-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold border ${getColorClass(company.color)}`}>
                                                {getIcon(company.icon)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{company.name}</h4>
                                                <p className="text-xs text-slate-500">{company.platform === 'data' ? '의료 데이터' : company.platform === 'drug' ? '신약 개발' : '의료기기'}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${company.type === 'internal' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {company.type === 'internal' ? '협력중' : 'MOU 체결'}
                                        </span>
                                    </div>
                                    <div className="pl-2 space-y-2 mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {company.tags && company.tags.map((tag, i) => (
                                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">#{tag}</span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2">{company.desc}</p>
                                    </div>
                                    <div className="pl-2 pt-3 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500">
                                        <span className="flex items-center"><FaFlask className="mr-1" />공동연구 {(parseInt(company.id) % 5) + 1}건</span>
                                        <span className="flex items-center"><FaMapMarkerAlt className="mr-1" />서울</span>
                                    </div>
                                </div>
                            ))}

                            {/* Simulated Web Search Result */}
                            {isWebSearchEnabled && (
                                <div className="group bg-slate-50 rounded-xl p-5 border border-slate-300 border-dashed shadow-sm hover:shadow-md hover:border-slate-400 transition cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">WEB 검색</div>
                                    <div className="flex justify-between items-start mb-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-slate-600 text-xl font-bold border border-slate-200">
                                                <FaGlobe />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">DeepBio</h4>
                                                <p className="text-xs text-slate-500">디지털 병리 AI</p>
                                            </div>
                                        </div>
                                        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded">외부기업</span>
                                    </div>
                                    <div className="pl-2 space-y-2 mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">#ProstateCa</span>
                                            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">#Pathology</span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2">
                                            전립선암 병리 조직 진단 보조 AI 솔루션 DeepDx 보유. (웹 검색 결과)
                                        </p>
                                    </div>
                                    <div className="pl-2 pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                                        <span className="flex items-center"><FaLink className="mr-1" />유사도 88%</span>
                                        <span className="flex items-center"><FaExternalLinkAlt className="mr-1" />사이트 이동</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* View B: Detail View */}
                {selectedCompany && (
                    <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        {/* Left: Company Profile */}
                        <div className="lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-y-auto shrink-0">
                            <button
                                onClick={() => setSelectedCompanyId(null)}
                                className="self-start text-sm text-slate-500 hover:text-indigo-600 mb-4 flex items-center transition-colors"
                            >
                                <FaArrowLeft className="mr-2" /> 목록으로 돌아가기
                            </button>

                            <div className="flex flex-col items-center text-center mb-6">
                                <div className={`w-24 h-24 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm mb-4 flex items-center justify-center text-4xl ${selectedCompany.color === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                    {getIcon(selectedCompany.icon)}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedCompany.name}</h2>
                                <p className="text-slate-500 font-medium text-sm">대표: 홍길동 · 설립: 2015</p>
                                <div className="mt-3 flex gap-2 justify-center">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">원내 연계기업</span>
                                    <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs border border-slate-200">KOSDAQ 상장</span>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                {/* Radar Chart */}
                                <div className="relative h-48 w-full">
                                    <Radar data={radarData} options={radarOptions} />
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <h4 className="text-sm font-bold text-slate-800 mb-2">📊 기업 개요</h4>
                                    <ul className="text-sm text-slate-600 space-y-2">
                                        <li className="flex justify-between"><span>기술성숙도(TRL)</span> <span className="font-bold text-slate-800">9단계 (사업화)</span></li>
                                        <li className="flex justify-between"><span>보유 특허</span> <span className="font-bold text-slate-800">120건+</span></li>
                                        <li className="flex justify-between"><span>주요 제품</span> <span className="font-bold text-slate-800">Medical AI Sol.</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right: Collaboration & Professors */}
                        <div className="lg:w-2/3 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">

                            {/* Existing Collaboration */}
                            <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden shrink-0">
                                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-indigo-900 flex items-center">
                                            <FaHandshake className="mr-2" />구로병원 협력 현황
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">현재 본원 의료진과 활발한 공동 연구를 수행 중입니다.</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-indigo-600">3건</span>
                                        <p className="text-xs text-slate-400">진행 과제</p>
                                    </div>
                                </div>

                                {/* Participating Professors */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-indigo-100 shadow-sm">
                                            <FaUserMd />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">김AI 교수 <span className="text-xs font-normal text-slate-500 ml-1">영상의학과</span></p>
                                            <p className="text-xs text-indigo-600 font-medium">폐 결절 진단 알고리즘 고도화</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 opacity-70">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                            <FaUserMd />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">이데이터 교수 <span className="text-xs font-normal text-slate-500 ml-1">종양내과</span></p>
                                            <p className="text-xs text-slate-500">유방암 예후 예측 모델 검증</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Match Simulation */}
                            <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-md shrink-0">
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <FaMicrochip className="mr-2 text-indigo-400" />기술 매칭 시뮬레이션
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-white/10 rounded-lg p-3">
                                        <p className="text-xs text-slate-400 mb-1">관심 키워드 일치도</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-emerald-400">92%</span>
                                            <span className="text-xs text-slate-300 mb-1">매우 높음</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3">
                                        <p className="text-xs text-slate-400 mb-1">임상 적용 가능성</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-blue-400">High</span>
                                            <span className="text-xs text-slate-300 mb-1">즉시 도입 검토</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3">
                                        <p className="text-xs text-slate-400 mb-1">예상 산출물</p>
                                        <p className="text-sm font-bold mt-1">의료기기 인허가 1건</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-600/30 border-none h-auto">
                                    협력 미팅 요청하기 (담당자 연결)
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
