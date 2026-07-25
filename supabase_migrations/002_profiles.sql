-- ═══════════════════════════════════════════════════════════
-- Al-Hifz — Profils (nom affiché pour élèves/profs)
-- À exécuter dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Un profil (juste le nom affiché) doit être lisible par tout le monde connecté
-- (un élève doit voir le nom de son prof, un prof le nom de ses élèves).
CREATE POLICY "profiles readable by authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "users insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Crée automatiquement un profil (nom par défaut = partie avant @ de l'email)
-- à chaque nouvelle inscription.
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- Backfill pour les comptes déjà créés avant ce trigger.
INSERT INTO profiles (id, display_name)
SELECT id, split_part(email, '@', 1) FROM auth.users
ON CONFLICT (id) DO NOTHING;
