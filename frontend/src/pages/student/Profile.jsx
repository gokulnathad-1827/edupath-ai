import { useState, useEffect } from 'react';
import {
  RiUserLine,
  RiEditLine,
  RiMailLine,
  RiBookLine,
  RiIdCardLine,
  RiCalendarLine,
  RiSaveLine,
  RiErrorWarningLine,
  RiMapPinLine,
  RiPhoneLine
} from 'react-icons/ri';
import useAuth from '../hooks/useAuth';
import Button from '../../components/common/Button';
import { edupathApi } from '../../services/edupathApi';
import './StudentPage.css';

const InfoRow = ({ icon, label, value, name, form, handleChange, editing, editable = true }) => (
  <div className="profile-info-row">
    <div className="profile-info-label">
      <span className="profile-info-icon">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="profile-info-value">
      {editing && editable ? (
        <input
          name={name}
          value={form[name] || ''}
          onChange={handleChange}
          className="form-input profile-edit-input"
        />
      ) : (
        <span>{value !== undefined ? value : form[name]}</span>
      )}
    </div>
  </div>
);

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [studentEntity, setStudentEntity] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    className: '10',
    section: 'A',
    status: 'ACTIVE',
    studentId: 'STU-001'
  });

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg('');
    try {
      let data = null;
      const identifier = user.id || user.email;
      if (identifier) {
        try {
          console.info(`[API CALL] GET /api/students/user/${identifier}`);
          data = await edupathApi.getStudentByUserId(identifier);
        } catch (e) {
          if (user.email) {
            try {
              console.info(`[API CALL] GET /api/students/email/${user.email}`);
              data = await edupathApi.getStudentByEmail(user.email);
            } catch (e2) {}
          }
        }
      }

      if (data) {
        console.info('[API SUCCESS] Loaded Student Entity from Database:', data);
        setStudentEntity(data);
        const loadedName = data.fullName || user?.fullName || user?.name || '';
        setForm({
          fullName: loadedName,
          email: data.email || user?.email || '',
          phoneNumber: data.phoneNumber || user?.phone || '',
          address: data.address || 'EduPath Main Campus, Chennai',
          className: data.className || '10',
          section: data.section || 'A',
          status: data.status || 'ACTIVE',
          studentId: data.studentId || 'STU-001'
        });
        if (updateUser && user && loadedName && (user.name !== loadedName || user.fullName !== loadedName)) {
          updateUser({
            ...user,
            name: loadedName,
            fullName: loadedName,
            email: data.email || user.email,
            phone: data.phoneNumber || user.phone,
            studentId: data.studentId || user.studentId || 'STU-001',
          });
        }
      } else {
        setForm({
          fullName: user?.fullName || user?.name || 'Ananya Sharma',
          email: user?.email || 'student@edupath.com',
          phoneNumber: user?.phone || '9876543210',
          address: 'EduPath Main Campus, Chennai',
          className: '10',
          section: 'A',
          status: 'ACTIVE',
          studentId: 'STU-001'
        });
      }
    } catch (err) {
      console.error('[Student Profile Load Error]', err);
      setErrorMsg('Failed to load profile data from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id, user?.email]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      let targetId = studentEntity?.id;

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        className: form.className.trim(),
        section: form.section.trim(),
        status: form.status,
        userId: user?.id && !isNaN(Number(user.id)) ? Number(user.id) : null
      };

      let result;
      if (targetId) {
        console.info(`[API CALL] PUT /api/students/${targetId}`, payload);
        result = await edupathApi.updateStudent(targetId, payload);
      } else {
        console.info(`[API CALL] POST /api/students`, payload);
        result = await edupathApi.createStudent(payload);
      }

      console.info('[API SUCCESS] Persisted Student Entity to Database:', result);
      setStudentEntity(result);
      if (updateUser && user) {
        updateUser({
          ...user,
          name: result.fullName,
          fullName: result.fullName,
          email: result.email,
          phone: result.phoneNumber,
          studentId: result.studentId || 'STU-001',
        });
      }

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('[Student Profile Save Error]', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to update student profile in database.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (studentEntity) {
      setForm({
        fullName: studentEntity.fullName || '',
        email: studentEntity.email || '',
        phoneNumber: studentEntity.phoneNumber || '',
        address: studentEntity.address || '',
        className: studentEntity.className || '10',
        section: studentEntity.section || 'A',
        status: studentEntity.status || 'ACTIVE',
        studentId: studentEntity.studentId || 'STU-001'
      });
    }
    setEditing(false);
  };

  return (
    <div className="student-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'var(--gradient-primary)' }}>
          <RiUserLine />
        </div>
        <div>
          <h2 className="page-title">Student Profile</h2>
          <p className="page-subtitle">Manage your student academic identity and database profile details.</p>
        </div>
      </div>

      {saved && (
        <div className="info-strip info-strip-success">
          ✅ Profile updated and persisted successfully to database!
        </div>
      )}

      {errorMsg && (
        <div className="info-strip" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <RiErrorWarningLine /> {errorMsg}
        </div>
      )}

      <div className="profile-layout">
        <div className="profile-avatar-card">
          <div className="profile-avatar-large">
            {form.fullName?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <h3 className="profile-name">{form.fullName}</h3>
          <p className="profile-role">Student</p>
          <div className="profile-badges">
            <span className="badge badge-primary">Class {form.className}-{form.section}</span>
            <span className="badge badge-success">{form.status}</span>
          </div>

          {!editing ? (
            <Button
              variant="outline"
              icon={<RiEditLine />}
              fullWidth
              onClick={() => setEditing(true)}
              id="edit-student-profile-btn"
              style={{ marginTop: '20px' }}
            >
              Edit Profile
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '20px' }}>
              <Button variant="primary" icon={<RiSaveLine />} loading={saving} onClick={handleSave} fullWidth>
                Save
              </Button>
              <Button variant="ghost" onClick={handleCancel} fullWidth>
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="page-card profile-info-card">
          <h4 className="profile-section-title">Personal & Academic Details</h4>
          {loading ? (
            <p>Loading profile details from database...</p>
          ) : (
            <>
              <InfoRow icon={<RiUserLine />} label="Full Name" name="fullName" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiMailLine />} label="Email Address" name="email" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiPhoneLine />} label="Phone Number" name="phoneNumber" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiMapPinLine />} label="Address" name="address" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiBookLine />} label="Class Name" name="className" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiCalendarLine />} label="Section" name="section" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiIdCardLine />} label="Student ID" name="studentId" editable={false} form={form} handleChange={handleChange} editing={editing} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;