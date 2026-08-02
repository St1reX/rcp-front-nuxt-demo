export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateStr));
