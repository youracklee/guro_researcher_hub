import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const researchers = [
    {
        id: 1,
        name: "Dr. Kim Min-su",
        department: "Cardiology",
        interests: ["Heart Failure", "Arrhythmia", "AI Diagnosis"],
        image: "https://github.com/shadcn.png",
    },
    {
        id: 2,
        name: "Dr. Lee Ji-hyun",
        department: "Neurology",
        interests: ["Alzheimer's", "Neuroscience", "Genomics"],
        image: "https://github.com/shadcn.png",
    },
    {
        id: 3,
        name: "Dr. Park Sung-ho",
        department: "Oncology",
        interests: ["Immunotherapy", "Lung Cancer", "Clinical Trials"],
        image: "https://github.com/shadcn.png",
    },
    {
        id: 4,
        name: "Dr. Choi Soo-jin",
        department: "Pediatrics",
        interests: ["Rare Diseases", "Genetics", "Neonatology"],
        image: "https://github.com/shadcn.png",
    },
];

export default function MatchingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Researcher Matching</h1>
                    <p className="text-muted-foreground">Find and connect with researchers for collaboration.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button>Register Profile</Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name, department, or keyword..."
                        className="pl-8"
                    />
                </div>
                <Button>Search</Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {researchers.map((researcher) => (
                    <Card key={researcher.id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={researcher.image} alt={researcher.name} />
                                <AvatarFallback>{researcher.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <CardTitle className="text-lg">{researcher.name}</CardTitle>
                                <CardDescription>{researcher.department}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {researcher.interests.map((interest) => (
                                    <Badge key={interest} variant="secondary">
                                        {interest}
                                    </Badge>
                                ))}
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
