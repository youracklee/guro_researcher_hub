import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // 1. Generate embedding for the query
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // 2. Search Researchers
        const { data: researchers, error: researchersError } = await supabase.rpc(
            'match_researchers',
            {
                query_embedding: embedding,
                match_threshold: 0.3, // Adjust threshold as needed
                match_count: 5,
            }
        );

        if (researchersError) {
            console.error('Error searching researchers:', researchersError);
            return NextResponse.json({ error: 'Error searching researchers' }, { status: 500 });
        }

        // 3. Search Projects
        const { data: projects, error: projectsError } = await supabase.rpc(
            'match_projects',
            {
                query_embedding: embedding,
                match_threshold: 0.3,
                match_count: 5,
            }
        );

        if (projectsError) {
            console.error('Error searching projects:', projectsError);
            return NextResponse.json({ error: 'Error searching projects' }, { status: 500 });
        }

        // 4. (Optional) Generate AI Summary/Insight using GPT-4o
        let aiSummary = '';
        try {
            const context = `
        Researchers: ${JSON.stringify(researchers?.map((r: any) => ({ name: r.name, specialty: r.specialty })))}
        Projects: ${JSON.stringify(projects?.map((p: any) => ({ title: p.title, researcher: p.researcher_name })))}
        `;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a helpful assistant for a hospital research dashboard. Summarize the search results for the user's query. Highlight key researchers and projects." },
                    { role: "user", content: `Query: ${query}\n\nContext:\n${context}` }
                ],
                max_tokens: 150
            });
            aiSummary = completion.choices[0].message.content || '';
        } catch (aiError) {
            console.error("Error generating AI summary:", aiError);
            // Continue without summary if it fails
        }

        return NextResponse.json({
            researchers,
            projects,
            aiSummary
        });

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
