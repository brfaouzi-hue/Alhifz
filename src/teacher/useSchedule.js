import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabase';

const SLOT_FIELDS = 'id, teacher_id, class_id, student_id, session_type, title, description, day_of_week, date, start_time, end_time, duration_min, recurring, max_students, price_cents, level, active, created_at, meeting_link';
const BOOKING_FIELDS = 'id, slot_id, student_id, teacher_id, booking_date, start_time, status, student_note, teacher_note, created_at, updated_at';
const NOTIF_FIELDS = 'id, user_id, type, title, body, data, read, created_at';

function addMinutesToTime(time, minutes) {
  const [h, m] = (time || '00:00').split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor((total % (24 * 60)) / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`;
}

// ─────────────────────────────────────────
// Professeur — gestion des créneaux
// ─────────────────────────────────────────
export function useTeacherSlots(userId) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data: slotRows } = await supabase.from('availability_slots')
      .select(SLOT_FIELDS)
      .eq('teacher_id', userId)
      .eq('active', true)
      .order('day_of_week', { ascending: true, nullsFirst: false });
    const ids = (slotRows || []).map(s => s.id);
    let countsBySlot = {};
    if (ids.length) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: todayBookings } = await supabase.from('bookings')
        .select('slot_id')
        .in('slot_id', ids)
        .eq('booking_date', today)
        .in('status', ['pending', 'confirmed']);
      (todayBookings || []).forEach(b => { countsBySlot[b.slot_id] = (countsBySlot[b.slot_id] || 0) + 1; });
    }
    const merged = (slotRows || []).map(s => ({
      ...s,
      booked_count: countsBySlot[s.id] || 0,
      available_spots: s.max_students - (countsBySlot[s.id] || 0),
    }));
    setSlots(merged);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const createSlot = useCallback(async (payload) => {
    if (!userId) return { error: 'Non connecté' };
    const sessionType = payload.session_type || (payload.max_students > 1 ? 'group' : 'individual');
    const maxStudents = sessionType === 'group' ? Math.max(2, payload.max_students || 2) : 1;
    if (sessionType === 'group' && !payload.title?.trim()) {
      return { error: 'Le titre est obligatoire pour un cours collectif' };
    }
    const { data, error } = await supabase.from('availability_slots').insert({
      teacher_id: userId,
      class_id: payload.class_id || null,
      student_id: payload.student_id || null,
      session_type: sessionType,
      title: payload.title?.trim() || null,
      description: payload.description?.trim() || null,
      day_of_week: payload.day_of_week ?? null,
      date: payload.date || null,
      start_time: payload.start_time,
      end_time: payload.end_time || addMinutesToTime(payload.start_time, payload.duration_min || 45),
      duration_min: payload.duration_min || 45,
      recurring: !!payload.recurring,
      max_students: maxStudents,
      price_cents: payload.price_cents || 0,
      level: payload.level || null,
      meeting_link: payload.meeting_link?.trim() || null,
    }).select(SLOT_FIELDS).single();
    if (!error) setSlots(prev => [...prev, { ...data, booked_count: 0, available_spots: data.max_students }]);
    return { data, error };
  }, [userId]);

  const updateSlot = useCallback(async (id, changes) => {
    const { data, error } = await supabase.from('availability_slots')
      .update(changes)
      .eq('id', id)
      .select(SLOT_FIELDS)
      .single();
    if (!error) setSlots(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    return { data, error };
  }, []);

  const deleteSlot = useCallback(async (id) => {
    // Annule d'abord les réservations en cours (déclenche la notif élève via trigger),
    // puis supprime le créneau (ON DELETE CASCADE nettoiera le reste).
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('slot_id', id).in('status', ['pending', 'confirmed']);
    await supabase.from('availability_slots').delete().eq('id', id);
    setSlots(prev => prev.filter(s => s.id !== id));
  }, []);

  return { slots, loading, createSlot, updateSlot, deleteSlot, reload: load };
}

// ─────────────────────────────────────────
// Professeur — réservations reçues
// ─────────────────────────────────────────
export function useTeacherBookings(userId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase.from('bookings')
      .select(`${BOOKING_FIELDS}, availability_slots(title, session_type, duration_min, max_students, level, meeting_link)`)
      .eq('teacher_id', userId)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true });
    setBookings(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const pending = useMemo(() => bookings.filter(b => b.status === 'pending'), [bookings]);

  const confirmBooking = useCallback(async (id, teacherNote) => {
    const { data, error } = await supabase.from('bookings')
      .update({ status: 'confirmed', teacher_note: teacherNote || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(BOOKING_FIELDS)
      .single();
    if (!error) setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    return { data, error };
  }, []);

  const cancelBooking = useCallback(async (id, teacherNote) => {
    const { data, error } = await supabase.from('bookings')
      .update({ status: 'cancelled', teacher_note: teacherNote || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(BOOKING_FIELDS)
      .single();
    if (!error) setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    return { data, error };
  }, []);

  return { bookings, pending, loading, confirmBooking, cancelBooking, reload: load };
}

// ─────────────────────────────────────────
// Élève — créneaux disponibles chez ses profs
// ─────────────────────────────────────────
export function useStudentSlots(userId) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const { data: memberships } = await supabase.from('class_members')
        .select('classes(teacher_id)')
        .eq('student_id', userId);
      const teacherIds = [...new Set((memberships || []).map(m => m.classes?.teacher_id).filter(Boolean))];
      if (!teacherIds.length) { if (!cancelled) { setSlots([]); setLoading(false); } return; }
      const { data } = await supabase.from('availability_slots')
        .select(SLOT_FIELDS)
        .in('teacher_id', teacherIds)
        .eq('active', true);
      if (!cancelled) { setSlots(data || []); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const getBookingsForSlot = useCallback(async (slotId, date) => {
    const { data } = await supabase.from('bookings')
      .select('id, student_id, status')
      .eq('slot_id', slotId)
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed']);
    return data || [];
  }, []);

  return { slots, loading, getBookingsForSlot };
}

// ─────────────────────────────────────────
// Élève — mes réservations
// ─────────────────────────────────────────
export function useStudentBookings(userId) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase.from('bookings')
      .select(`${BOOKING_FIELDS}, availability_slots(title, session_type, duration_min, max_students, level, meeting_link)`)
      .eq('student_id', userId)
      .order('booking_date', { ascending: true });
    setBookings(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const createBooking = useCallback(async (slotId, date, note) => {
    if (!userId) return { error: 'Non connecté' };
    const { data: slot } = await supabase.from('availability_slots')
      .select('start_time, teacher_id')
      .eq('id', slotId)
      .single();
    if (!slot) return { error: 'Créneau introuvable' };
    const { data, error } = await supabase.from('bookings').insert({
      slot_id: slotId,
      student_id: userId,
      teacher_id: slot.teacher_id,
      booking_date: date,
      start_time: slot.start_time,
      status: 'pending',
      student_note: note || null,
    }).select(BOOKING_FIELDS).single();
    if (error) {
      if (error.code === '23505') return { error: 'Tu as déjà réservé ce créneau à cette date' };
      if (error.message?.includes('complet')) return { error: 'Ce créneau est complet' };
      return { error: error.message };
    }
    setBookings(prev => [...prev, data]);
    return { data };
  }, [userId]);

  const cancelBooking = useCallback(async (id) => {
    const { data, error } = await supabase.from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select(BOOKING_FIELDS)
      .single();
    if (!error) setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    return { data, error };
  }, []);

  return { bookings, loading, createBooking, cancelBooking, reload: load };
}

// ─────────────────────────────────────────
// Notifications in-app (polling 30s)
// ─────────────────────────────────────────
export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase.from('notifications')
      .select(NOTIF_FIELDS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    setNotifications(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [userId, load]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const markAsRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
  }, [userId]);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, reload: load };
}
