import { useState, useMemo } from 'react';
import { useTeacherSlots, useTeacherBookings } from './useSchedule.js';
import { useTeacherClasses, useProfiles, useClassStudents } from './useTeacher.js';
import { buildICS, downloadICS } from './ics.js';

const DAYS = [
  { label: 'Lun', dow: 1 }, { label: 'Mar', dow: 2 }, { label: 'Mer', dow: 3 },
  { label: 'Jeu', dow: 4 }, { label: 'Ven', dow: 5 }, { label: 'Sam', dow: 6 }, { label: 'Dim', dow: 0 },
];
const HOUR_START = 8;
const HOUR_END = 22;
const STEP_MIN = 30;
const ROW_COUNT = ((HOUR_END - HOUR_START) * 60) / STEP_MIN;
const LEVELS = [['debutant', 'Débutant'], ['intermediaire', 'Intermédiaire'], ['avance', 'Avancé']];
const DURATIONS = [30, 45, 60, 90];
const DEFAULT_FORM = {
  session_type: 'individual', title: '', description: '', level: '',
  max_students: 4, day_of_week: 1, date: '', start_time: '09:00',
  duration_min: 45, recurring: true, class_id: '', price_euros: '', student_id: '',
};

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
  return Math.round(((h - HOUR_START) * 60 + m) / STEP_MIN) + 2; // +2 : ligne d'en-tête
}

function classifyCell(slot, dayBookings) {
  const active = dayBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  if (slot.max_students > 1) {
    const spots = slot.max_students - active.length;
    return spots <= 0
      ? { bg: '#9e9e9e', border: '#757575', label: 'Complet', emoji: '⚫' }
      : { bg: '#8e24aa', border: '#6a1b7a', label: `${active.length}/${slot.max_students} inscrits`, emoji: '🟣' };
  }
  const b = active[0];
  if (!b) return { bg: '#1e88e5', border: '#1565c0', label: 'Disponible', emoji: '🔵' };
  if (b.status === 'pending') return { bg: '#fb8c00', border: '#e65100', label: 'En attente', emoji: '🟠' };
  return { bg: '#43a047', border: '#2e7d32', label: 'Confirmé', emoji: '🟢' };
}

