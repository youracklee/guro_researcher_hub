import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function OnboardingPage() {
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Complete your profile</CardTitle>
                <CardDescription>
                    Tell us about your research interests to get better matches.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Dr. Jane Doe" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                        <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                            <SelectItem value="oncology">Oncology</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="interests">Research Interests (comma separated)</Label>
                    <Input id="interests" placeholder="e.g. AI, Genomics, Clinical Trials" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="bio">Short Bio</Label>
                    <Textarea id="bio" placeholder="Briefly describe your research focus..." />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" asChild>
                    <Link href="/">Complete Setup</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
