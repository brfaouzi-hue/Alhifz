// Génération de fichiers .ics (iCalendar) pour exporter le planning
// vers Calendrier iPhone/Google/Outlook — pas de dépendance externe.

const DOW_ICS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const pad = n => String(n).padStart(2, '0');

function nextDateForDow(dow) {
  const now = new Date();
  const diff = (dow - now.getDay() + 7) % 7;
  const d = new Date(now);
  d.setDate(now.getDate() + diff);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function escapeICS(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function toICSDateTime(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-');
  const [hh, mm] = (timeStr || '00:00').split(':');
  return `${y}${m}${d}T${pad(Number(hh))}${pad(Number(mm))}00`;
}

// events: [{uid, title, description, dateStr?, startTime, durationMin, recurringDow?}]
// Fournir soit dateStr (événement ponctuel) soit recurringDow 0-6 (récurrent chaque semaine).
export function buildICS(events) {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Al-Hifz//Planning//FR', 'CALSCALE:GREGORIAN'];
  events.forEach(ev => {
    const dateStr = ev.dateStr || nextDateForDow(ev.recurringDow);
    const startTime = (ev.startTime || '09:00:00').slice(0, 5);
    const dtStart = toICSDateTime(dateStr, startTime);
    const endDate = new Date(`${dateStr}T${startTime}:00`);
    endDate.setMinutes(endDate.getMinutes() + (ev.durationMin || 45));
    const dtEnd = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${ev.uid}@al-hifz.app`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    if (ev.recurringDow != null) lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${DOW_ICS[ev.recurringDow]}`);
    lines.push(`SUMMARY:${escapeICS(ev.title)}`);
    if (ev.description) lines.push(`DESCRIPTION:${escapeICS(ev.description)}`);
    if (ev.location) lines.push(`LOCATION:${escapeICS(ev.location)}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(filename, content) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
