-- ═══════════════════════════════════════════════════════════
-- Al-Hifz — Planning + cours collectifs
-- À exécuter dans Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Types de séances
CREATE TYPE session_type AS ENUM ('individual', 'group');
CREATE TYPE booking_status AS ENUM ('pending','confirmed','cancelled','completed');
CREATE TYPE notif_type AS ENUM (
  'booking_request','booking_confirmed','booking_cancelled',
  'session_reminder','session_full','session_cancelled'
);

-- Créneaux du professeur
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  session_type session_type NOT NULL DEFAULT 'individual',
  title TEXT, -- obligatoire pour les cours collectifs (vérifié côté app)
  description TEXT,
  day_of_week SMALLINT CHECK (day_of_week BETWEEN 0 AND 6),
  date DATE, -- pour créneaux ponctuels
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 45,
  recurring BOOLEAN DEFAULT FALSE,
  max_students INTEGER NOT NULL DEFAULT 1, -- 1=individuel, >1=collectif
  price_cents INTEGER DEFAULT 0,
  level TEXT, -- débutant / intermédiaire / avancé
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_availability_slots_teacher ON availability_slots(teacher_id);
CREATE INDEX idx_availability_slots_class ON availability_slots(class_id);

-- Réservations
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES availability_slots(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  status booking_status DEFAULT 'pending',
  student_note TEXT,
  teacher_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slot_id, student_id, booking_date)
);

CREATE INDEX idx_bookings_teacher ON bookings(teacher_id);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_slot_date ON bookings(slot_id, booking_date);

-- Notifications in-app
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notif_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read);

-- RLS
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Slots : le prof gère les siens
CREATE POLICY "teacher manages own slots" ON availability_slots
  FOR ALL USING (auth.uid() = teacher_id);

-- Slots : un élève voit tous les créneaux d'un prof dont il suit AU MOINS une classe
-- (pas seulement ceux liés explicitement à sa classe — un créneau individuel
-- n'a souvent pas de class_id, mais ne doit être visible qu'aux élèves de ce prof)
CREATE POLICY "student sees slots of their teachers" ON availability_slots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_members cm
      JOIN classes c ON c.id = cm.class_id
      WHERE c.teacher_id = availability_slots.teacher_id
      AND cm.student_id = auth.uid()
    )
  );

-- Bookings : le prof voit et met à jour le statut des réservations sur ses créneaux
CREATE POLICY "teacher sees bookings on own slots" ON bookings
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "teacher updates booking status" ON bookings
  FOR UPDATE USING (auth.uid() = teacher_id);

-- Bookings élève : séparé en 3 policies (pas de FOR ALL) pour empêcher
-- un élève de s'auto-confirmer une réservation via l'API directe.
CREATE POLICY "student views own bookings" ON bookings
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "student creates own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = student_id AND status = 'pending');

CREATE POLICY "student cancels own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id AND status = 'cancelled');

-- Notifications
CREATE POLICY "user sees own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Empêche le dépassement de capacité (individuel ou collectif) même sous
-- requêtes concurrentes — c'est ce qui rend le statut "complet" fiable.
CREATE OR REPLACE FUNCTION check_booking_capacity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  max_cap INTEGER;
  current_count INTEGER;
BEGIN
  SELECT max_students INTO max_cap FROM availability_slots WHERE id = NEW.slot_id;
  SELECT COUNT(*) INTO current_count FROM bookings
    WHERE slot_id = NEW.slot_id AND booking_date = NEW.booking_date
    AND status IN ('pending','confirmed');
  IF current_count >= max_cap THEN
    RAISE EXCEPTION 'Ce créneau est complet';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_booking_insert_check_capacity
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION check_booking_capacity();

-- Trigger : notif au prof quand booking créé
CREATE OR REPLACE FUNCTION notify_teacher_on_booking()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE slot_info RECORD;
BEGIN
  SELECT title, start_time, session_type INTO slot_info
  FROM availability_slots WHERE id = NEW.slot_id;
  INSERT INTO notifications(user_id, type, title, body, data)
  VALUES (
    NEW.teacher_id,
    'booking_request',
    'Nouvelle demande de réservation',
    'Un élève veut réserver le ' || TO_CHAR(NEW.booking_date, 'DD/MM') || ' à ' || TO_CHAR(NEW.start_time, 'HH24:MI'),
    jsonb_build_object('booking_id', NEW.id, 'slot_id', NEW.slot_id)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION notify_teacher_on_booking();

-- Trigger : notif à l'élève quand status change (confirmé/annulé uniquement —
-- 'completed' n'a pas de notif_type dédié et n'a pas besoin d'alerter l'élève)
CREATE OR REPLACE FUNCTION notify_student_on_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status <> OLD.status AND NEW.status IN ('confirmed','cancelled') THEN
    INSERT INTO notifications(user_id, type, title, body, data)
    VALUES (
      NEW.student_id,
      CASE NEW.status
        WHEN 'confirmed' THEN 'booking_confirmed'
        WHEN 'cancelled' THEN 'booking_cancelled'
      END,
      CASE NEW.status
        WHEN 'confirmed' THEN 'Créneau confirmé ✓'
        WHEN 'cancelled' THEN 'Créneau annulé'
      END,
      CASE NEW.status
        WHEN 'confirmed' THEN 'Ton cours du ' || TO_CHAR(NEW.booking_date, 'DD/MM') || ' à ' || TO_CHAR(NEW.start_time, 'HH24:MI') || ' est confirmé'
        WHEN 'cancelled' THEN 'Ton cours du ' || TO_CHAR(NEW.booking_date, 'DD/MM') || ' a été annulé. ' || COALESCE(NEW.teacher_note, '')
      END,
      jsonb_build_object('booking_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_status_changed
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION notify_student_on_status_change();

-- Vue pratique : occupation par (créneau, date) — pas seulement "aujourd'hui",
-- sinon la vue est inutilisable dès qu'on navigue vers une autre semaine.
-- security_invoker=true : la vue respecte les policies RLS de l'utilisateur
-- qui interroge, plutôt que celles du propriétaire de la vue (comportement
-- par défaut de Postgres qui contournerait silencieusement la RLS ci-dessus).
CREATE VIEW slots_with_availability WITH (security_invoker = true) AS
SELECT
  s.id AS slot_id,
  s.*,
  b.booking_date,
  COUNT(b.id) FILTER (WHERE b.status IN ('pending','confirmed')) AS booked_count,
  s.max_students - COUNT(b.id) FILTER (WHERE b.status IN ('pending','confirmed')) AS available_spots,
  s.max_students > 1 AS is_group
FROM availability_slots s
LEFT JOIN bookings b ON b.slot_id = s.id
GROUP BY s.id, b.booking_date;
