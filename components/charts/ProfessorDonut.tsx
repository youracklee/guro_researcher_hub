"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { name: "Clinical Professors", value: 450 },
    { name: "Research Professors", value: 120 },
    { name: "Fellows", value: 80 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function ProfessorDonut() {
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Researcher Composition</CardTitle>
                <CardDescription>Distribution of research staff</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
