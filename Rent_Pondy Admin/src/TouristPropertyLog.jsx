import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Tourist Property Log — an activity feed of who engaged with each "Place To Stay".
// Two tables: visitors who opened a stay's detail page, and visitors who tapped
// its "View Contact" button. Each row is one unique visitor (per device).
const TouristPropertyLog = () => {
    const [detail, setDetail] = useState([]);
    const [contact, setContact] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const fetchLog = async () => {
        try {
            setError(null);
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/stay-view-log`);
            setDetail(res.data?.detail || []);
            setContact(res.data?.contact || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching tourist property log');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLog();
    }, []);

    const formatDateTime = (d) => {
        if (!d) return '—';
        const dt = new Date(d);
        return dt.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const term = search.trim().toLowerCase();
    const applyFilter = (rows) => term
        ? rows.filter(r =>
            (r.propertyId || '').toLowerCase().includes(term) ||
            (r.stayName || '').toLowerCase().includes(term) ||
            (r.stayPhoneNumber || '').toLowerCase().includes(term) ||
            (r.viewerPhoneNumber || '').toLowerCase().includes(term))
        : rows;

    const detailRows = applyFilter(detail);
    const contactRows = applyFilter(contact);

    const styles = {
        page: { padding: '20px', background: '#F0F2F5', minHeight: '100vh' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' },
        title: { fontSize: '24px', fontWeight: 700, color: '#1f2937', margin: 0 },
        subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '16px' },
        toolbar: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '18px' },
        search: { flex: '1 1 240px', maxWidth: '340px', padding: '10px 12px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px' },
        refreshBtn: { background: '#8BC34A', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' },
        sectionTitle: { fontSize: '17px', fontWeight: 700, color: '#1f2937', margin: '24px 0 10px', display: 'flex', alignItems: 'center', gap: '10px' },
        countPill: (bg, color) => ({ background: bg, color, borderRadius: '20px', padding: '3px 12px', fontSize: '13px', fontWeight: 700 }),
        tableWrap: { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflowX: 'auto' },
        table: { width: '100%', borderCollapse: 'collapse', minWidth: '760px' },
        th: { background: '#4F4B7E', color: '#fff', fontSize: '13px', fontWeight: 700, textAlign: 'left', padding: '12px 14px', whiteSpace: 'nowrap' },
        td: { padding: '11px 14px', fontSize: '13.5px', color: '#1f2937', borderBottom: '1px solid #f1f3f7', whiteSpace: 'nowrap' },
        propId: { fontWeight: 700, color: '#764ba2' },
        viewer: { fontWeight: 700, color: '#0369a1' },
        guest: { color: '#94a3b8', fontStyle: 'italic' },
        empty: { textAlign: 'center', padding: '34px', color: '#94a3b8' }
    };

    const Table = ({ rows, viewerLabel }) => (
        <div style={styles.tableWrap}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Si.No</th>
                        <th style={styles.th}>Date &amp; Time</th>
                        <th style={styles.th}>Tourist Property ID</th>
                        <th style={styles.th}>Stay Name</th>
                        <th style={styles.th}>Stay Phone Number</th>
                        <th style={styles.th}>{viewerLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td style={styles.empty} colSpan={6}>Loading…</td></tr>
                    ) : rows.length === 0 ? (
                        <tr><td style={styles.empty} colSpan={6}>No activity yet.</td></tr>
                    ) : (
                        rows.map((r, i) => (
                            <tr key={r._id || i}>
                                <td style={styles.td}>{i + 1}</td>
                                <td style={styles.td}>{formatDateTime(r.viewedAt)}</td>
                                <td style={{ ...styles.td, ...styles.propId }}>{r.propertyId || '—'}</td>
                                <td style={styles.td}>{r.stayName || '—'}</td>
                                <td style={styles.td}>{r.stayPhoneNumber || '—'}</td>
                                <td style={styles.td}>
                                    {r.viewerPhoneNumber
                                        ? <span style={styles.viewer}>{r.viewerPhoneNumber}</span>
                                        : <span style={styles.guest}>Guest</span>}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>📋 Tourist Property Log</h1>
            </div>
            <p style={styles.subtitle}>
                Activity feed of who engaged with each Place To Stay listing — a new row appears every time a visitor opens a stay's detail page or taps its View Contact button.
            </p>

            <div style={styles.toolbar}>
                <input
                    style={styles.search}
                    type="text"
                    placeholder="Search by property id, stay name, stay phone or viewer…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button style={styles.refreshBtn} onClick={fetchLog} disabled={loading}>
                    {loading ? 'Loading…' : '↻ Refresh'}
                </button>
            </div>

            {error && <div style={{ color: '#b91c1c', marginBottom: '12px' }}>❌ {error}</div>}

            {/* Detail page viewers */}
            <div style={styles.sectionTitle}>
                👁️ Detail Page Viewers
                <span style={styles.countPill('#eef2ff', '#4338ca')}>{detailRows.length}</span>
            </div>
            <Table rows={detailRows} viewerLabel="Detail Page Viewer" />

            {/* Contact viewers */}
            <div style={styles.sectionTitle}>
                📞 Contact Viewers
                <span style={styles.countPill('#eafaf0', '#15803d')}>{contactRows.length}</span>
            </div>
            <Table rows={contactRows} viewerLabel="Contact Viewer" />
        </div>
    );
};

export default TouristPropertyLog;
