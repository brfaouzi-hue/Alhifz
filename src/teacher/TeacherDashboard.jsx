import { useState } from 'react';
import { useTeacherClasses, useClassStudents, useAssignments, useProfiles } from './useTeacher.js';

const SURAHS = ["Al-Fatiha","Al-Baqara","Al-Imran","An-Nisa","Al-Maida","Al-Anam","Al-Araf","Al-Anfal","At-Tawba","Yunus","Hud","Yusuf","Ar-Rad","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya","Al-Hajj","Al-Muminun","An-Nur","Al-Furqan","Ash-Shuara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajda","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiya","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqia","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahana","As-Saf","Al-Jumua","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqa","Al-Maarij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Naziat","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-Ala","Al-Ghashiya","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyina","Az-Zalzala","Al-Adiyat","Al-Qaria","At-Takathur","Al-Asr","Al-Humaza","Al-Fil","Quraysh","Al-Maun","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"];

function countMem(mem) {
  if (!mem) return 0;
  let n = 0;
  Object.values(mem).forEach(s => { Object.values(s).forEach(v => { if (v) n++; }); });
  return n;
}

function daysSince(dateStr) {
  if (!dateStr) return 999;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function StudentRow({ student, t, onClick, name }) {
  const prog = student.user_progress;
  const mem = prog?.mem || {};
  const total = countMem(mem);
  const surahs = Object.keys(mem).length;
  const days = daysSince(prog?.updated_at);
  const inactive = days > 7;

  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', borderRadius: 12,
      background: t.s1, border: '1px solid ' + (inactive ? '#ff980033' : t.b1),
      cursor: 'pointer', marginBottom: 8
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: inactive ? '#ff980022' : t.acc + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', flexShrink: 0
      }}>
        {inactive ? '😴' : '📖'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '.8rem', fontWeight: 600, color: t.tx, marginBottom: 2 }}>
          {name || student.student_id.slice(0, 8) + '...'}
        </div>
        <div style={{ fontSize: '.65rem', color: t.tx3 }}>
          {total} versets · {surahs} sourates
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {inactive
          ? <span style={{ fontSize: '.6rem', color: '#ff9800', fontWeight: 700 }}>Inactif {days}j</span>
          : <span style={{ fontSize: '.6rem', color: t.gr }}>Actif il y a {days}j</span>
        }
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.tx3} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  );
}

