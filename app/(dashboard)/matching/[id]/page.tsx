"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Globe, Award, BookOpen, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { researchers } from "@/lib/mocks";
import { notFound } from "next/navigation";

export default function ResearcherDetailPage({ params }: { params: { id: string } }) {
    const researcher = researchers.find((r) => r.id === params.id);

    if (!researcher) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                    <Link href="/matching" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Matching
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={researcher.image_url} />
                                <AvatarFallback>{researcher.name_ko[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-2xl">{researcher.name_ko}</CardTitle>
                        <CardDescription className="text-lg">{researcher.name_en}</CardDescription>
                        <div className="mt-2 text-sm font-medium text-muted-foreground">
                            {researcher.position} @ {researcher.department}
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{researcher.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{researcher.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <FlaskConical className="h-4 w-4 text-muted-foreground" />
                            <span>{researcher.lab_info}</span>
                        </div>
                        <Separator />
                        <Button className="w-full">Request Collaboration</Button>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Major Research</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-7">{researcher.major_research}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Research Keywords</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {researcher.keywords.map((keyword) => (
                                    <Badge key={keyword} variant="secondary" className="text-sm">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Publications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{researcher.publications}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{researcher.projects}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Citations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{researcher.citations}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
