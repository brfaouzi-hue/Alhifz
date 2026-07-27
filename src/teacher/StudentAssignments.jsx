import { useStudentAssignments } from './useTeacher.js';

const DAY_MS = 86400000;

function urgency(a) {
  if (a.completed || !a.due_date) return 'none';
  const daysLeft = (new Date(a.due_date).getTime() - Date.now()) / DAY_MS;
  if (daysLeft < 0) return 'overdue';
  if (daysLeft <= 2) return 'soon';
  return 'none';
}

const URGENCY_COLOR = { overdue: '#e91e63', soon: '#fb8c00', none: null };

export default function StudentAssignments({ userId, t, acc, onOpenSurah }) {
  const { assignments, loading } = useStudentAssignments(userId);

  if (loading) return null;
  if (assignments.length === 0) return null;

  const pending = assignments.filter(a => !a.completed);
  const done = assignments.filter(a => a.completed);
  const urgentCount = pending.filter(a => urgency(a) !== 'none').length;
  // Retard puis échéance proche puis le reste (par date d'échéance, sans date en dernier).
  const rank = { overdue: 0, soon: 1, none: 2 };
  const sortedPending = [...pending].sort((x, y) => {
    const r = rank[urgency(x)] - rank[urgency(y)];
    if (r !== 0) return r;
    if (!x.due_date) return 1;
    if (!y.due_date) return -1;
    return new Date(x.due_date) - new Date(y.due_date);
  });
  const sorted = [...sortedPending, ...done];

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ fontSize: '.7rem', fontWeight: 700, color: t.tx3, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        Mes devoirs
        {pending.length > 0 && (
          <span style={{ background: urgentCount > 0 ? '#e91e63' : acc, color: '#fff', borderRadius: 20, padding: '1px 8px', fontSize: '.62rem' }}>{pending.length}</span>
        )}
      </div>
      {sorted.map(a => {
        const u = urgency(a);
        const uColor = URGENCY_COLOR[u];
        return (
          <div key={a.id} onClick={() => onOpenSurah && onOpenSurah(a.surah_n)}
            style={{ padding: '12px 14px', borderRadius: 12, background: t.s1, border: '1px solid ' + (uColor ? uColor + '55' : t.b1), marginBottom: 8, cursor: onOpenSurah ? 'pointer' : 'default', opacity: a.completed ? .75 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: a.completed ? t.gr + '22' : (uColor || acc) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>
                {a.completed ? '✓' : u === 'overdue' ? '⚠️' : u === 'soon' ? '⏰' : '📝'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '.8rem', color: t.tx, marginBottom: 2 }}>{a.title || a.class_name}</div>
                <div style={{ fontSize: '.62rem', color: t.tx3 }}>{a.class_name} · v.{a.verse_from}–{a.verse_to}</div>
                {a.due_date && (
                  <div style={{ fontSize: '.6rem', color: uColor || t.tx3, fontWeight: uColor ? 700 : 400, marginTop: 2 }}>
                    {u === 'overdue' ? 'Expiré le ' : u === 'soon' ? 'Bientôt — ' : 'Échéance : '}{new Date(a.due_date).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '.8rem', color: a.completed ? t.gr : (uColor || acc) }}>{a.done}/{a.total}</div>
              </div>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: t.b1, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: (a.total > 0 ? a.done / a.total * 100 : 0) + '%', background: a.completed ? t.gr : (uColor || acc), borderRadius: 2, transition: 'width .4s' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
