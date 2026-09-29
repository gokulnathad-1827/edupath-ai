import React from 'react';

/**
 * Reusable dynamic Table component.
 * Automatically generates headers and cells based on data keys.
 */
const Table = ({ data = [], onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <p className="dash-stat-sub">No data available</p>;
  }

  // Filter out internal id from main header keys, add Actions if onEdit or onDelete provided
  const keys = Object.keys(data[0]).filter((k) => k !== 'id' && k !== 'rawRecord');
  const headers = [...keys];

  const formatHeader = (key) => {
    if (key === 'classSection') return 'Class & Section';
    if (key === 'studentId') return 'Student ID';
    if (key === 'rollNo') return 'Roll Number';
    if (key === 'cgpa') return 'Percentage';
    const formatted = key.replace(/([A-Z])/g, ' $1');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>
                {formatHeader(header)}
              </th>
            ))}
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {headers.map((header) => {
                const val = row[header];
                return (
                  <td key={header}>
                    {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                  </td>
                );
              })}
              {hasActions && (
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(row.id, row.name || row.fullName || `Record #${row.id}`, row)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;