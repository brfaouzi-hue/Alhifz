-- ═══════════════════════════════════════════════════════════
-- Al-Hifz — Fix : confirmer/annuler une réservation plantait
-- ("column type is of type notif_type but expression is of type text")
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION notify_student_on_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.status <> OLD.status AND NEW.status IN ('confirmed','cancelled') THEN
    INSERT INTO notifications(user_id, type, title, body, data)
    VALUES (
      NEW.student_id,
      (CASE NEW.status
        WHEN 'confirmed' THEN 'booking_confirmed'
        WHEN 'cancelled' THEN 'booking_cancelled'
      END)::notif_type,
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