function ClassPanel({ cls, t, acc, onClose }) {
  const { students, loading } = useClassStudents(cls.id);
  const { assignments, createAssignment, deleteAssignment } = useAssignments(cls.id);
  const studentNames = useProfiles(students.map(s => s.student_id));
  const [tab, setTab] = useState('students');
  const [newAssign, setNewAssign] = useState(false);
  const [form, setForm] = useState({ title: '', surah_n: 1, verse_from: 1, verse_to: 7, due_date: '' });
  const [saving, setSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const inactive = students.filter(s => daysSince(s.user_progress?.updated_at) > 7);

  async function handleCreateAssign() {
    setSaving(true);
    await createAssignment({ ...form, surah_n: Number(form.surah_n), verse_from: Number(form.verse_from), verse_to: Number(form.verse_to), teacher_id: cls.teacher_id });
    setSaving(false);
    setNewAssign(false);
    setForm({ title: '', surah_n: 1, verse_from: 1, verse_to: 7, due_date: '' });
  }

  if (selectedStudent) {
    const prog = selectedStudent.user_progress;
    const mem = prog?.mem || {};
    const total = countMem(mem);
    const memorizedSurahs = Object.entries(mem).filter(([, v]) => Object.values(v).some(Boolean));
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', color: acc, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: '.8rem', fontWeight: 600, padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Retour
        </button>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: t.tx, marginBottom: 4 }}>{studentNames[selectedStudent.student_id] || selectedStudent.student_id.slice(0, 8) + '...'}</div>
          <div style={{ fontSize: '.72rem', color: t.tx3 }}>Rejoint le {new Date(selectedStudent.joined_at).toLocaleDateString('fr-FR')}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Versets mémorisés', value: total, icon: '📖' },
            { label: 'Sourates entamées', value: memorizedSurahs.length, icon: '🕌' },
            { label: 'Dernière activité', value: daysSince(prog?.updated_at) + 'j', icon: '📅' },
            { label: 'Statut', value: daysSince(prog?.updated_at) > 7 ? 'Inactif 😴' : 'Actif ✓', icon: '📊' },
          ].map(stat => (
            <div key={stat.label} style={{ padding: '12px 14px', borderRadius: 12, background: t.s1, border: '1px solid ' + t.b1 }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '.95rem', color: acc }}>{stat.value}</div>
              <div style={{ fontSize: '.58rem', color: t.tx3 }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontWeight: 700, fontSize: '.8rem', color: t.tx, marginBottom: 10 }}>Sourates mémorisées</div>
        {memorizedSurahs.length === 0
          ? <div style={{ fontSize: '.72rem', color: t.tx3, textAlign: 'center', padding: 20 }}>Aucune sourate mémorisée pour l'instant</div>
          : memorizedSurahs.map(([sn]) => {
              const name = SURAHS[Number(sn) - 1] || 'S.' + sn;
              const vMem = Object.values(mem[sn]).filter(Boolean).length;
              const vTotal = Object.values(mem[sn]).length;
              return (
                <div key={sn} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 12px', borderRadius: 10, background: t.s1, border: '1px solid ' + t.b1 }}>
                  <span style={{ fontSize: '.72rem', fontWeight: 600, color: t.tx, flex: 1 }}>{name}</span>
                  <div style={{ width: 80, height: 6, borderRadius: 3, background: t.b1, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (vMem / Math.max(vTotal, 1) * 100) + '%', background: t.gr, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: '.62rem', color: t.tx3, minWidth: 40, textAlign: 'right' }}>{vMem}/{vTotal}</span>
                </div>
              );
            })
        }
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + t.b1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: t.tx2 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '.95rem', color: t.tx }}>{cls.name}</div>
          <div style={{ fontSize: '.6rem', color: t.tx3 }}>Code : <span style={{ fontFamily: 'monospace', fontWeight: 700, color: acc, letterSpacing: 2 }}>{cls.invite_code}</span></div>
        </div>
        {inactive.length > 0 && (
          <div style={{ padding: '3px 10px', borderRadius: 20, background: '#ff980022', color: '#ff9800', fontSize: '.6rem', fontWeight: 700 }}>
            {inactive.length} inactif{inactive.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid ' + t.b1 }}>
        {['students', 'assignments'].map(tab2 => (
          <button key={tab2} onClick={() => setTab(tab2)} style={{
            flex: 1, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '.7rem', fontWeight: 600,
            color: tab === tab2 ? acc : t.tx3,
            borderBottom: tab === tab2 ? '2px solid ' + acc : '2px solid transparent'
          }}>
            {tab2 === 'students' ? 'Élèves (' + students.length + ')' : 'Devoirs (' + assignments.length + ')'}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        {tab === 'students' && (
          loading
            ? <div style={{ textAlign: 'center', color: t.tx3, padding: 30 }}>Chargement...</div>
            : students.length === 0
              ? <div style={{ textAlign: 'center', color: t.tx3, padding: 30, fontSize: '.8rem' }}>
                  Aucun élève pour l'instant.<br />
                  <span style={{ color: acc, fontWeight: 700 }}>Partage le code {cls.invite_code}</span>
                </div>
              : students.map(s => (
                  <StudentRow key={s.student_id} student={s} t={t} name={studentNames[s.student_id]} onClick={() => setSelectedStudent(s)} />
                ))
        )}

        {tab === 'assignments' && (
          <div>
            {assignments.map(a => {
              const done = a.assignment_progress?.filter(p => p.completed).length || 0;
              const total2 = students.length;
              const overdue = a.due_date && new Date(a.due_date) < new Date();
              return (
                <div key={a.id} style={{ padding: '12px 14px', borderRadius: 12, background: t.s1, border: '1px solid ' + (overdue ? '#e91e6333' : t.b1), marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '.8rem', color: t.tx, marginBottom: 2 }}>{a.title || SURAHS[a.surah_n - 1]}</div>
                      <div style={{ fontSize: '.62rem', color: t.tx3 }}>{SURAHS[a.surah_n - 1]} · v.{a.verse_from}–{a.verse_to}</div>
                      {a.due_date && <div style={{ fontSize: '.6rem', color: overdue ? '#e91e63' : t.tx3, marginTop: 2 }}>
                        {overdue ? 'Expiré le ' : 'Échéance : '}{new Date(a.due_date).toLocaleDateString('fr-FR')}
                      </div>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '.85rem', color: done === total2 && total2 > 0 ? t.gr : acc }}>{done}/{total2}</div>
                      <div style={{ fontSize: '.55rem', color: t.tx3 }}>complété</div>
                    </div>
                    <button onClick={() => deleteAssignment(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.tx3, padding: 4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    </button>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: t.b1, marginTop: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (total2 > 0 ? done / total2 * 100 : 0) + '%', background: t.gr, borderRadius: 2, transition: 'width .4s' }} />
                  </div>
                </div>
              );
            })}

            {newAssign ? (
              <div style={{ padding: 16, borderRadius: 14, background: t.s1, border: '1px solid ' + t.b1, marginTop: 8 }}>
                <div style={{ fontWeight: 700, fontSize: '.8rem', color: t.tx, marginBottom: 12 }}>Nouveau devoir</div>
                {[
                  { label: 'Titre (optionnel)', key: 'title', type: 'text', placeholder: 'Ex: Mémoriser Al-Fatiha' },
                  { label: 'Date limite', key: 'due_date', type: 'date', placeholder: '' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>{f.label}</div>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.75rem', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>Sourate</div>
                    <select value={form.surah_n} onChange={e => setForm(p => ({ ...p, surah_n: e.target.value }))}
                      style={{ width: '100%', padding: '8px 6px', borderRadius: 8, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.7rem' }}>
                      {SURAHS.map((s, i) => <option key={i} value={i + 1}>{i + 1}. {s}</option>)}
                    </select>
                  </div>
                  {['verse_from', 'verse_to'].map(k => (
                    <div key={k}>
                      <div style={{ fontSize: '.62rem', color: t.tx3, marginBottom: 4 }}>{k === 'verse_from' ? 'Verset début' : 'Verset fin'}</div>
                      <input type="number" min="1" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.75rem', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setNewAssign(false)} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: '1px solid ' + t.b1, background: 'none', color: t.tx2, cursor: 'pointer', fontSize: '.72rem' }}>Annuler</button>
                  <button onClick={handleCreateAssign} disabled={saving} style={{ flex: 2, padding: '9px 0', borderRadius: 10, border: 'none', background: acc, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '.72rem', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Enregistrement...' : 'Créer le devoir'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setNewAssign(true)} style={{ width: '100%', padding: '10px 0', borderRadius: 12, border: '1px dashed ' + acc, background: acc + '11', color: acc, cursor: 'pointer', fontWeight: 700, fontSize: '.75rem', marginTop: 8 }}>
                + Nouveau devoir
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeacherDashboard({ user, t, acc, setPage }) {
  const { classes, loading, createClass, deleteClass } = useTeacherClasses(user?.id);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    await createClass(newName.trim());
    setNewName('');
    setShowForm(false);
    setCreating(false);
  }

  if (selectedClass) {
    return (
      <div style={{ minHeight: '100%' }}>
        <ClassPanel cls={selectedClass} t={t} acc={acc} onClose={() => setSelectedClass(null)} />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Amiri,serif', fontSize: '1.3rem', color: acc, margin: '0 0 4px' }}>Mes classes</h2>
          <p style={{ fontSize: '.72rem', color: t.tx3, margin: 0 }}>Suis la progression de tes élèves</p>
        </div>
        {setPage && classes.length > 0 && (
          <button onClick={() => setPage('schedule')} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${acc}`, background: `${acc}12`, color: acc, fontWeight: 700, fontSize: '.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Planning
          </button>
        )}
      </div>

      {loading
        ? <div style={{ textAlign: 'center', color: t.tx3, padding: 40 }}>Chargement...</div>
        : classes.length === 0 && !showForm
          ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🕌</div>
              <div style={{ fontWeight: 700, color: t.tx, marginBottom: 6 }}>Aucune classe</div>
              <div style={{ fontSize: '.75rem', color: t.tx3, marginBottom: 20 }}>Crée ta première classe et partage le code à tes élèves</div>
              <button onClick={() => setShowForm(true)} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: acc, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
                + Créer une classe
              </button>
            </div>
          )
          : (
            <>
              {classes.map(cls => {
                const count = cls.class_members?.[0]?.count || 0;
                return (
                  <div key={cls.id} onClick={() => setSelectedClass(cls)} style={{ padding: '14px 16px', borderRadius: 14, background: t.s1, border: '1px solid ' + t.b1, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: acc + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🕌</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '.88rem', color: t.tx, marginBottom: 2 }}>{cls.name}</div>
                      <div style={{ fontSize: '.62rem', color: t.tx3 }}>
                        {count} élève{count > 1 ? 's' : ''} · Code : <span style={{ fontFamily: 'monospace', fontWeight: 700, color: acc, letterSpacing: 1 }}>{cls.invite_code}</span>
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.tx3} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                );
              })}

              {showForm ? (
                <div style={{ padding: 16, borderRadius: 14, background: t.s1, border: '1px solid ' + t.b1, marginTop: 8 }}>
                  <div style={{ fontSize: '.72rem', color: t.tx3, marginBottom: 8 }}>Nom de la classe</div>
                  <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder="Ex: Halaqa du vendredi" maxLength={50}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid ' + t.b1, background: t.navBg, color: t.tx, fontSize: '.8rem', boxSizing: 'border-box', marginBottom: 10 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: '1px solid ' + t.b1, background: 'none', color: t.tx2, cursor: 'pointer', fontSize: '.72rem' }}>Annuler</button>
                    <button onClick={handleCreate} disabled={creating || !newName.trim()} style={{ flex: 2, padding: '9px 0', borderRadius: 10, border: 'none', background: acc, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '.72rem', opacity: creating || !newName.trim() ? 0.6 : 1 }}>
                      {creating ? 'Création...' : 'Créer'}
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowForm(true)} style={{ width: '100%', padding: '10px 0', borderRadius: 12, border: '1px dashed ' + acc, background: acc + '11', color: acc, cursor: 'pointer', fontWeight: 700, fontSize: '.75rem', marginTop: 4 }}>
                  + Nouvelle classe
                </button>
              )}
            </>
          )
      }
    </div>
  );
}
