export const parseKst = (s?: string) => {
  if (!s) return null;
  const iso = s.includes('T') ? s : s.replace(' ', 'T'); // "YYYY-MM-DD HH:mm:ss" -> ISO
  const d = new Date(iso);
  return isNaN(+d) ? null : d;
};

export const formatKst = (s?: string) => {
  const d = parseKst(s);
  return d
    ? d.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit',
                                  hour: '2-digit', minute: '2-digit' })
    : '-';
};
