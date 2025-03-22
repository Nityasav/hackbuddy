
# HackBuddy - AI-Powered Hackathon Team Matching

HackBuddy is an innovative platform designed to solve one of the biggest challenges in hackathons: finding the perfect team. Our AI-powered system matches participants based on complementary skills, experience levels, and project interests.

## Supabase Setup Instructions

### Step 1: Create a Supabase Project

1. Sign up for a free Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project and note your project URL and anon/public key
3. Update the `supabaseUrl` and `supabaseAnonKey` in `src/lib/supabase.ts`

### Step 2: Set Up Database Tables

Execute the following SQL in the Supabase SQL Editor to create the required tables:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_level TEXT,
  looking_for TEXT[] DEFAULT '{}',
  project_interests TEXT[] DEFAULT '{}',
  contact_email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  UNIQUE (user_id)
);

-- Create connections table
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  requester_id UUID REFERENCES auth.users NOT NULL,
  recipient_id UUID REFERENCES auth.users NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  message TEXT
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sender_id UUID REFERENCES auth.users NOT NULL,
  recipient_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE
);

-- Create team_matches table
CREATE TABLE public.team_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  match_percentage INTEGER CHECK (match_percentage BETWEEN 0 AND 100),
  user_ids UUID[] NOT NULL
);

-- Create agent_calls table
CREATE TABLE public.agent_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users NOT NULL,
  call_duration INTEGER DEFAULT 0,
  call_summary TEXT,
  call_recording_url TEXT,
  updated_profile_data JSONB
);

-- Set up RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_calls ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Connections table policies
CREATE POLICY "Connections are viewable by involved users"
ON public.connections FOR SELECT USING (
  auth.uid() = requester_id OR auth.uid() = recipient_id
);

CREATE POLICY "Users can insert their own connection requests"
ON public.connections FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections they're involved in"
ON public.connections FOR UPDATE USING (
  auth.uid() = requester_id OR auth.uid() = recipient_id
);

-- Messages table policies
CREATE POLICY "Messages are viewable by involved users"
ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);

CREATE POLICY "Users can insert their own messages"
ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they sent"
ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- Team matches table policies
CREATE POLICY "Team matches are viewable by involved users"
ON public.team_matches FOR SELECT USING (
  auth.uid() = ANY(user_ids)
);

-- Agent calls table policies
CREATE POLICY "Agent calls are viewable by the user"
ON public.agent_calls FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agent calls"
ON public.agent_calls FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, contact_email)
  VALUES (NEW.id, NEW.email, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Step 3: Configure Authentication

1. In Supabase Dashboard, go to Authentication → Settings
2. Set up your Site URL and any redirect URLs
3. Configure Email templates for auth emails

### Step 4: Set Up Storage

1. In Supabase Dashboard, go to Storage
2. Create a new bucket called "avatars" for profile pictures
3. Set up appropriate bucket policies

## Integrating with Voice API

For the AI agent voice calling functionality, you'll need to set up:

1. Register for a Vapi API account
2. Create an .env file with your Vapi API key
3. Implement the voice agent functionality using their SDK

## Running the Project

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```
