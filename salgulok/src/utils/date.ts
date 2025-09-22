export const parseKst = (s?: string) => {
  if (!s) return null;
  
  // ISO 형식이 아닌 경우 변환
  let isoString = s;
  if (!s.includes('T')) {
    isoString = s.replace(' ', 'T');
  }
  
  // 시간대 정보가 없는 경우 UTC로 간주하고 한국 시간으로 변환
  if (!isoString.includes('Z') && !isoString.includes('+') && !isoString.includes('-', 10)) {
    // 시간대 정보가 없으면 UTC로 간주하고 한국 시간으로 변환
    const utcDate = new Date(isoString + 'Z');
    if (!isNaN(+utcDate)) {
      // UTC 시간을 한국 시간으로 변환 (UTC+9)
      const kstTime = utcDate.getTime() + (9 * 60 * 60 * 1000);
      // 한국 시간대 정보를 포함한 ISO 문자열로 변환
      const kstDate = new Date(kstTime);
      const year = kstDate.getUTCFullYear();
      const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(kstDate.getUTCDate()).padStart(2, '0');
      const hour = String(kstDate.getUTCHours()).padStart(2, '0');
      const minute = String(kstDate.getUTCMinutes()).padStart(2, '0');
      const second = String(kstDate.getUTCSeconds()).padStart(2, '0');
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`);
    }
  }
  
  // 이미 시간대 정보가 있는 경우 그대로 파싱
  const d = new Date(isoString);
  return isNaN(+d) ? null : d;
};

export const formatKst = (s?: string) => {
  const d = parseKst(s);
  if (!d) return '-';
  
  // 한국 시간으로 직접 포맷팅
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, '0');
  
  const ampm = hour >= 12 ? '오후' : '오전';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  
  return `${year}. ${month}. ${day}. ${ampm} ${String(displayHour).padStart(2, '0')}:${minute}`;
};