export default function TeacherSchedule({ userId, t, acc }) {
  const { slots, loading: slotsLoading, createSlot, updateSlot, deleteSlot } = useTeacherSlots(userId);
  const { bookings, pending, loading: bookingsLoading, confirmBooking, cancelBooking } = useTeacherBookings(userId);
  const { classes } = useTeacherClasses(userId);
  const studentNames = useProfiles(bookings.map(b => b.student_id));

  const [tab, setTab] = useState('planning');
  const [formModal, setFormModal] = useState(null); // null | {mode:'create'} | {mode:'edit', slot}
  const [form, setForm] = useState(DEFAULT_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [detailCell, setDetailCell] = useState(null); // {slot, date, dayBookings}
  const [actionNoteFor, setActionNoteFor] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [justActioned, setJustActioned] = useState({});
  const { students: classRoster } = useClassStudents(form.class_id || null);
  const rosterNames = useProfiles(classRoster.map(s => s.student_id));
  const slotAssigneeNames = useProfiles(slots.map(s => s.student_id));

  const weekStart = useMemo(() => getMonday(new Date()), []);
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
        const dayBookings = bookings.filter(b => b.slot_id === slot.id && b.booking_date === cellDateStr && b.status !== 'cancelled');
        out.push({ slot, date: cellDateStr, colIdx, dayBookings });
      });
    });
    return out;
  }, [slots, bookings, weekDates]);

  const visiblePending = useMemo(
    () => bookings.filter(b => b.status === 'pending' || justActioned[b.id]),
    [bookings, justActioned]
  );

  const openCreate = () => { setForm(DEFAULT_FORM); setFormError(''); setFormModal({ mode: 'create' }); };
  const openEdit = (slot) => {
    setForm({
      session_type: slot.session_type, title: slot.title || '', description: slot.description || '',
      level: slot.level || '', max_students: slot.max_students, day_of_week: slot.day_of_week ?? 1,
      date: slot.date || '', start_time: (slot.start_time || '09:00:00').slice(0, 5),
      duration_min: slot.duration_min, recurring: slot.recurring, class_id: slot.class_id || '',
      price_euros: slot.price_cents ? String(slot.price_cents / 100) : '', student_id: slot.student_id || '',
    });
    setFormError('');
    setDetailCell(null);
    setFormModal({ mode: 'edit', slot });
  };

  const handleSave = async () => {
    if (form.session_type === 'group' && !form.title.trim()) { setFormError('Le titre est obligatoire pour un cours collectif'); return; }
    if (!form.recurring && !form.date) { setFormError('Choisis une date pour un créneau ponctuel'); return; }
    setSaving(true);
    const payload = {
      session_type: form.session_type,
      title: form.session_type === 'group' ? form.title.trim() : null,
      description: form.description.trim() || null,
      level: form.level || null,
      max_students: form.session_type === 'group' ? Number(form.max_students) || 2 : 1,
      day_of_week: form.recurring ? Number(form.day_of_week) : null,
      date: form.recurring ? null : form.date,
      start_time: form.start_time + ':00',
      duration_min: Number(form.duration_min),
      recurring: form.recurring,
      class_id: form.class_id || null,
      student_id: form.session_type === 'individual' ? (form.student_id || null) : null,
      price_cents: form.price_euros ? Math.round(Number(form.price_euros) * 100) : 0,
    };
    const { error } = formModal.mode === 'edit'
      ? await updateSlot(formModal.slot.id, payload)
      : await createSlot(payload);
    setSaving(false);
    if (error) { setFormError(typeof error === 'string' ? error : error.message || 'Erreur'); return; }
    setFormModal(null);
  };

  const handleCancelSlot = async (slotId) => {
    await deleteSlot(slotId);
    setDetailCell(null);
  };

  const handleAccept = async (booking) => {
    const note = actionNoteFor === booking.id ? actionNote : undefined;
    setActionNoteFor(null); setActionNote('');
    setJustActioned(prev => ({ ...prev, [booking.id]: 'confirmed' }));
    await confirmBooking(booking.id, note);
    setTimeout(() => setJustActioned(prev => { const n = { ...prev }; delete n[booking.id]; return n; }), 1400);
  };
  const handleRefuse = async (booking) => {
    const note = actionNoteFor === booking.id ? actionNote : undefined;
    setActionNoteFor(null); setActionNote('');
    setJustActioned(prev => ({ ...prev, [booking.id]: 'cancelled' }));
    await cancelBooking(booking.id, note);
    setTimeout(() => setJustActioned(prev => { const n = { ...prev }; delete n[booking.id]; return n; }), 1400);
  };

  const loading = slotsLoading || bookingsLoading;

  const exportICS = () => {
    const events = slots.filter(s => s.active !== false).map(s => ({
      uid: `slot-${s.id}`,
      title: s.title || (s.max_students > 1 ? 'Cours collectif Al-Hifz' : 'Cours individuel Al-Hifz'),
      description: s.description || '',
      dateStr: s.recurring ? undefined : s.date,
      recurringDow: s.recurring ? s.day_of_week : undefined,
      startTime: s.start_time,
      durationMin: s.duration_min,
    }));
    downloadICS('mon-planning-al-hifz.ics', buildICS(events));
  };

  return loading ? (
    <div style={{ textAlign: 'center', padding: 40, color: t.tx3 }}>Chargement...</div>
  ) : (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid ' + t.b1, padding: '0 16px' }}>
        {[['planning', 'Planning'], ['demandes', `Demandes${pending.length ? ` (${pending.length})` : ''}`]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '.78rem', fontWeight: 700, color: tab === id ? acc : t.tx3,
            borderBottom: tab === id ? `2px solid ${acc}` : '2px solid transparent',
          }}>{label}</button>
        ))}
        {slots.length > 0 && (
          <button onClick={exportICS} title="Exporter vers Calendrier (iPhone, Google, Outlook...)" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', marginLeft: 8, borderRadius: 10, border: '1px solid ' + t.b1, background: 'transparent', color: t.tx2, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exporter
          </button>
        )}
      </div>

      {tab === 'planning' && (
        <div style={{ padding: 12, overflowX: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '46px repeat(7, minmax(84px, 1fr))',
            gridTemplateRows: `28px repeat(${ROW_COUNT}, 22px)`,
            minWidth: 680, position: 'relative', border: '1px solid ' + t.b1, borderRadius: 10, overflow: 'hidden',
          }}>
            <div style={{ gridColumn: 1, gridRow: 1, background: t.s2 }} />
            {DAYS.map((day, i) => (
              <div key={day.label} style={{
                gridColumn: i + 2, gridRow: 1, background: t.s2, borderLeft: '1px solid ' + t.b1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: '.6rem', fontWeight: 700, color: t.tx2,
              }}>
                {day.label}
                <span style={{ fontSize: '.52rem', color: t.tx3, fontWeight: 400 }}>{new Date(weekDates[i] + 'T00:00:00').getDate()}</span>
              </div>
            ))}
            {Array.from({ length: (HOUR_END - HOUR_START) }, (_, i) => HOUR_START + i).map((h, i) => (
              <div key={h} style={{
                gridColumn: 1, gridRow: `${i * 2 + 2} / span 2`, borderTop: '1px solid ' + t.b1,
                fontSize: '.52rem', color: t.tx3, padding: '2px 3px', background: t.navBg,
              }}>{h}h</div>
            ))}
            {Array.from({ length: ROW_COUNT }, (_, i) => (
              <div key={i} style={{ gridColumn: '2 / -1', gridRow: i + 2, borderTop: '1px solid ' + (t.b1 + '55') }} />
            ))}
            {DAYS.map((_, i) => (
              <div key={i} style={{ gridColumn: i + 2, gridRow: `2 / ${ROW_COUNT + 2}`, borderLeft: '1px solid ' + t.b1 }} />
            ))}

            {cells.map(cell => {
              const style = classifyCell(cell.slot, cell.dayBookings);
              const rowStart = timeToRow(cell.slot.start_time);
              const span = Math.max(1, Math.round(cell.slot.duration_min / STEP_MIN));
              return (
                <button key={cell.slot.id + cell.date} onClick={() => setDetailCell(cell)}
                  style={{
                    gridColumn: cell.colIdx + 2, gridRow: `${rowStart} / span ${span}`,
                    margin: '1px 2px', borderRadius: 6, border: `1px solid ${style.border}`,
                    background: style.bg + 'dd', color: '#fff', cursor: 'pointer', padding: '2px 4px',
                    fontSize: '.55rem', textAlign: 'left', overflow: 'hidden', zIndex: 2, lineHeight: 1.25,
                  }}>
                  <div style={{ fontWeight: 700 }}>{style.emoji} {cell.slot.title || (cell.slot.max_students > 1 ? 'Collectif' : 'Individuel')}</div>
                  <div style={{ opacity: .9 }}>{style.label === 'Disponible' && cell.slot.student_id ? `Pour ${slotAssigneeNames[cell.slot.student_id] || '…'}` : style.label}</div>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10, fontSize: '.6rem', color: t.tx3 }}>
            <span>🔵 Individuel dispo</span><span>🟣 Collectif dispo</span><span>🟠 En attente</span><span>🟢 Confirmé</span><span>⚫ Complet</span>
          </div>
        </div>
      )}

      {tab === 'demandes' && (
        <div style={{ padding: 16 }}>
          {visiblePending.length === 0 && (
            <div style={{ textAlign: 'center', color: t.tx3, padding: 30, fontSize: '.8rem' }}>Aucune demande en attente</div>
          )}
          {visiblePending.map(b => {
            const anim = justActioned[b.id];
            return (
              <div key={b.id} style={{
                padding: '12px 14px', borderRadius: 14, background: t.s1, border: '1px solid ' + t.b1,
                marginBottom: 10, transition: 'opacity .4s, transform .4s',
                opacity: anim ? 0.5 : 1, transform: anim ? 'scale(.98)' : 'scale(1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: acc + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, color: acc, flexShrink: 0 }}>
                    {(studentNames[b.student_id] || b.student_id).slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '.78rem', fontWeight: 700, color: t.tx }}>
                      {studentNames[b.student_id] || '…'}
                    </div>
                    <div style={{ fontSize: '.68rem', color: t.tx2 }}>
                      {b.availability_slots?.title || (b.availability_slots?.session_type === 'group' ? 'Cours collectif' : 'Cours individuel')}
                    </div>
                    <div style={{ fontSize: '.65rem', color: t.tx3 }}>{fmtDateFR(b.booking_date)} · {(b.start_time || '').slice(0, 5)}</div>
                    {b.student_note && <div style={{ fontSize: '.65rem', color: t.tx2, marginTop: 3, fontStyle: 'italic' }}>&quot;{b.student_note}&quot;</div>}
                  </div>
                </div>
                {anim ? (
                  <div style={{ marginTop: 8, fontSize: '.72rem', fontWeight: 700, color: anim === 'confirmed' ? t.gr : t.rd, textAlign: 'center' }}>
                    {anim === 'confirmed' ? '✓ Accepté' : '✗ Refusé'}
                  </div>
                ) : (
                  <>
                    {actionNoteFor === b.id && (
                      <input value={actionNote} onChange={e => setActionNote(e.target.value)} placeholder="Note (optionnel)"
                        style={{ width: '100%', marginTop: 8, padding: '6px 10px', borderRadius: 8, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.7rem', boxSizing: 'border-box' }} />
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => handleAccept(b)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', background: t.gr, color: '#fff', fontWeight: 700, fontSize: '.72rem', cursor: 'pointer' }}>✓ Accepter</button>
                      <button onClick={() => handleRefuse(b)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: '1px solid ' + t.rd, background: 'transparent', color: t.rd, fontWeight: 700, fontSize: '.72rem', cursor: 'pointer' }}>✗ Refuser</button>
                      <button onClick={() => setActionNoteFor(p => p === b.id ? null : b.id)} title="Ajouter une note"
                        style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid ' + t.b1, background: 'transparent', color: t.tx3, fontSize: '.72rem', cursor: 'pointer' }}>✎</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button onClick={openCreate} title="Nouveau créneau" style={{
        position: 'fixed', bottom: 'calc(76px + env(safe-area-inset-bottom))', right: 16, zIndex: 90,
        width: 52, height: 52, borderRadius: '50%', border: 'none', background: acc, color: '#fff',
        fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>+</button>

      {detailCell && (
        <div className="overlay" onClick={() => setDetailCell(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h2 style={{ fontFamily: 'Amiri,serif', color: acc, marginBottom: 4 }}>
              {detailCell.slot.title || (detailCell.slot.max_students > 1 ? 'Cours collectif' : 'Cours individuel')}
            </h2>
            <p style={{ fontSize: '.72rem', color: t.tx3, marginBottom: 14 }}>
              {fmtDateFR(detailCell.date)} · {(detailCell.slot.start_time || '').slice(0, 5)} · {detailCell.slot.duration_min} min
            </p>
            {(() => {
              // recalculé à partir de `bookings` (au lieu du instantané pris à l'ouverture
              // de la modale) pour que la modale reste à jour après un accepter/refuser
              const liveDayBookings = bookings.filter(b => b.slot_id === detailCell.slot.id && b.booking_date === detailCell.date && b.status !== 'cancelled');
              return (
                <>
                  <div style={{ fontSize: '.68rem', color: t.tx3, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                    Élèves inscrits ({liveDayBookings.length})
                  </div>
                  {liveDayBookings.length === 0 && (
                    <div style={{ fontSize: '.75rem', color: t.tx3, marginBottom: 14 }}>Personne inscrit pour l&apos;instant</div>
                  )}
                  {liveDayBookings.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10, background: t.s2, marginBottom: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: acc + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.62rem', fontWeight: 700, color: acc, flexShrink: 0 }}>
                  {(studentNames[b.student_id] || b.student_id).slice(0, 2).toUpperCase()}
                </div>
                <span style={{ flex: 1, fontSize: '.7rem', color: t.tx }}>{studentNames[b.student_id] || '…'}</span>
                {b.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={() => handleAccept(b)} title="Accepter" style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: t.gr, color: '#fff', fontWeight: 700, fontSize: '.7rem', cursor: 'pointer' }}>✓</button>
                    <button onClick={() => handleRefuse(b)} title="Refuser" style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid ' + t.rd, background: 'transparent', color: t.rd, fontWeight: 700, fontSize: '.7rem', cursor: 'pointer' }}>✗</button>
                  </div>
                ) : (
                  <span style={{
                    fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    color: b.status === 'confirmed' ? t.gr : t.tx3,
                    background: (b.status === 'confirmed' ? t.gr : t.tx3) + '18',
                  }}>{b.status === 'confirmed' ? 'Confirmé' : b.status}</span>
                )}
              </div>
                  ))}
                </>
              );
            })()}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="tbtn" style={{ flex: 1 }} onClick={() => openEdit(detailCell.slot)}>Modifier</button>
              <button className="tbtn" style={{ flex: 1, borderColor: t.rd, color: t.rd }} onClick={() => handleCancelSlot(detailCell.slot.id)}>Annuler le créneau</button>
            </div>
            <button className="tbtn" style={{ width: '100%', marginTop: 8, borderColor: t.b2, color: t.tx3 }} onClick={() => setDetailCell(null)}>Fermer</button>
          </div>
        </div>
      )}

      {formModal && (
        <div className="overlay" onClick={() => setFormModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <h2 style={{ fontFamily: 'Amiri,serif', color: acc, marginBottom: 14 }}>
              {formModal.mode === 'edit' ? 'Modifier le créneau' : 'Nouveau créneau'}
            </h2>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[['individual', 'Individuel'], ['group', 'Collectif']].map(([v, l]) => (
                <button key={v} onClick={() => setForm(p => ({ ...p, session_type: v }))} style={{
                  flex: 1, padding: '9px 0', borderRadius: 10, cursor: 'pointer', fontSize: '.75rem', fontWeight: 700,
                  border: `1.5px solid ${form.session_type === v ? acc : t.b2}`,
                  background: form.session_type === v ? acc + '15' : 'transparent',
                  color: form.session_type === v ? acc : t.tx2,
                }}>{l}</button>
              ))}
            </div>

            {form.session_type === 'group' && (
              <>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Titre du cours *</div>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Tajwid débutants"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.78rem', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Description</div>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.75rem', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Niveau</div>
                    <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                      style={{ width: '100%', padding: '9px 8px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.72rem' }}>
                      <option value="">—</option>
                      {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Max élèves</div>
                    <input type="number" min="2" max="50" value={form.max_students} onChange={e => setForm(p => ({ ...p, max_students: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.75rem', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
              <button onClick={() => setForm(p => ({ ...p, recurring: true }))} style={{
                flex: 1, padding: '8px 0', borderRadius: 10, cursor: 'pointer', fontSize: '.7rem', fontWeight: 700,
                border: `1.5px solid ${form.recurring ? acc : t.b2}`, background: form.recurring ? acc + '15' : 'transparent', color: form.recurring ? acc : t.tx2,
              }}>Récurrent (chaque semaine)</button>
              <button onClick={() => setForm(p => ({ ...p, recurring: false }))} style={{
                flex: 1, padding: '8px 0', borderRadius: 10, cursor: 'pointer', fontSize: '.7rem', fontWeight: 700,
                border: `1.5px solid ${!form.recurring ? acc : t.b2}`, background: !form.recurring ? acc + '15' : 'transparent', color: !form.recurring ? acc : t.tx2,
              }}>Ponctuel</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
              {form.recurring ? (
                <div>
                  <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Jour</div>
                  <select value={form.day_of_week} onChange={e => setForm(p => ({ ...p, day_of_week: e.target.value }))}
                    style={{ width: '100%', padding: '9px 4px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.7rem' }}>
                    {DAYS.map(d => <option key={d.dow} value={d.dow}>{d.label}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Date</div>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    style={{ width: '100%', padding: '8px 4px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.68rem', boxSizing: 'border-box' }} />
                </div>
              )}
              <div>
                <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Heure début</div>
                <input type="time" value={form.start_time} onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))}
                  style={{ width: '100%', padding: '8px 4px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.7rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Durée</div>
                <select value={form.duration_min} onChange={e => setForm(p => ({ ...p, duration_min: e.target.value }))}
                  style={{ width: '100%', padding: '9px 4px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.7rem' }}>
                  {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Classe associée</div>
                <select value={form.class_id} onChange={e => setForm(p => ({ ...p, class_id: e.target.value }))}
                  style={{ width: '100%', padding: '9px 6px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.7rem' }}>
                  <option value="">Aucune (tous mes élèves)</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Prix (€, optionnel)</div>
                <input type="number" min="0" step="0.5" value={form.price_euros} onChange={e => setForm(p => ({ ...p, price_euros: e.target.value }))} placeholder="0"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.75rem', boxSizing: 'border-box' }} />
              </div>
            </div>

            {form.session_type === 'individual' && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Élève précis (optionnel)</div>
                {!form.class_id ? (
                  <div style={{ fontSize: '.65rem', color: t.tx3, fontStyle: 'italic', padding: '9px 2px' }}>Choisis une classe ci-dessus pour cibler un élève</div>
                ) : (
                  <select value={form.student_id} onChange={e => setForm(p => ({ ...p, student_id: e.target.value }))}
                    style={{ width: '100%', padding: '9px 6px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.7rem' }}>
                    <option value="">Ouvert à toute la classe</option>
                    {classRoster.map(s => <option key={s.student_id} value={s.student_id}>{rosterNames[s.student_id] || s.student_id.slice(0, 8) + '...'}</option>)}
                  </select>
                )}
                {form.student_id && <div style={{ fontSize: '.6rem', color: acc, marginTop: 4 }}>Ce créneau ne sera visible que par {rosterNames[form.student_id] || 'cet élève'}</div>}
              </div>
            )}

            {formError && <div style={{ color: t.rd, fontSize: '.7rem', marginBottom: 10, textAlign: 'center' }}>{formError}</div>}

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="tbtn" style={{ flex: 1 }} onClick={() => setFormModal(null)}>Annuler</button>
              <button className="mbtn" style={{ flex: 2, opacity: saving ? .7 : 1 }} disabled={saving} onClick={handleSave}>
                {saving ? 'Enregistrement...' : formModal.mode === 'edit' ? 'Enregistrer' : 'Créer le créneau'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
