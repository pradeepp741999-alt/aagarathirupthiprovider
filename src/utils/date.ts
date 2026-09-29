export function nextDays(count: number, startOffset = 0) {
  const days: Date[] = [];
  const base = new Date();
  for (let i = startOffset; i < startOffset + count; i += 1) {
    const dt = new Date(base);
    dt.setDate(base.getDate() + i);
    days.push(dt);
  }
  return days;
}

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(isoOrDate: string | Date) {
  const dt = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export function formatLongDate(isoOrDate: string | Date) {
  if (!isoOrDate) return 'Not set';
  const dt = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(dt.getTime())) return 'Not set';
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function formatDateTime(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return '';
  return `${formatShortDate(dt)} · ${dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
}

export function weekdayLabel(date: Date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}

export function timeAgo(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return '';
  const diffMs = Date.now() - dt.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatShortDate(dt);
}
