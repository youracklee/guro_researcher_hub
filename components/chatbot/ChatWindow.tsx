"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
    id: number;
    role: "user" | "bot";
    content: string;
};

export function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: "bot", content: "Hello! How can I assist you with your research today?" },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage: Message = { id: Date.now(), role: "user", content: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: "bot", content: "This is a demo response. I can help you find researchers or analyze data." },
            ]);
        }, 1000);
    };

    return (
        <Card className="flex h-[600px] flex-col">
            <CardHeader>
                <CardTitle>Research Assistant Bot</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4">
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                    }`}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{msg.role === "user" ? "ME" : "AI"}</AvatarFallback>
                                    <AvatarImage src={msg.role === "user" ? "https://github.com/shadcn.png" : ""} />
                                </Avatar>
                                <div
                                    className={`rounded-lg px-3 py-2 text-sm ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <form
                    className="flex w-full items-center gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                >
                    <Input
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
