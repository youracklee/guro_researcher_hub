"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaSearch, FaUserMd, FaFlask, FaRobot } from "react-icons/fa";
import { researchers as mockResearchers, recruitmentData as mockRecruitmentData } from "@/lib/mocks";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults(null);

        try {
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Search failed:", error);
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

                    {/* AI Summary (Only show if results exist) */}
                    {results?.aiSummary && (
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
                                {results ? "관련 연구자" : "전체 연구자 (추천)"}
                            </h2>

                            {(() => {
                                const displayResearchers = results ? (results.researchers || []) : mockResearchers;
                                return displayResearchers.length > 0 ? (
                                    displayResearchers.map((researcher: any) => (
                                        <Card key={researcher.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                            <CardContent className="p-4 flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl overflow-hidden">
                                                    {researcher.image_url ? (
                                                        <img src={researcher.image_url} alt={researcher.name_ko || researcher.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        "👨‍⚕️"
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{researcher.name_ko || researcher.name}</h3>
                                                    <p className="text-sm text-slate-500">{researcher.department} | {researcher.position || researcher.specialty}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {results && (
                                                            <Badge variant="secondary" className="text-xs">유사도: {(researcher.similarity * 100).toFixed(0)}%</Badge>
                                                        )}
                                                        {!results && researcher.keywords && (
                                                            <div className="flex gap-1 flex-wrap">
                                                                {researcher.keywords.slice(0, 2).map((k: string, i: number) => (
                                                                    <Badge key={i} variant="outline" className="text-xs text-slate-500">{k}</Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {(researcher.profile_url || researcher.image_url) && (
                                                            <a href={researcher.profile_url || "#"} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">프로필 보기</a>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm">관련 연구자를 찾을 수 없습니다.</p>
                                );
                            })()}
                        </div>

                        {/* Projects Results (Only show if results exist or if we want to show random projects) */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                <FaFlask className="mr-2 text-emerald-500" />
                                {results ? "관련 연구 과제" : "최근 연구 과제"}
                            </h2>
                            {(() => {
                                const displayProjects = results ? (results.projects || []) : mockRecruitmentData.topProjects;
                                return displayProjects.length > 0 ? (
                                    displayProjects.map((project: any, idx: number) => (
                                        <Card key={project.id || idx} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-slate-800 mb-1 line-clamp-2">{project.title}</h3>
                                                <div className="flex justify-between items-end mt-2">
                                                    <div>
                                                        <p className="text-sm text-slate-600">연구책임자: {project.researcher_name || project.pi}</p>
                                                        <p className="text-xs text-slate-400">
                                                            {project.year ? `${project.year}년 | ` : ""}
                                                            {project.budget}백만원
                                                        </p>
                                                    </div>
                                                    {results && (
                                                        <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50">
                                                            유사도: {(project.similarity * 100).toFixed(0)}%
                                                        </Badge>
                                                    )}
                                                    {!results && project.platform && (
                                                        <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                                                            {project.platform}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm">관련 연구 과제를 찾을 수 없습니다.</p>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
