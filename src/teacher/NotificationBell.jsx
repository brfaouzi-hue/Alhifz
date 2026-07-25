import { useState, useRef, useEffect } from 'react';
import { useNotifications } from './useSchedule.js';

const TYPE_ICON = {
  booking_request: '📅',
  booking_confirmed: '✓',
  booking_cancelled: '✗',
  session_reminder: '⏰',
  session_full: '🔴',
  session_cancelled: '✗',
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'hier';
  if (d < 7) return `il y a ${d}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

export default function NotificationBell({ userId, t, setPage }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(userId);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('touchstart', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('touchstart', onClickOutside);
    };
  }, [open]);

  const handleNotifClick = (n) => {
    markAsRead(n.id);
    setOpen(false);
    setPage && setPage('schedule');
  };

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(p => !p)} title="Notifications"
        style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid ' + t.b1, background: open ? t.acc + '18' : 'transparent', color: open ? t.acc : t.tx2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 15, height: 15, borderRadius: '50%', background: t.rd, color: '#fff', fontSize: '.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'fixed', top: 56, right: 12, left: 12, maxWidth: 380, marginLeft: 'auto', zIndex: 999, background: t.s1, border: '1px solid ' + t.b1, borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,.2)', maxHeight: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid ' + t.b1, flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '.85rem', color: t.tx }}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: t.acc, fontSize: '.65rem', fontWeight: 700, cursor: 'pointer' }}>
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div style={{ overflowY: 'auto' }}>
            {notifications.length === 0 && (
              <div style={{ padding: '28px 16px', textAlign: 'center', color: t.tx3, fontSize: '.75rem' }}>Aucune notification</div>
            )}
            {notifications.slice(0, 10).map(n => (
              <button key={n.id} onClick={() => handleNotifClick(n)}
                style={{ display: 'flex', gap: 10, width: '100%', padding: '12px 16px', border: 'none', borderBottom: '1px solid ' + t.b1, background: n.read ? 'transparent' : t.acc + '0c', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: '1.1rem', flexShrink: 0, width: 24, textAlign: 'center' }}>{TYPE_ICON[n.type] || '🔔'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '.75rem', color: t.tx }}>{n.title}</div>
                  {n.body && <div style={{ fontSize: '.68rem', color: t.tx3, marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>}
                  <div style={{ fontSize: '.6rem', color: t.tx3, marginTop: 4 }}>{timeAgo(n.created_at)}</div>
                </div>
                {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: t.acc, flexShrink: 0, marginTop: 4 }} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
