
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaSearch, FaUserMd, FaFlask, FaRobot } from "react-icons/fa";
import { researchers as mockResearchers, recruitmentData as mockRecruitmentData } from "@/lib/mocks";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedResearcher, setSelectedResearcher] = useState<any>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults(null);
        setError(null);
        setSelectedResearcher(null);

        try {
            console.log("Sending search request for:", query);
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            console.log("API Response Status:", res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error("API Error Body:", errorText);
                let errorMessage = `Server Error (${res.status})`;
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.error) errorMessage = errorJson.error;
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
            <header>
                <h1 className="text-2xl font-bold text-slate-800">AI 연구 주제 탐색</h1>
                <p className="text-slate-500 text-sm mt-1">자연어로 연구 주제나 키워드를 입력하여 관련 연구자와 프로젝트를 찾아보세요.</p>
            </header>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                        className="pl-10 h-12 text-lg bg-white shadow-sm"
                        placeholder="예: 인공지능을 활용한 영상 진단 연구"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <Button type="submit" size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                    {loading ? "검색 중..." : "검색"}
                </Button>
            </form>

            {/* Loading Indicator */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-500">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">AI가 연구 주제를 분석하고 있습니다...</p>
                    <p className="text-slate-400 text-sm">잠시만 기다려주세요.</p>
                </div>
            )}

            {/* Results Area */}
            {!loading && (
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
                        <Card className="bg-indigo-50 border-indigo-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center text-indigo-700 text-lg">
                                    <FaRobot className="mr-2" /> AI 요약
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{results.aiSummary}</p>
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
                                const displayResearchers = isResultValid ? results.researchers : mockResearchers;

                                return displayResearchers?.length > 0 ? (
                                    displayResearchers.map((researcher: any, idx: number) => {
                                        if (!researcher) return null;
                                        return (
                                            <Card
                                                key={researcher.id || idx}
                                                className="hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-300"
                                                onClick={() => setSelectedResearcher(researcher)}
                                            >
                                                <CardContent className="p-4 flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl overflow-hidden">
                                                        {researcher.image_url ? (
                                                            <img src={researcher.image_url} alt={researcher.name_ko || researcher.name || "Researcher"} className="w-full h-full object-cover" />
                                                        ) : (
                                                            "👨‍⚕️"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">{researcher.name_ko || researcher.name || "이름 없음"}</h3>
                                                        <p className="text-sm text-slate-500">{researcher.department || "소속 없음"} | {researcher.position || researcher.specialty || "직위 없음"}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {isResultValid && (
                                                                <Badge variant="secondary" className="text-xs">유사도: {((researcher.similarity || 0) * 100).toFixed(0)}%</Badge>
                                                            )}
                                                            {!isResultValid && researcher.keywords && (
                                                                <div className="flex gap-1 flex-wrap">
                                                                    {researcher.keywords.slice(0, 2).map((k: string, i: number) => (
                                                                        <Badge key={i} variant="outline" className="text-xs text-slate-500">{k}</Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {(researcher.profile_url || researcher.image_url) && (
                                                                <span className="text-xs text-indigo-600 hover:underline">상세보기</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
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

            {/* Researcher Detail Modal */}
            <Dialog open={!!selectedResearcher} onOpenChange={(open) => !open && setSelectedResearcher(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {selectedResearcher?.name_ko || selectedResearcher?.name}
                            <Badge variant="outline" className="text-sm font-normal text-slate-500">
                                {selectedResearcher?.department}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            {selectedResearcher?.position || selectedResearcher?.specialty}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Basic Info */}
                        <div className="flex gap-6">
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl overflow-hidden flex-shrink-0">
                                {selectedResearcher?.image_url ? (
                                    <img src={selectedResearcher.image_url} alt={selectedResearcher.name_ko} className="w-full h-full object-cover" />
                                ) : (
                                    "👨‍⚕️"
                                )}
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <h4 className="font-semibold text-slate-900">주요 연구 분야</h4>
                                    <p className="text-slate-600">{selectedResearcher?.major_research || "정보 없음"}</p>
                                </div>
                                {selectedResearcher?.keywords && (
                                    <div className="flex gap-1 flex-wrap">
                                        {selectedResearcher.keywords.map((k: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-xs">{k}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg text-center">
                                <div className="text-2xl font-bold text-indigo-600">{selectedResearcher?.publications || 0}</div>
                                <div className="text-xs text-slate-500">논문 수</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg text-center">
                                <div className="text-2xl font-bold text-emerald-600">{selectedResearcher?.projects || 0}</div>
                                <div className="text-xs text-slate-500">과제 수</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">{selectedResearcher?.citations || 0}</div>
                                <div className="text-xs text-slate-500">피인용 수</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg text-center">
                                <div className="text-2xl font-bold text-violet-600">{selectedResearcher?.budget || 0}억</div>
                                <div className="text-xs text-slate-500">연구비</div>
                            </div>
                        </div>

                        {/* Lab Info */}
                        {selectedResearcher?.lab_info && (
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2">연구실 정보</h4>
                                <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-md">
                                    {selectedResearcher.lab_info}
                                </p>
                            </div>
                        )}

                        {/* Platforms */}
                        {selectedResearcher?.platforms && selectedResearcher.platforms.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2">참여 플랫폼</h4>
                                <div className="flex gap-2">
                                    {selectedResearcher.platforms.map((p: string, i: number) => (
                                        <Badge key={i} variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                                            {p}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* External Link */}
                        {(selectedResearcher?.profile_url) && (
                            <div className="pt-4 border-t">
                                <a
                                    href={selectedResearcher.profile_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 hover:underline text-sm flex items-center"
                                >
                                    병원 프로필 페이지 방문하기 →
                                </a>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
