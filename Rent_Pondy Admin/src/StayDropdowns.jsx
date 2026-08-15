import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Built-in defaults (mirror the Place To Stay form) shown alongside custom options
const DEFAULTS = {
    stayType: [
        "Guest House", "Resort", "Homestay", "Hotel", "Villa",
        "Cottage", "Service Apartment", "Beach House", "Farm Stay", "Boutique Stay"
    ],
    mealPlan: ["Room Only", "Breakfast Included", "Breakfast + Dinner", "All Meals Included"],
    roomType: [
        "Standard Room", "Deluxe Room", "Super Deluxe", "AC Room", "Non-AC Room",
        "Suite", "Family Room", "Dormitory", "Cottage", "Tent"
    ],
    totalRooms: ["1 – 50 (built-in)"],
    cancellationPolicy: ["Free Cancellation", "Partial Refund", "Non-Refundable"]
};

// Display config for each managed category
const CATEGORIES = [
    { key: 'stayType', label: 'Stay Type', icon: '🏠', numeric: false, placeholder: 'e.g., Tree House' },
    { key: 'mealPlan', label: 'Meal Plan', icon: '🍽️', numeric: false, placeholder: 'e.g., Lunch Included' },
    { key: 'roomType', label: 'Room Types Available', icon: '🛏️', numeric: false, placeholder: 'e.g., Penthouse' },
    { key: 'totalRooms', label: 'Total Rooms', icon: '🔢', numeric: true, placeholder: 'e.g., 60' },
    { key: 'cancellationPolicy', label: 'Cancellation Policy', icon: '📋', numeric: false, placeholder: 'e.g., 50% Refund' }
];

const StayDropdowns = () => {
    const reduxAdminName = useSelector((state) => state.admin.name);
    const adminName = reduxAdminName || localStorage.getItem("adminName") || "Admin";

    // Custom options grouped by category: { stayType: [{_id, value}], ... }
    const [options, setOptions] = useState({});
    const [inputs, setInputs] = useState({});
    const [saving, setSaving] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOptions = async () => {
        try {
            setError(null);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/stay-dropdowns`);
            setOptions(res.data?.data || {});
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching dropdown options');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const handleInputChange = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const handleAdd = async (cat) => {
        const value = (inputs[cat.key] || '').trim();
        if (!value) return;
        if (cat.numeric && !/^[0-9]+$/.test(value)) {
            alert('Please enter a number for Total Rooms.');
            return;
        }
        setSaving(prev => ({ ...prev, [cat.key]: true }));
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/stay-dropdowns`, {
                category: cat.key,
                value,
                createdBy: adminName
            });
            const added = res.data?.data;
            setOptions(prev => ({
                ...prev,
                [cat.key]: [...(prev[cat.key] || []), { _id: added._id, value: added.value }]
            }));
            setInputs(prev => ({ ...prev, [cat.key]: '' }));
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding option');
        } finally {
            setSaving(prev => ({ ...prev, [cat.key]: false }));
        }
    };

    const handleDelete = async (key, id) => {
        if (!window.confirm('Remove this option? Existing listings already using it are not affected.')) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/stay-dropdowns/${id}`);
            setOptions(prev => ({
                ...prev,
                [key]: (prev[key] || []).filter(o => o._id !== id)
            }));
        } catch (err) {
            alert(err.response?.data?.message || 'Error removing option');
        }
    };

    const styles = {
        page: { padding: '20px', background: '#F0F2F5', minHeight: '100vh' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' },
        title: { fontSize: '24px', fontWeight: 700, color: '#1f2937', margin: 0 },
        subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '18px' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '16px' },
        card: { background: '#fff', borderRadius: '12px', padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
        cardTitle: { fontSize: '16px', fontWeight: 700, color: '#0369a1', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' },
        sectionLabel: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8', fontWeight: 600, margin: '10px 0 6px' },
        chipWrap: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
        defaultChip: { background: '#eef2f7', color: '#475569', borderRadius: '20px', padding: '5px 12px', fontSize: '13px', border: '1px solid #e2e8f0' },
        customChip: { background: '#eef6dd', color: '#2f3a1f', borderRadius: '20px', padding: '5px 8px 5px 12px', fontSize: '13px', border: '1px solid #8BC34A', display: 'flex', alignItems: 'center', gap: '6px' },
        removeBtn: { background: 'transparent', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: 0 },
        addRow: { display: 'flex', gap: '8px', marginTop: '12px' },
        input: { flex: 1, padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px' },
        addBtn: { background: '#8BC34A', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 16px', fontWeight: 600, cursor: 'pointer' },
        empty: { color: '#94a3b8', fontSize: '13px' }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>🧩 Dropdown Change — Place To Stay</h1>
            </div>
            <p style={styles.subtitle}>
                Add or remove options for the Add / Edit Stay form. Custom options appear alongside the built-in defaults.
            </p>

            {error && <div style={{ color: '#b91c1c', marginBottom: '12px' }}>❌ {error}</div>}
            {loading ? (
                <p>Loading…</p>
            ) : (
                <div style={styles.grid}>
                    {CATEGORIES.map(cat => {
                        const custom = options[cat.key] || [];
                        return (
                            <div key={cat.key} style={styles.card}>
                                <h3 style={styles.cardTitle}>{cat.icon} {cat.label}</h3>

                                <div style={styles.sectionLabel}>Built-in defaults</div>
                                <div style={styles.chipWrap}>
                                    {DEFAULTS[cat.key].map(d => (
                                        <span key={d} style={styles.defaultChip}>{d}</span>
                                    ))}
                                </div>

                                <div style={styles.sectionLabel}>Custom options</div>
                                <div style={styles.chipWrap}>
                                    {custom.length === 0 ? (
                                        <span style={styles.empty}>None added yet</span>
                                    ) : (
                                        custom.map(o => (
                                            <span key={o._id} style={styles.customChip}>
                                                {o.value}
                                                <button
                                                    style={styles.removeBtn}
                                                    onClick={() => handleDelete(cat.key, o._id)}
                                                    title="Remove option"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))
                                    )}
                                </div>

                                <div style={styles.addRow}>
                                    <input
                                        style={styles.input}
                                        type={cat.numeric ? 'number' : 'text'}
                                        placeholder={cat.placeholder}
                                        value={inputs[cat.key] || ''}
                                        onChange={(e) => handleInputChange(cat.key, e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(cat); }}
                                    />
                                    <button
                                        style={styles.addBtn}
                                        onClick={() => handleAdd(cat)}
                                        disabled={saving[cat.key] || !(inputs[cat.key] || '').trim()}
                                    >
                                        {saving[cat.key] ? 'Adding…' : '+ Add'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StayDropdowns;
