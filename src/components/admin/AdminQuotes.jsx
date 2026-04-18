import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectVisitors } from '../../store/slices/visitorSlice';
import { showAdminToast } from '../../store/slices/adminSlice';
import { fmtTime } from '../../utils/formatters';

export default function AdminQuotes() {
  const dispatch = useDispatch();
  const visitors = useSelector(selectVisitors);
  const quotes   = [...visitors.filter(v => v.type === 'quote')].reverse();

  const exportCSV = () => {
    if (!quotes.length) { dispatch(showAdminToast({ msg:'No quotes to export.' })); return; }
    const rows = [
      'Time,Name,Phone,Location,Category,Message',
      ...quotes.map(q => `${q.time},${q.name||''},${q.phone||''},${q.loc||''},${q.cat||''},"${(q.msg||'').replace(/"/g,'""')}"`)
    ];
    const blob = new Blob([rows.join('\n')], { type:'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tf_quotes.csv';
    a.click();
    dispatch(showAdminToast({ msg:'📥 Exported tf_quotes.csv' }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-admin-text text-base font-semibold">Quote Requests</h2>
        <button onClick={exportCSV}
                className="bg-gold text-deep text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer border-none hover:opacity-85 font-dm">
          Export CSV
        </button>
      </div>

      <div className="bg-admin-card border border-admin-border rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>{['Time','Name','Phone','Location','Category','Message','Action'].map(h=>(
                <th key={h} className="text-left text-admin-muted text-[0.65rem] uppercase tracking-wider pb-4 pr-4 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {quotes.length === 0
                ? <tr><td colSpan={7} className="text-center text-admin-muted py-12 text-sm">No quote requests yet.</td></tr>
                : quotes.map((q, i) => (
                  <tr key={i} className="border-t border-admin-border/40 hover:bg-white/[0.018]">
                    <td className="py-3 pr-4 text-[0.68rem] text-admin-muted whitespace-nowrap">{fmtTime(q.time)}</td>
                    <td className="py-3 pr-4 text-sm font-medium text-admin-text">{q.name||'—'}</td>
                    <td className="py-3 pr-4">
                      <a href={`tel:${q.phone}`} className="text-gold text-sm hover:underline">{q.phone||'—'}</a>
                    </td>
                    <td className="py-3 pr-4 text-sm text-admin-text">{q.loc||'—'}</td>
                    <td className="py-3 pr-4 text-sm text-admin-text">{q.cat||'—'}</td>
                    <td className="py-3 pr-4 text-[0.7rem] text-admin-muted max-w-[140px] truncate">{q.msg||'—'}</td>
                    <td className="py-3">
                      <a href={`tel:${q.phone}`}
                         className="bg-gold text-deep text-[0.7rem] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap hover:opacity-85 no-underline">
                        Call
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
