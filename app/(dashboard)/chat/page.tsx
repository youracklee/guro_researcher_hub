import { ChatWindow } from "@/components/chatbot/ChatWindow";

export default function ChatPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Chat Assistant</h1>
                <p className="text-muted-foreground">Ask questions about research trends, finding collaborators, or grant opportunities.</p>
            </div>
            <div className="mx-auto w-full max-w-4xl">
                <ChatWindow />
            </div>
        </div>
    );
}
