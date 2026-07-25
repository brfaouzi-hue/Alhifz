-- ═══════════════════════════════════════════════════════════
-- Al-Hifz — Lien de visio (Google Meet/Zoom/Jitsi...) par créneau
-- À exécuter dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

ALTER TABLE availability_slots ADD COLUMN IF NOT EXISTS meeting_link TEXT;
