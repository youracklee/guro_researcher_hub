"use client";

import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { researchers } from "@/lib/mocks";

export default function MatchingPage() {
    const researcherList = researchers;

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Researcher Matching</h1>
                    <p className="text-muted-foreground">
                        Find and connect with researchers based on your interests.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {researcherList.map((researcher) => (
                    <Card key={researcher.id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={researcher.image_url} alt={researcher.name_ko} />
                                <AvatarFallback>{researcher.name_ko[0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <CardTitle className="text-lg">{researcher.name_ko}</CardTitle>
                                <CardDescription>{researcher.position}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2 text-sm font-medium text-muted-foreground">{researcher.department}</div>
                            <div className="flex flex-wrap gap-2">
                                {researcher.keywords.slice(0, 3).map((keyword) => (
                                    <Badge key={keyword} variant="secondary" className="text-xs">
                                        {keyword}
                                    </Badge>
                                ))}
                                {researcher.keywords.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{researcher.keywords.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/matching/${researcher.id}`}>View Profile</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
