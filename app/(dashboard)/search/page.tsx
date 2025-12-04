"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaSearch, FaUserMd, FaFlask, FaRobot, FaArrowLeft, FaMicrochip, FaHandshake, FaArrowRight } from "react-icons/fa";
import { researchers as mockResearchers, recruitmentData as mockRecruitmentData } from "@/lib/mocks";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedResearcher, setSelectedResearcher] = useState<any>(null);
    const [departments, setDepartments] = useState<string[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("산부인과");

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Fetch with default department filter
                const res = await fetch(`/api/search?department=${encodeURIComponent(selectedDepartment)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.departments) {
                        setDepartments(data.departments);
                    }
                    if (data.initialResearchers) {
                        // Set initial results to show real data instead of mocks
                        setResults({
                            researchers: data.initialResearchers,
                            projects: data.initialProjects || [] // Use fetched projects
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch initial data if there is no active search query
        if (!query) {
            fetchInitialData();
        }
    }, [selectedDepartment]); // Re-run when department changes

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults(null);
        setError(null);
        setSelectedResearcher(null);

        try {
            console.log("Sending search request for:", query, "Department:", selectedDepartment);
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, department: selectedDepartment }),
            });

            console.log("API Response Status:", res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error("API Error Body:", errorText);
                let errorMessage = `Server Error (${res.status})`;
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.error) errorMessage = errorJson.error;
                    if (errorJson.details) {
                        console.error("Detailed Error:", errorJson.details);
                    }
                } catch (e) {
                    // Ignore JSON parse error, use default message
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            console.log("Search Results:", data);
            setResults(data);
        } catch (err: any) {
            console.error("Search failed:", err);
            setError(err.message || "An unexpected error occurred");
            setResults({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
            {/* Header - Only show when not in detail view */}
            {!selectedResearcher && (
                <header>
                    <h1 className="text-2xl font-bold text-slate-800">AI 연구 주제 탐색</h1>
                    <p className="text-slate-500 text-sm mt-1">자연어로 연구 주제나 키워드를 입력하여 관련 연구자와 프로젝트를 찾아보세요.</p>
                </header>
            )}

            {/* Search Section */}
            {!selectedResearcher && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end md:items-center">

                        {/* Department Filter */}
                        <div className="w-full md:w-48 shrink-0">
                            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">진료과 선택</label>
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger className="w-full h-[50px] bg-slate-50 border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 font-medium">
                                    <SelectValue placeholder="진료과 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">전체 진료과</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* NL Search Input */}
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">연구 주제 검색</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaRobot className="text-indigo-400 group-focus-within:text-indigo-600 transition" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base py-3 pl-10 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm placeholder-slate-400 h-[50px]"
                                    placeholder="예: '인공지능을 활용한 영상 진단 연구'"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute inset-y-0 right-2 flex items-center"
                                >
                                    <div className={`bg-indigo-600 hover:bg-indigo-700 text-white w-8 h-8 rounded-lg flex items-center justify-center transition shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <FaArrowRight className="text-sm" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-500">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">AI가 연구 주제를 분석하고 있습니다...</p>
                    <p className="text-slate-400 text-sm">잠시만 기다려주세요.</p>
                </div>
            )}

            {/* Results Area */}
            {!loading && !selectedResearcher && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center">
                            <span className="mr-2">⚠️</span>
                            {error === 'Internal Server Error'
                                ? '검색 서비스를 사용할 수 없습니다. (API 키 설정 확인 필요)'
                                : error}
                        </div>
                    )}

                    {/* AI Summary (Only show if results exist and no error) */}
                    {results?.aiSummary && !error && (
                        <Card className="bg-indigo-50 border-indigo-100 h-auto w-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center text-indigo-700 text-lg">
                                    <FaRobot className="mr-2" /> AI 요약
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line break-words">{results.aiSummary}</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Researchers Results */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                <FaUserMd className="mr-2 text-indigo-500" />
                                {results && !error ? "관련 연구자" : "전체 연구자 (추천)"}
                            </h2>

                            {(() => {
                                const isResultValid = results && !error && Array.isArray(results.researchers);
                                // Use results.researchers if available, otherwise empty (don't use mocks anymore to avoid confusion)
                                const displayResearchers = isResultValid ? results.researchers : [];

                                return displayResearchers?.length > 0 ? (
                                    displayResearchers.map((researcher: any, idx: number) => {
                                        if (!researcher) return null;
                                        return (
                                            <div
                                                key={researcher.id || idx}
                                                onClick={() => setSelectedResearcher(researcher)}
                                                className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-blue-600 transition"></div>
                                                <div className="flex justify-between items-start mb-4 pl-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl font-bold border border-slate-200 overflow-hidden">
                                                            {researcher.image_url ? (
                                                                <img src={researcher.image_url} alt={researcher.name} className="w-full h-full object-cover object-top scale-125" />
                                                            ) : (
                                                                <FaUserMd />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-bold text-slate-800">{researcher.name_ko || researcher.name}</h4>
                                                                {researcher.position && (
                                                                    <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{researcher.position}</span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-500">{researcher.department}</p>
                                                        </div>
                                                    </div>
                                                    {isResultValid && (
                                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">
                                                            {(researcher.similarity * 100).toFixed(0)}% 일치
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="pl-2 space-y-2 mb-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(researcher.keywords || []).slice(0, 3).map((k: string, i: number) => (
                                                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">#{k}</span>
                                                        ))}
                                                    </div>
                                                    {(researcher.major_research || researcher.bio) && (
                                                        <p className="text-xs text-slate-400 line-clamp-2">
                                                            {researcher.major_research || researcher.bio}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="pl-2 pt-3 border-t border-slate-50 flex flex-col gap-2">
                                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                                        <span className="flex items-center"><FaFlask className="mr-1 text-indigo-400" />논문 {researcher.publications || researcher.recent_papers_3yr || 0}</span>
                                                        <span className="flex items-center"><FaHandshake className="mr-1 text-emerald-400" />과제 {researcher.projects || researcher.total_pi_count || 0}</span>
                                                    </div>
                                                    {researcher.platforms && researcher.platforms.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {researcher.platforms.map((p: string, i: number) => {
                                                                const platformColors: Record<string, string> = {
                                                                    "정밀의료기기": "bg-blue-50 text-blue-700 border-blue-100",
                                                                    "정밀재생": "bg-emerald-50 text-emerald-700 border-emerald-100",
                                                                    "면역-마이크로바이옴": "bg-purple-50 text-purple-700 border-purple-100",
                                                                    "신약": "bg-rose-50 text-rose-700 border-rose-100",
                                                                    "데이터": "bg-cyan-50 text-cyan-700 border-cyan-100",
                                                                    "혁신형의사과학자": "bg-amber-50 text-amber-700 border-amber-100"
                                                                };
                                                                const iconColors: Record<string, string> = {
                                                                    "정밀의료기기": "text-blue-500",
                                                                    "정밀재생": "text-emerald-500",
                                                                    "면역-마이크로바이옴": "text-purple-500",
                                                                    "신약": "text-rose-500",
                                                                    "데이터": "text-cyan-500",
                                                                    "혁신형의사과학자": "text-amber-500"
                                                                };
                                                                const colorClass = platformColors[p] || "bg-slate-50 text-slate-700 border-slate-100";
                                                                const iconClass = iconColors[p] || "text-slate-500";

                                                                return (
                                                                    <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center ${colorClass}`}>
                                                                        <FaMicrochip className={`mr-1 text-[8px] ${iconClass}`} />{p}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-slate-500 text-sm">관련 연구자를 찾을 수 없습니다.</p>
                                );
                            })()}
                        </div>

                        {/* Projects Results (Only show if results exist or if we want to show random projects) */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                <FaFlask className="mr-2 text-emerald-500" />
                                {results && !error ? "관련 연구 과제" : "최근 연구 과제"}
                            </h2>
                            {(() => {
                                const isResultValid = results && !error && Array.isArray(results.projects);
                                const displayProjects = isResultValid ? results.projects : mockRecruitmentData.topProjects;

                                return displayProjects?.length > 0 ? (
                                    displayProjects.map((project: any, idx: number) => {
                                        if (!project) return null;
                                        return (
                                            <Card key={project.id || idx} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <h3 className="font-bold text-slate-800 mb-1 line-clamp-2">{project.title || "제목 없음"}</h3>
                                                    <div className="flex justify-between items-end mt-2">
                                                        <div>
                                                            <p className="text-sm text-slate-600">연구책임자: {project.researcher_name || project.pi || "정보 없음"}</p>
                                                            <p className="text-xs text-slate-400">
                                                                {project.year ? `${project.year}년 | ` : ""}
                                                                {project.budget || 0}백만원
                                                            </p>
                                                        </div>
                                                        {isResultValid && (
                                                            <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50">
                                                                유사도: {((project.similarity || 0) * 100).toFixed(0)}%
                                                            </Badge>
                                                        )}
                                                        {!isResultValid && project.platform && (
                                                            <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                                                                {project.platform}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <p className="text-slate-500 text-sm">관련 연구 과제를 찾을 수 없습니다.</p>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Full Page Researcher Detail View */}
            {selectedResearcher && (
                <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
                    {/* Left: Researcher Profile */}
                    <div className="lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full overflow-y-auto shrink-0">
                        <button
                            onClick={() => setSelectedResearcher(null)}
                            className="self-start text-sm text-slate-500 hover:text-indigo-600 mb-4 flex items-center transition-colors"
                        >
                            <FaArrowLeft className="mr-2" /> 목록으로 돌아가기
                        </button>

                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-5xl overflow-hidden mb-4 border-4 border-white shadow-md">
                                {selectedResearcher.image_url ? (
                                    <img src={selectedResearcher.image_url} alt={selectedResearcher.name_ko} className="w-full h-full object-cover object-top scale-125" />
                                ) : (
                                    "👨‍⚕️"
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">{selectedResearcher.name_ko || selectedResearcher.name}</h2>
                            <p className="text-slate-500 font-medium">{selectedResearcher.department} | {selectedResearcher.position || selectedResearcher.specialty}</p>

                            {selectedResearcher.keywords && (
                                <div className="flex gap-1 flex-wrap justify-center mt-3">
                                    {selectedResearcher.keywords.slice(0, 3).map((k: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{k}</Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 flex-1">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                                    <div className="text-xl font-bold text-indigo-600">{selectedResearcher.publications || selectedResearcher.recent_papers_3yr || 0}</div>
                                    <div className="text-xs text-slate-500">논문 수</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                                    <div className="text-xl font-bold text-emerald-600">{selectedResearcher.projects || selectedResearcher.total_pi_count || 0}</div>
                                    <div className="text-xs text-slate-500">과제 수</div>
                                </div>
                            </div>

                            {/* Contact Info - Only Link */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                                {selectedResearcher.ku_url ? (
                                    <a href={selectedResearcher.ku_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-2 w-full justify-center">
                                        <span className="text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">Link</span>
                                        병원 의료진 소개 페이지
                                    </a>
                                ) : (
                                    <p className="text-xs text-slate-400 text-center">상세 페이지 링크가 없습니다.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Projects & Details */}
                    <div className="lg:w-2/3 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">

                        {/* Platforms - Moved to Top */}
                        {selectedResearcher.platforms && selectedResearcher.platforms.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 shrink-0">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                    <FaHandshake className="mr-2 text-blue-500" />참여 플랫폼
                                </h3>
                                <div className="flex gap-2 flex-wrap">
                                    {selectedResearcher.platforms.map((p: string, i: number) => {
                                        const platformColors: Record<string, string> = {
                                            "정밀의료기기": "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
                                            "정밀재생": "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100",
                                            "면역-마이크로바이옴": "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100",
                                            "신약": "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100",
                                            "데이터": "bg-cyan-50 text-cyan-700 border-cyan-100 hover:bg-cyan-100",
                                            "혁신형의사과학자": "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
                                        };
                                        const colorClass = platformColors[p] || "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100";

                                        return (
                                            <Badge key={i} className={`px-3 py-1 text-sm border ${colorClass}`}>
                                                {p}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Associated Projects - Moved to Middle */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 shrink-0">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                <FaFlask className="mr-2 text-emerald-500" />관련 연구 과제
                            </h3>

                            <div className="space-y-4">
                                {(() => {
                                    // If we have search results, try to filter projects relevant to this researcher
                                    // Otherwise use mock projects
                                    const relevantProjects = results?.projects?.filter((p: any) =>
                                        p.researcher_name === selectedResearcher.name ||
                                        p.pi === selectedResearcher.name
                                    ) || mockRecruitmentData.topProjects.slice(0, 3);

                                    return relevantProjects.length > 0 ? (
                                        relevantProjects.map((project: any, idx: number) => (
                                            <div key={idx} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-800 line-clamp-1">{project.title}</h4>
                                                    <Badge variant="outline" className="shrink-0 ml-2">{project.year || "2024"}</Badge>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2 line-clamp-2">{project.description || "연구 과제에 대한 상세 설명이 없습니다."}</p>
                                                <div className="flex justify-between items-center text-xs text-slate-400">
                                                    <span>연구비: {project.budget || 0}백만원</span>
                                                    <span>{project.platform || "국책과제"}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm">관련된 연구 과제 정보가 없습니다.</p>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Major Research Areas (Papers) - Moved to Bottom */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 shrink-0">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                <FaMicrochip className="mr-2 text-indigo-500" />주요 연구 분야
                            </h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                {selectedResearcher.major_research || "등록된 주요 연구 분야 정보가 없습니다."}
                            </p>

                            {/* Paper Topics - Compact Style */}
                            {selectedResearcher.paper_topics && selectedResearcher.paper_topics.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center">
                                        <FaFlask className="mr-2 text-indigo-500" />주요 논문 주제
                                    </h4>
                                    {selectedResearcher.paper_topics.map((topic: string, i: number) => {
                                        let journal = "";
                                        let title = topic;
                                        // Parse [Journal] Title format
                                        const match = topic.match(/^\[(.*?)\]\s*(.*)$/);
                                        if (match) {
                                            journal = match[1];
                                            title = match[2];
                                        }

                                        return (
                                            <Card key={i} className="bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 group">
                                                <CardContent className="p-2.5 flex flex-col gap-1">
                                                    {journal && (
                                                        <div className="flex items-center">
                                                            <span className="inline-flex items-center rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 group-hover:bg-indigo-100 transition-colors">
                                                                {journal}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-slate-700 font-medium leading-snug group-hover:text-indigo-900 transition-colors line-clamp-2">
                                                        {title}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
