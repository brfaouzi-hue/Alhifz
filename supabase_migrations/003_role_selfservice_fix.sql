-- ═══════════════════════════════════════════════════════════
-- Al-Hifz — Corrections suite au déploiement de 002_profiles.sql
-- Déjà exécuté manuellement le 2026-07-25 — conservé ici pour l'historique
-- ═══════════════════════════════════════════════════════════

-- Le trigger de création automatique de profil faisait échouer TOUTE inscription
-- (auth.uid() ne se résout pas correctement dans le contexte du trigger sur
-- auth.users, donc la policy INSERT de profiles rejetait la ligne et cassait
-- la transaction complète). Désactivé — les utilisateurs renseignent leur nom
-- manuellement dans Réglages (le profil existe déjà pour les comptes backfillés
-- par 002_profiles.sql).
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;

-- user_roles n'avait aucune policy permettant à un utilisateur de définir son
-- propre rôle (nécessaire pour le bouton "Mode enseignant" dans Réglages).
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users manage own role" ON user_roles;
CREATE POLICY "users manage own role" ON user_roles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
