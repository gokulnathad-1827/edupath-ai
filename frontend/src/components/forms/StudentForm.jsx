import React, { useState } from 'react';
import Button from '../common/Button';
import { addStudent } from '../../services/studentService';

const StudentForm = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    department: 'Class 10-A',
    attendance: '90%',
    score: '80%',
    risk: 'Low',
    action: 'Regular Follow-up',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    
    const studentData = {
      name: form.name,
      classSection: form.department,
      attendance: form.attendance,
      score: form.score,
      risk: form.risk,
      action: form.action,
    };

    await addStudent(studentData);
    onSave();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        className="page-card"
        style={{
          width: '100%',
          maxWidth: '450px',
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-card)',
          padding: '24px',
          borderRadius: '16px',
        }}
      >
        <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Add New Student</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Student Name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Class / Section</label>
            <select name="department" value={form.department} onChange={handleChange} className="form-input form-select">
              <option value="Class 10-A">Class 10-A</option>
              <option value="Class 9-A">Class 9-A</option>
              <option value="Class 11-A">Class 11-A</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Risk Level</label>
            <select name="risk" value={form.risk} onChange={handleChange} className="form-input form-select">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button type="submit" variant="primary" fullWidth>
              Save Student
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
