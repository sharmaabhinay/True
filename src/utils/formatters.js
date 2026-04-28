export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const fmtTime = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-IN', { dateStyle:'short', timeStyle:'short' }); }
  catch { return '—'; }
};

export const getDeviceIcon = (ua='') => {
  const u = ua.toLowerCase();
  if (/mobile|android|iphone/.test(u)) return '📱';
  if (/tablet|ipad/.test(u)) return '📲';
  return '💻';
};

export const getBrowser = (ua='') => {
  const u = ua.toLowerCase();
  if (u.includes('chrome') && !u.includes('edg')) return 'Chrome';
  if (u.includes('firefox')) return 'Firefox';
  if (u.includes('safari') && !u.includes('chrome')) return 'Safari';
  if (u.includes('edg')) return 'Edge';
  return 'Browser';
};

export const calcEMIValues = (principal, months, ratePercent) => {
  const P = principal, N = months, R = ratePercent / 100 / 12;
  const emi = R === 0 ? P/N : P * R * Math.pow(1+R,N) / (Math.pow(1+R,N)-1);
  const total = emi * N;
  const interest = total - P;
  return {
    monthly:  Math.round(emi),
    total:    Math.round(total),
    interest: Math.round(interest),
    saving:   Math.round(Math.min(interest * 0.3, 5000)),
  };
};

export const stars = (n) => '★'.repeat(Math.floor(n)) + '☆'.repeat(5 - Math.floor(n));
