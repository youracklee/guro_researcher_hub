-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table for researchers
create table if not exists researchers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text,
  specialty text,
  keywords text, -- Comma-separated keywords or JSON array
  profile_url text,
  embedding vector(1536) -- OpenAI text-embedding-3-small dimensions
);

-- Create a table for projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  researcher_name text, -- We can link this to researchers.name or id if possible, but text is fine for loose coupling
  year text,
  budget text,
  embedding vector(1536)
);

-- Create a function to search researchers by embedding similarity
create or replace function match_researchers (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  department text,
  specialty text,
  profile_url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    researchers.id,
    researchers.name,
    researchers.department,
    researchers.specialty,
    researchers.profile_url,
    1 - (researchers.embedding <=> query_embedding) as similarity
  from researchers
  where 1 - (researchers.embedding <=> query_embedding) > match_threshold
  order by researchers.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create a function to search projects by embedding similarity
create or replace function match_projects (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  researcher_name text,
  year text,
  budget text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    projects.id,
    projects.title,
    projects.researcher_name,
    projects.year,
    projects.budget,
    1 - (projects.embedding <=> query_embedding) as similarity
  from projects
  where 1 - (projects.embedding <=> query_embedding) > match_threshold
  order by projects.embedding <=> query_embedding
  limit match_count;
end;
$$;
