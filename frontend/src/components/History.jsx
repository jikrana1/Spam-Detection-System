import { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
    const [history, setHistory] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedItems.length} item(s)?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete('/api/history/bulk-delete', {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: selectedItems }
            });
            setSelectedItems([]);
            fetchHistory();
        } catch (error) {
            alert('Failed to delete items');
        }
    };

    const toggleSelect = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleExportCSV = () => {
        if (history.length === 0) return;
        
        const headers = ["Query", "Prediction", "Date"];
        const rows = history.map(item => {
            const date = item.createdAt ? new Date(item.createdAt).toLocaleString() : '';
            const safeQuery = (item.query || '').replace(/"/g, '""');
            return `"${safeQuery}","${item.prediction}","${date}"`;
        });
        
        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "scan_history.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>History</h2>
                <button 
                    onClick={handleExportCSV}
                    disabled={history.length === 0}
                    style={{
                        background: history.length === 0 ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: history.length === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Download CSV
                </button>
            </div>

            {selectedItems.length > 0 && (
                <button
                    onClick={handleBulkDelete}
                    style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    Delete Selected ({selectedItems.length})
                </button>
            )}

            {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb', marginTop: '20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '20px' }}>No scan history yet</h3>
                    <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>It looks like you haven't scanned any messages or emails.</p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#2563eb'}
                        onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                    >
                        Go to Dashboard
                    </button>
                </div>
            ) : (
                history.map(item => (
                    <div
                        key={item._id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 0',
                            borderBottom: '1px solid #e5e7eb'
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => toggleSelect(item._id)}
                        />
                        <span style={{ flex: 1 }}>{item.query}</span>
                        <span
                            style={{
                                padding: '2px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: item.prediction === 'spam' ? '#fee2e2' : '#dcfce7',
                                color: item.prediction === 'spam' ? '#dc2626' : '#16a34a'
                            }}
                        >
                            {item.prediction}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

export default History;