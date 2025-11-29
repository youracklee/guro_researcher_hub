"use client";

import { useState, useMemo } from "react";
import { researchers } from "@/lib/mocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaSearch, FaUserMd, FaFlask, FaBook, FaStar, FaArrowRight, FaArrowLeft, FaListUl, FaMagic, FaHandshake, FaDownload } from "react-icons/fa";
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

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState<string>("all");
    const [selectedResearcherId, setSelectedResearcherId] = useState<string | null>(null);

    // Unique Departments
    const departments = useMemo(() => Array.from(new Set(researchers.map(r => r.department))), []);

    // Filter Logic
    const filteredResearchers = useMemo(() => {
        return researchers.filter(r => {
            const matchesSearch =
                searchTerm === "" ||
                r.name_ko.includes(searchTerm) ||
                r.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.keywords.some(k => k.includes(searchTerm)) ||
                r.department.includes(searchTerm);

            const matchesDept = selectedDept === "all" ? true : r.department === selectedDept;

            return matchesSearch && matchesDept;
        }).map(r => ({
            ...r,
            // Mock Match Percentage based on simple hash of ID + search term length (to make it deterministic but varying)
            matchPercent: Math.min(99, 70 + (parseInt(r.id) * 3 % 25) + (searchTerm.length * 2))
        })).sort((a, b) => b.matchPercent - a.matchPercent); // Sort by match %
    }, [searchTerm, selectedDept]);

    const selectedResearcher = useMemo(() =>
        researchers.find(r => r.id === selectedResearcherId),
        [selectedResearcherId]);

    // Radar Chart Data
    const radarData = {
        labels: ['논문실적', '연구비', '데이터활용', '국제협력', '특허', '기술이전'],
        datasets: [
            {
                label: '연구자 역량',
                data: selectedResearcher ? [
                    Math.min(100, selectedResearcher.publications * 2),
                    Math.min(100, selectedResearcher.budget * 10),
                    90, // Mock
                    70, // Mock
                    60, // Mock
                    75  // Mock
                ] : [],
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgb(59, 130, 246)',
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(59, 130, 246)',
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
                <h1 className="text-2xl font-bold text-slate-800">연구자 탐색</h1>
                <p className="text-slate-500 text-sm mt-1">AI 기반 매칭 시스템을 통해 최적의 협력 파트너를 발굴하세요.</p>
            </header>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Dept Filter */}
                    <div className="w-full md:w-48 shrink-0">
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">진료과 선택</label>
                        <select
                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer font-medium"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="all">전체 (All)</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* NL Search Input */}
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">연구 주제 검색</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaMagic className="text-blue-400 group-focus-within:text-blue-600 transition" />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base py-3 pl-10 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm placeholder-slate-400"
                                placeholder="예: '폐암 진단에 활용할 수 있는 AI 모델링 전문가를 찾아줘'"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="absolute inset-y-0 right-2 flex items-center">
                                <div className="bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition shadow-md">
                                    <FaArrowRight className="text-sm" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">

                {/* View A: Results Grid */}
                {!selectedResearcherId && (
                    <div className="h-full overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center">
                            <FaListUl className="mr-2" />추천 연구자 <span className="ml-1 text-blue-600">{filteredResearchers.length}명</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-8">
                            {filteredResearchers.map((researcher) => (
                                <div
                                    key={researcher.id}
                                    onClick={() => setSelectedResearcherId(researcher.id)}
                                    className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-blue-600 transition"></div>
                                    <div className="flex justify-between items-start mb-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 border border-slate-200 bg-slate-100">
                                                <AvatarImage src={researcher.image_url} />
                                                <AvatarFallback className="text-slate-400"><FaUserMd /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{researcher.name_ko} 교수</h4>
                                                <p className="text-xs text-slate-500">{researcher.department}</p>
                                            </div>
                                        </div>
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">
                                            {researcher.matchPercent}% 일치
                                        </span>
                                    </div>
                                    <div className="pl-2 space-y-2 mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {researcher.keywords.slice(0, 3).map((k, i) => (
                                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">#{k}</span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2">
                                            {researcher.major_research || "주요 연구 분야 데이터가 없습니다."} 관련 심층 연구 수행 중.
                                        </p>
                                    </div>
                                    <div className="pl-2 pt-3 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500">
                                        <span className="flex items-center"><FaBook className="mr-1" />논문 {researcher.publications}편</span>
                                        <span className="flex items-center"><FaStar className="text-yellow-400 mr-1" />{researcher.platforms[0] || "연구중심"}</span>
                                    </div>
                                </div>
                            ))}
                            {filteredResearchers.length === 0 && (
                                <div className="col-span-full text-center py-20 text-slate-400">
                                    <FaSearch className="mx-auto h-12 w-12 mb-4 opacity-20" />
                                    <p>검색 결과가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* View B: Detail View */}
                {selectedResearcher && (
                    <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        {/* Left: Profile Card */}
                        <div className="lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-y-auto shrink-0">
                            <button
                                onClick={() => setSelectedResearcherId(null)}
                                className="self-start text-sm text-slate-500 hover:text-blue-600 mb-4 flex items-center transition-colors"
                            >
                                <FaArrowLeft className="mr-2" /> 목록으로 돌아가기
                            </button>

                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
                                    <img src={selectedResearcher.image_url} alt={selectedResearcher.name_ko} className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedResearcher.name_ko} 교수</h2>
                                <p className="text-blue-600 font-medium">{selectedResearcher.department} · {selectedResearcher.position}</p>
                                <div className="mt-3 flex gap-2 flex-wrap justify-center">
                                    {selectedResearcher.platforms.map((p, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 font-medium">
                                            {p}
                                        </span>
                                    ))}
                                    {selectedResearcher.platforms.length === 0 && (
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 font-medium">일반 연구자</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                {/* Radar Chart */}
                                <div className="relative h-48 w-full">
                                    <Radar data={radarData} options={radarOptions} />
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-blue-500 pl-2">주요 연구 키워드</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedResearcher.keywords.map((k, i) => (
                                            <span key={i} className={`px-3 py-1 rounded-lg text-xs font-bold ${i < 2 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'}`}>
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Simulation & Matching */}
                        <div className="lg:w-2/3 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">

                            {/* Simulation Card */}
                            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-indigo-500/30 rounded-lg">
                                            <FaFlask className="text-indigo-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">협력 시뮬레이션 결과</h3>
                                            <p className="text-indigo-200 text-sm">귀하의 연구 주제와 <span className="text-white font-bold">{(selectedResearcher as any).matchPercent}%</span>의 시너지 효과가 예상됩니다.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                        <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                                            <p className="text-xs text-indigo-300 mb-1">예상 공동 연구 주제</p>
                                            <p className="font-bold text-sm">{selectedResearcher.major_research} 기반<br />멀티모달 AI 모델링</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                                            <p className="text-xs text-indigo-300 mb-1">확보 가능 데이터</p>
                                            <p className="font-bold text-sm">임상 데이터 15,000례<br />& 병리 확진 데이터</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                                            <p className="text-xs text-indigo-300 mb-1">기대 성과 (3년)</p>
                                            <p className="font-bold text-sm">JCR 상위 10% 논문 2편<br />대형 국책과제 수주</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button className="bg-indigo-500 hover:bg-indigo-400 text-white border-none shadow-lg shadow-indigo-500/30">
                                            <FaHandshake className="mr-2" />협업 제안하기
                                        </Button>
                                        <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/10 hover:text-white">
                                            <FaDownload className="mr-2" />상세 이력서
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Publications (Mocked for now as we don't have full list in mock) */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1">
                                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">최근 주요 논문</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 items-start">
                                        <div className="min-w-[40px] text-slate-400 font-bold text-sm pt-1">2024</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 hover:text-blue-600 cursor-pointer">
                                                Advanced research on {selectedResearcher.keywords[0] || "Medical AI"} using Deep Learning
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">Nature Medicine · IF 32.5 · 1저자</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="min-w-[40px] text-slate-400 font-bold text-sm pt-1">2023</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 hover:text-blue-600 cursor-pointer">
                                                Clinical validation of {selectedResearcher.major_research} algorithms
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">Radiology · IF 19.7 · 교신저자</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="min-w-[40px] text-slate-400 font-bold text-sm pt-1">2023</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 hover:text-blue-600 cursor-pointer">
                                                Multimodal fusion of imaging and genomic data for {selectedResearcher.department}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">IEEE TMI · IF 10.2 · 공동저자</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
