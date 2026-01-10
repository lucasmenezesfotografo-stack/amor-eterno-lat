CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: gift_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gift_pages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    your_name text NOT NULL,
    partner_name text NOT NULL,
    start_date date NOT NULL,
    cover_photo_url text,
    love_letter text,
    soundtrack_name text,
    soundtrack_url text,
    spotify_link text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid
);


--
-- Name: gift_pages gift_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_pages
    ADD CONSTRAINT gift_pages_pkey PRIMARY KEY (id);


--
-- Name: gift_pages gift_pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_pages
    ADD CONSTRAINT gift_pages_slug_key UNIQUE (slug);


--
-- Name: idx_gift_pages_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gift_pages_slug ON public.gift_pages USING btree (slug);


--
-- Name: idx_gift_pages_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_gift_pages_user_id ON public.gift_pages USING btree (user_id);


--
-- Name: gift_pages gift_pages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gift_pages
    ADD CONSTRAINT gift_pages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: gift_pages Anyone can create gift pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create gift pages" ON public.gift_pages FOR INSERT WITH CHECK (true);


--
-- Name: gift_pages Anyone can view gift pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view gift pages" ON public.gift_pages FOR SELECT USING (true);


--
-- Name: gift_pages Users can delete their own gift pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own gift pages" ON public.gift_pages FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: gift_pages Users can update their own gift pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own gift pages" ON public.gift_pages FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: gift_pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.gift_pages ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;