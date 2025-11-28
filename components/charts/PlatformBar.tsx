"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { name: "Genomics", projects: 45 },
    { name: "AI/Big Data", projects: 78 },
    { name: "Regenerative", projects: 32 },
    { name: "Medical Device", projects: 56 },
    { name: "Clinical Trials", projects: 90 },
    { name: "New Drug", projects: 24 },
];

export function PlatformBar() {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Research Platforms</CardTitle>
                <CardDescription>Active projects by platform</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="projects" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
