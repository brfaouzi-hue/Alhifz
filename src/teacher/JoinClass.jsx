import { useState } from 'react';
import { useJoinClass, useStudentClasses } from './useTeacher.js';

export default function JoinClass({ user, t, acc, onJoined }) {
  const { joinByCode } = useJoinClass(user?.id);
  const { classes, loading } = useStudentClasses(user?.id);
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleJoin() {
    if (code.trim().length !== 6) { setError('Le code doit faire 6 caractères'); return; }
    setJoining(true); setError(''); setSuccess('');
    const { data, error: err } = await joinByCode(code);
    setJoining(false);
    if (err) { setError(err); return; }
    setSuccess('Tu as rejoint : ' + data.name);
    setCode('');
    setTimeout(() => { setSuccess(''); if (onJoined) onJoined(); }, 2000);
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Amiri,serif', fontSize: '1.3rem', color: acc, margin: '0 0 4px' }}>Rejoindre une classe</h2>
        <p style={{ fontSize: '.72rem', color: t.tx3, margin: 0 }}>Entre le code donné par ton enseignant</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase().slice(0, 6)); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleJoin()}
          placeholder="CODE6C"
          maxLength={6}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 14, boxSizing: 'border-box',
            border: '2px solid ' + (error ? '#e91e63' : code.length === 6 ? acc : t.b1),
            background: t.navBg, color: t.tx, fontSize: '1.4rem', fontFamily: 'monospace',
            fontWeight: 700, letterSpacing: 6, textAlign: 'center', textTransform: 'uppercase',
            outline: 'none', transition: 'border .2s'
          }}
        />
        {error && <div style={{ color: '#e91e63', fontSize: '.68rem', marginTop: 6, textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: t.gr, fontSize: '.72rem', marginTop: 6, textAlign: 'center', fontWeight: 700 }}>✓ {success}</div>}
      </div>

      <button onClick={handleJoin} disabled={joining || code.length !== 6} style={{
        width: '100%', padding: '13px 0', borderRadius: 14, border: 'none',
        background: code.length === 6 ? acc : t.b1,
        color: code.length === 6 ? '#fff' : t.tx3,
        cursor: code.length === 6 ? 'pointer' : 'default',
        fontWeight: 700, fontSize: '.85rem', transition: 'all .2s',
        opacity: joining ? 0.7 : 1
      }}>
        {joining ? 'Vérification...' : 'Rejoindre'}
      </button>

      {!loading && classes.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, color: t.tx3, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Mes classes
          </div>
          {classes.map(cls => cls && (
            <div key={cls.id} style={{ padding: '12px 14px', borderRadius: 12, background: t.s1, border: '1px solid ' + t.b1, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: acc + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', flexShrink: 0 }}>🕌</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '.8rem', color: t.tx }}>{cls.name}</div>
                <div style={{ fontSize: '.6rem', color: t.tx3 }}>Code : <span style={{ fontFamily: 'monospace', fontWeight: 700, color: acc }}>{cls.invite_code}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
