ALTER TABLE public.chatbot_leads ADD COLUMN IF NOT EXISTS notes jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chatbot_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_leads;