import { createClient } from '@supabase/supabase-js';

// Use environment variables in a production environment

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Define database types
export type Profile = {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  experience_level: string;
  looking_for: string[];
  project_interests: string[];
  contact_email: string;
  github_url?: string;
  linkedin_url?: string;
};

export type Connection = {
  id: string;
  created_at: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
};

export type Message = {
  id: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
};

export type TeamMatch = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  match_percentage: number;
  user_ids: string[];
};

export type AgentCall = {
  id: string;
  created_at: string;
  user_id: string;
  call_duration: number;
  call_summary: string;
  call_recording_url?: string;
  updated_profile_data?: Record<string, any>;
};

// Create Supabase client
export const supabase = createClient<{
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      connections: {
        Row: Connection;
        Insert: Omit<Connection, 'id' | 'created_at'>;
        Update: Partial<Omit<Connection, 'id' | 'created_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
      };
      team_matches: {
        Row: TeamMatch;
        Insert: Omit<TeamMatch, 'id' | 'created_at'>;
        Update: Partial<Omit<TeamMatch, 'id' | 'created_at'>>;
      };
      agent_calls: {
        Row: AgentCall;
        Insert: Omit<AgentCall, 'id' | 'created_at'>;
        Update: Partial<Omit<AgentCall, 'id' | 'created_at'>>;
      };
    };
  };
}>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'user_id'>>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select();
  
  return { data, error };
};

// Connection helpers
export const getConnections = async (userId: string) => {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const sendConnectionRequest = async (requesterId: string, recipientId: string, message?: string) => {
  const { data, error } = await supabase
    .from('connections')
    .insert({
      requester_id: requesterId,
      recipient_id: recipientId,
      status: 'pending',
      message
    })
    .select();
  
  return { data, error };
};

export const updateConnectionStatus = async (connectionId: string, status: 'accepted' | 'rejected') => {
  const { data, error } = await supabase
    .from('connections')
    .update({ status })
    .eq('id', connectionId)
    .select();
  
  return { data, error };
};

// Message helpers
export const getMessages = async (userId: string, otherId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${userId})`)
    .order('created_at', { ascending: true });
  
  return { data, error };
};

export const sendMessage = async (senderId: string, recipientId: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      read: false
    })
    .select();
  
  return { data, error };
};

export const markMessagesAsRead = async (recipientId: string, senderId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('recipient_id', recipientId)
    .eq('sender_id', senderId)
    .is('read', false);
  
  return { data, error };
};

// Team match helpers
export const getTeamMatches = async (userId: string) => {
  const { data, error } = await supabase
    .from('team_matches')
    .select('*')
    .contains('user_ids', [userId]);
  
  return { data, error };
};

// Agent call helpers
export const scheduleAgentCall = async (userId: string) => {
  const { data, error } = await supabase
    .from('agent_calls')
    .insert({
      user_id: userId,
      call_duration: 0,
      call_summary: 'Scheduled'
    })
    .select();
  
  return { data, error };
};

export const updateAgentCallData = async (callId: string, updates: Partial<Omit<AgentCall, 'id' | 'created_at' | 'user_id'>>) => {
  const { data, error } = await supabase
    .from('agent_calls')
    .update(updates)
    .eq('id', callId)
    .select();
  
  return { data, error };
};
