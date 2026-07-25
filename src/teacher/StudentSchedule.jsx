import { useState, useMemo, useEffect } from 'react';
import { useStudentSlots, useStudentBookings } from './useSchedule.js';
import { buildICS, downloadICS } from './ics.js';

const DAYS = [
  { label: 'Lun', dow: 1 }, { label: 'Mar', dow: 2 }, { label: 'Mer', dow: 3 },
  { label: 'Jeu', dow: 4 }, { label: 'Ven', dow: 5 }, { label: 'Sam', dow: 6 }, { label: 'Dim', dow: 0 },
];
const HOUR_START = 8;
const HOUR_END = 22;
const STEP_MIN = 30;
const ROW_COUNT = ((HOUR_END - HOUR_START) * 60) / STEP_MIN;
const LEVEL_LABELS = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function fmtDateISO(d) { return d.toISOString().slice(0, 10); }
function fmtDateFR(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}
function timeToRow(time) {
  const [h, m] = (time || '08:00').split(':').map(Number);
  return Math.round(((h - HOUR_START) * 60 + m) / STEP_MIN) + 2;
}
function hoursUntil(dateStr, timeStr) {
  const dt = new Date(`${dateStr}T${(timeStr || '00:00:00').slice(0, 8)}`);
  return (dt.getTime() - Date.now()) / 3600000;
}

