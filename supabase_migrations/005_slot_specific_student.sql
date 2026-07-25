-- ═══════════════════════════════════════════════════════════
-- Al-Hifz — Créneau réservé à un élève précis (pas toute la classe)
-- À exécuter dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

ALTER TABLE availability_slots ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Un créneau ciblant un élève précis n'est visible QUE par lui (pas le reste
-- de la classe) ; un créneau sans élève assigné garde le comportement existant
-- (visible par tous les membres de la classe du prof).
DROP POLICY IF EXISTS "student sees slots of their teachers" ON availability_slots;
CREATE POLICY "student sees relevant slots" ON availability_slots
  FOR SELECT USING (
    student_id = auth.uid()
    OR (
      student_id IS NULL
      AND EXISTS (
        SELECT 1 FROM class_members cm
        JOIN classes c ON c.id = cm.class_id
        WHERE c.teacher_id = availability_slots.teacher_id
        AND cm.student_id = auth.uid()
      )
    )
  );

-- Empêche un autre élève de réserver un créneau ciblé (même s'il en devine
-- l'id), en plus du contrôle de capacité déjà en place.
CREATE OR REPLACE FUNCTION check_booking_capacity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  max_cap INTEGER;
  current_count INTEGER;
  target_student UUID;
BEGIN
  SELECT max_students, student_id INTO max_cap, target_student FROM availability_slots WHERE id = NEW.slot_id;
  IF target_student IS NOT NULL AND target_student <> NEW.student_id THEN
    RAISE EXCEPTION 'Ce créneau est réservé à un autre élève';
  END IF;
  SELECT COUNT(*) INTO current_count FROM bookings
    WHERE slot_id = NEW.slot_id AND booking_date = NEW.booking_date
    AND status IN ('pending','confirmed');
  IF current_count >= max_cap THEN
    RAISE EXCEPTION 'Ce créneau est complet';
  END IF;
  RETURN NEW;
END;
$$;
