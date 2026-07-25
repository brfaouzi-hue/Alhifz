-- ═══════════════════════════════════════════════════════════
-- Al-Hifz — Fix : la sauvegarde cloud de la progression échouait
-- silencieusement pour TOUS les utilisateurs depuis le début.
--
-- Deux causes distinctes, vérifiées en direct sur la base :
-- 1) user_progress n'a aucune contrainte unique sur user_id, donc
--    l'upsert (ON CONFLICT (user_id)) utilisé par saveProgress()
--    échoue systématiquement (erreur 42P10, avalée en silence par
--    un try/catch côté app — aucune progression n'a donc jamais été
--    synchronisée dans le cloud).
-- 2) saveProgress() écrit aussi 'bookmark' et 'settings', deux
--    colonnes qui n'existent pas dans la table.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS bookmark JSONB;
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS settings JSONB;

-- Filet de sécurité : au cas où des lignes en double par user_id existeraient
-- (ne devrait pas arriver puisque l'upsert n'a jamais réussi jusqu'ici, mais
-- on ne veut pas que l'ajout de la contrainte plante si c'est le cas).
DELETE FROM user_progress a USING user_progress b
WHERE a.user_id = b.user_id AND a.updated_at < b.updated_at;

ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_id_key UNIQUE (user_id);