export default function StudentSchedule({ userId, t, acc }) {
  const { slots, loading: slotsLoading, getBookingsForSlot } = useStudentSlots(userId);
  const { bookings, loading: bookingsLoading, createBooking, cancelBooking } = useStudentBookings(userId);

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(() => (new Date().getDay() + 6) % 7); // 0=Lun ... 6=Dim
  const [occupancy, setOccupancy] = useState({});
  const [bookModal, setBookModal] = useState(null); // {slot, date}
  const [note, setNote] = useState('');
  const [booking, setBookingBusy] = useState(false);
  const [bookError, setBookError] = useState('');

  const weekStart = useMemo(() => {
    const base = getMonday(new Date());
    base.setDate(base.getDate() + weekOffset * 7);
    return base;
  }, [weekOffset]);
  const weekDates = useMemo(() => DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return fmtDateISO(d);
  }), [weekStart]);

  const cells = useMemo(() => {
    const out = [];
    DAYS.forEach((day, colIdx) => {
      const cellDateStr = weekDates[colIdx];
      slots.forEach(slot => {
        const matchesRecurring = slot.recurring && slot.day_of_week === day.dow;
        const matchesPunctual = !slot.recurring && slot.date === cellDateStr;
        if (!matchesRecurring && !matchesPunctual) return;
        out.push({ slot, date: cellDateStr, colIdx });
      });
    });
    return out;
  }, [slots, weekDates]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(cells.map(async cell => {
        const key = `${cell.slot.id}_${cell.date}`;
        const list = await getBookingsForSlot(cell.slot.id, cell.date);
        return [key, list];
      }));
      if (!cancelled) setOccupancy(Object.fromEntries(entries));
    })();
    return () => { cancelled = true; };
  }, [cells, getBookingsForSlot]);

  const myBookingFor = (slotId, date) => bookings.find(b => b.slot_id === slotId && b.booking_date === date && b.status !== 'cancelled');

  const classifyCell = (cell) => {
    const mine = myBookingFor(cell.slot.id, cell.date);
    if (mine) {
      return mine.status === 'pending'
        ? { bg: '#fb8c00', border: '#e65100', label: 'En attente', emoji: '🟠' }
        : { bg: '#43a047', border: '#2e7d32', label: 'Confirmé', emoji: '🟢' };
    }
    const key = `${cell.slot.id}_${cell.date}`;
    const occ = (occupancy[key] || []).length;
    if (cell.slot.max_students > 1) {
      const spots = cell.slot.max_students - occ;
      return spots <= 0
        ? { bg: '#9e9e9e', border: '#757575', label: 'Complet', emoji: '⚫' }
        : { bg: '#8e24aa', border: '#6a1b7a', label: `${spots} place${spots > 1 ? 's' : ''} restante${spots > 1 ? 's' : ''}`, emoji: '🟣' };
    }
    return occ > 0
      ? { bg: '#9e9e9e', border: '#757575', label: 'Indisponible', emoji: '⚫' }
      : { bg: '#1e88e5', border: '#1565c0', label: 'Disponible', emoji: '🔵' };
  };

  const openBooking = (cell) => {
    const cls = classifyCell(cell);
    if (cls.emoji === '⚫' && !myBookingFor(cell.slot.id, cell.date)) return; // complet / indisponible
    if (myBookingFor(cell.slot.id, cell.date)) return; // déjà réservé
    setNote(''); setBookError('');
    setBookModal(cell);
  };

  const confirmBooking = async () => {
    if (!bookModal) return;
    setBookingBusy(true);
    const { error } = await createBooking(bookModal.slot.id, bookModal.date, note.trim() || undefined);
    setBookingBusy(false);
    if (error) { setBookError(error); return; }
    setBookModal(null);
  };

  const upcoming = useMemo(() => {
    const todayStr = fmtDateISO(new Date());
    return bookings
      .filter(b => b.status !== 'cancelled' && b.booking_date >= todayStr)
      .sort((a, b) => (a.booking_date + a.start_time).localeCompare(b.booking_date + b.start_time));
  }, [bookings]);

  const loading = slotsLoading || bookingsLoading;
  const modalKey = bookModal ? `${bookModal.slot.id}_${bookModal.date}` : null;
  const modalOccCount = modalKey ? (occupancy[modalKey] || []).length : 0;

  const exportICS = () => {
    const events = upcoming.filter(b => b.status === 'confirmed').map(b => ({
      uid: `booking-${b.id}`,
      title: b.availability_slots?.title || 'Cours de Coran',
      description: 'Cours Al-Hifz' + (b.teacher_note ? ' — ' + b.teacher_note : ''),
      location: b.availability_slots?.meeting_link || '',
      dateStr: b.booking_date,
      startTime: b.start_time,
      durationMin: b.availability_slots?.duration_min || 45,
    }));
    downloadICS('mon-planning-al-hifz.ics', buildICS(events));
  };

  return loading ? (
    <div style={{ textAlign: 'center', padding: 40, color: t.tx3 }}>Chargement...</div>
  ) : (
    <div style={{ padding: '0 0 20px' }}>
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ fontFamily: 'Amiri,serif', fontSize: '1.15rem', color: acc, margin: 0 }}>Planning de mes cours</h2>
          {upcoming.some(b => b.status === 'confirmed') && (
            <button onClick={exportICS} title="Exporter vers Calendrier (iPhone, Google, Outlook...)" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 10, border: '1px solid ' + t.b1, background: 'transparent', color: t.tx2, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exporter
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setWeekOffset(p => p - 1)} style={{ background: 'none', border: '1px solid ' + t.b1, borderRadius: 10, padding: '6px 12px', color: t.tx2, cursor: 'pointer' }}>←</button>
          <span style={{ fontSize: '.75rem', color: t.tx2, fontWeight: 600 }}>
            {weekOffset === 0 ? 'Cette semaine' : fmtDateFR(weekDates[0]) + ' → ' + fmtDateFR(weekDates[6])}
          </span>
          <button onClick={() => setWeekOffset(p => p + 1)} style={{ background: 'none', border: '1px solid ' + t.b1, borderRadius: 10, padding: '6px 12px', color: t.tx2, cursor: 'pointer' }}>→</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '4px 16px 14px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {DAYS.map((day, i) => {
          const dateStr = weekDates[i];
          const dayCells = cells.filter(c => c.colIdx === i);
          const isToday = fmtDateISO(new Date()) === dateStr;
          const sel = selectedDay === i;
          return (
            <button key={day.label} onClick={() => setSelectedDay(i)} style={{
              flex: '1 0 auto', minWidth: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '8px 4px', borderRadius: 12, cursor: 'pointer', position: 'relative',
              border: '1.5px solid ' + (sel ? acc : t.b1), background: sel ? acc : t.s1,
            }}>
              <span style={{ fontSize: '.6rem', fontWeight: 700, color: sel ? '#fff' : t.tx2 }}>{day.label}</span>
              <span style={{ fontSize: '.82rem', fontWeight: 800, color: sel ? '#fff' : (isToday ? acc : t.tx) }}>{new Date(dateStr + 'T00:00:00').getDate()}</span>
              {dayCells.length > 0 && <div style={{ width: 4, height: 4, borderRadius: '50%', background: sel ? '#fff' : acc, position: 'absolute', bottom: 5 }} />}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '0 16px' }}>
        {(() => {
          const dayCells = cells.filter(c => c.colIdx === selectedDay).sort((a, b) => a.slot.start_time.localeCompare(b.slot.start_time));
          if (dayCells.length === 0) {
            return <div style={{ textAlign: 'center', color: t.tx3, padding: '30px 10px', fontSize: '.78rem', background: t.s1, borderRadius: 14, border: '1px solid ' + t.b1 }}>Aucun créneau ce jour-là</div>;
          }
          return dayCells.map(cell => {
            const style = classifyCell(cell);
            const disabled = style.emoji === '⚫' && !myBookingFor(cell.slot.id, cell.date);
            const already = myBookingFor(cell.slot.id, cell.date);
            return (
              <button key={cell.slot.id + cell.date} onClick={() => openBooking(cell)} disabled={disabled || !!already}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                  padding: '12px 14px', borderRadius: 14, marginBottom: 8, border: '1px solid ' + t.b1,
                  background: t.s1, cursor: (disabled || already) ? 'default' : 'pointer',
                }}>
                <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: style.bg, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.8rem', fontWeight: 700, color: t.tx }}>{(cell.slot.start_time || '').slice(0, 5)} · {cell.slot.title || (cell.slot.max_students > 1 ? 'Cours collectif' : 'Cours individuel')}</div>
                  <div style={{ fontSize: '.66rem', color: t.tx3, marginTop: 2 }}>{cell.slot.duration_min} min{cell.slot.level && ` · ${LEVEL_LABELS[cell.slot.level] || cell.slot.level}`}</div>
                </div>
                <span style={{ fontSize: '.6rem', fontWeight: 700, color: style.bg, background: style.bg + '18', padding: '4px 9px', borderRadius: 20, flexShrink: 0, whiteSpace: 'nowrap' }}>{style.emoji} {style.label}</span>
              </button>
            );
          });
        })()}
      </div>

      <div style={{ padding: '8px 16px' }}>
        <div style={{ fontSize: '.68rem', color: t.tx3, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, fontWeight: 700 }}>
          Mes prochains cours
        </div>
        {upcoming.length === 0 && (
          <div style={{ textAlign: 'center', color: t.tx3, padding: 20, fontSize: '.78rem' }}>Aucun cours à venir</div>
        )}
        {upcoming.map(b => {
          const canCancel = hoursUntil(b.booking_date, b.start_time) > 24;
          const canJoin = b.status === 'confirmed' && b.availability_slots?.meeting_link;
          return (
            <div key={b.id} style={{ padding: '10px 12px', borderRadius: 12, background: t.s1, border: '1px solid ' + t.b1, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: b.status === 'confirmed' ? t.gr : '#fb8c00',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.75rem', fontWeight: 700, color: t.tx }}>
                    {b.availability_slots?.title || (b.availability_slots?.session_type === 'group' ? 'Cours collectif' : 'Cours individuel')}
                  </div>
                  <div style={{ fontSize: '.64rem', color: t.tx3 }}>{fmtDateFR(b.booking_date)} · {(b.start_time || '').slice(0, 5)}</div>
                </div>
                <span style={{ fontSize: '.6rem', fontWeight: 700, color: b.status === 'confirmed' ? t.gr : '#fb8c00' }}>
                  {b.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                </span>
                {canCancel && (
                  <button onClick={() => cancelBooking(b.id)} style={{ background: 'none', border: '1px solid ' + t.rd, color: t.rd, borderRadius: 20, padding: '4px 10px', fontSize: '.62rem', fontWeight: 700, cursor: 'pointer' }}>
                    Annuler
                  </button>
                )}
              </div>
              {canJoin && (
                <a href={b.availability_slots.meeting_link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8, padding: '8px 0', borderRadius: 10, background: acc + '12', border: '1px solid ' + acc + '40', color: acc, fontSize: '.68rem', fontWeight: 700, textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.55-2.27A1 1 0 0 1 21 8.6v6.8a1 1 0 0 1-1.45.9L15 14"/><rect x="1" y="6" width="14" height="12" rx="2"/></svg>
                  Rejoindre le cours
                </a>
              )}
            </div>
          );
        })}
      </div>

      {bookModal && (
        <div className="overlay" onClick={() => setBookModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h2 style={{ fontFamily: 'Amiri,serif', color: acc, marginBottom: 4 }}>
              {bookModal.slot.title || (bookModal.slot.max_students > 1 ? 'Cours collectif' : 'Cours individuel')}
            </h2>
            <p style={{ fontSize: '.72rem', color: t.tx3, marginBottom: 14 }}>
              {fmtDateFR(bookModal.date)} · {(bookModal.slot.start_time || '').slice(0, 5)} · {bookModal.slot.duration_min} min
              {bookModal.slot.level && <> · {LEVEL_LABELS[bookModal.slot.level] || bookModal.slot.level}</>}
            </p>
            {bookModal.slot.max_students > 1 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 6 }}>
                  {modalOccCount} participant{modalOccCount > 1 ? 's' : ''} déjà inscrit{modalOccCount > 1 ? 's' : ''}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: modalOccCount }, (_, i) => (
                    <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: t.b1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem' }}>👤</div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Note pour le prof (optionnel)</div>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Ex: je débute la sourate Al-Baqara"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.75rem', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>
            {bookError && <div style={{ color: t.rd, fontSize: '.7rem', marginBottom: 10, textAlign: 'center' }}>{bookError}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="tbtn" style={{ flex: 1 }} onClick={() => setBookModal(null)}>Annuler</button>
              <button className="mbtn" style={{ flex: 2, opacity: booking ? .7 : 1 }} disabled={booking} onClick={confirmBooking}>
                {booking ? 'Réservation...' : 'Confirmer la réservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
