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
}
