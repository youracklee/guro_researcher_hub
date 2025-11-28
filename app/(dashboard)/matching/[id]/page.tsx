import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Globe, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ResearcherDetailPage({ params }: { params: { id: string } }) {
    // Mock data - in a real app, fetch based on params.id
    const researcher = {
        id: params.id,
        name: "Dr. Kim Min-su",
        department: "Cardiology",
        position: "Professor",
        email: "minsu.kim@hospital.edu",
        phone: "+82-2-1234-5678",
        location: "Main Building, Room 304",
        website: "https://lab.hospital.edu/kim",
        interests: ["Heart Failure", "Arrhythmia", "AI Diagnosis", "Wearable Devices"],
        bio: "Dr. Kim is a leading expert in cardiology with over 15 years of experience. His research focuses on applying artificial intelligence to early diagnosis of heart failure.",
        publications: [
            { title: "AI-driven diagnosis of arrhythmia using ECG data", year: 2024, journal: "Nature Medicine" },
            { title: "Long-term effects of beta-blockers in heart failure", year: 2023, journal: "JACC" },
            { title: "Wearable devices for continuous heart monitoring", year: 2022, journal: "Circulation" },
        ],
        projects: [
            { title: "Development of AI algorithm for ECG analysis", role: "Principal Investigator", period: "2023-2025" },
            { title: "Multi-center clinical trial for new heart failure drug", role: "Co-Investigator", period: "2022-2024" },
        ],
    };

    return (
        <div className="flex flex-col gap-6">
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
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>KM</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-2xl">{researcher.name}</CardTitle>
                        <CardDescription className="text-lg">{researcher.position}</CardDescription>
                        <div className="mt-2 text-sm font-medium text-muted-foreground">{researcher.department}</div>
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
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{researcher.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a href={researcher.website} className="text-primary hover:underline">
                                Lab Website
                            </a>
                        </div>
                        <Separator />
                        <Button className="w-full">Request Collaboration</Button>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Biography</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-7">{researcher.bio}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Research Interests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {researcher.interests.map((interest) => (
                                    <Badge key={interest} variant="secondary" className="text-sm">
                                        {interest}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Publications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid gap-4">
                                {researcher.publications.map((pub, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <BookOpen className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{pub.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {pub.journal}, {pub.year}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid gap-4">
                                {researcher.projects.map((project, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Award className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{project.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {project.role} • {project.period}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
