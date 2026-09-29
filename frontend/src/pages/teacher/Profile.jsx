import { useState, useEffect } from 'react';
import {
  RiUserLine,
  RiEditLine,
  RiMailLine,
  RiBookLine,
  RiSaveLine,
  RiErrorWarningLine,
  RiMapPinLine,
  RiPhoneLine,
  RiAwardLine,
  RiTimeLine
} from 'react-icons/ri';
import useAuth from '../hooks/useAuth';
import Button from '../../components/common/Button';
import { edupathApi } from '../../services/edupathApi';
import '../student/StudentPage.css';

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
          value={form[name] !== undefined ? form[name] : ''}
          onChange={handleChange}
          className="form-input profile-edit-input"
        />
      ) : (
        <span>{value !== undefined ? value : form[name]}</span>
      )}
    </div>
  </div>
);

const TeacherProfile = () => {
  const { user, updateUser } = useAuth();
  const [teacherEntity, setTeacherEntity] = useState(null);
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
    subject: 'Mathematics',
    qualification: 'M.Sc, B.Ed',
    experience: 8,
    status: 'ACTIVE'
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
          console.info(`[API CALL] GET /api/teachers/user/${identifier}`);
          data = await edupathApi.getTeacherByUserId(identifier);
        } catch (e) {
          if (user.email) {
            try {
              console.info(`[API CALL] GET /api/teachers/email/${user.email}`);
              data = await edupathApi.getTeacherByEmail(user.email);
            } catch (e2) {}
          }
        }
      }

      if (data) {
        console.info('[API SUCCESS] Loaded Teacher Entity from Database:', data);
        setTeacherEntity(data);
        setForm({
          fullName: data.fullName || data.name || user.fullName || user.name || '',
          email: data.email || user.email || '',
          phoneNumber: data.phoneNumber || user.phone || '',
          address: data.address || '',
          subject: data.subject || data.specialization || 'N/A',
          qualification: data.qualification || 'N/A',
          experience: data.experience !== undefined && data.experience !== null ? data.experience : 'N/A',
          status: data.status || 'ACTIVE'
        });
      } else {
        setTeacherEntity(null);
        setForm({
          fullName: user.fullName || user.name || '',
          email: user.email || '',
          phoneNumber: user.phone || '',
          address: '',
          subject: 'N/A',
          qualification: 'N/A',
          experience: 'N/A',
          status: 'UNLINKED'
        });
      }
    } catch (err) {
      console.error('[Teacher Profile Load Error]', err);
      setErrorMsg('Failed to load teacher profile from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      let targetId = teacherEntity?.id;

      const payload = {
        fullName: form.fullName.trim(),
        name: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        subject: form.subject.trim(),
        qualification: form.qualification.trim(),
        experience: Number(form.experience) || 0,
        status: form.status,
        userId: user?.id && !isNaN(Number(user.id)) ? Number(user.id) : null
      };

      let result;
      if (targetId) {
        console.info(`[API CALL] PUT /api/teachers/${targetId}`, payload);
        result = await edupathApi.updateTeacher(targetId, payload);
      } else {
        console.info(`[API CALL] POST /api/teachers`, payload);
        result = await edupathApi.createTeacher(payload);
      }

      console.info('[API SUCCESS] Persisted Teacher Entity to Database:', result);
      setTeacherEntity(result);
      if (updateUser && user) {
        updateUser({
          ...user,
          name: result.fullName || result.name,
          fullName: result.fullName || result.name,
          email: result.email,
          phone: result.phoneNumber,
        });
      }

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
      await loadProfile();
    } catch (err) {
      console.error('[Teacher Profile Save Error]', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to update teacher profile in database.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (teacherEntity) {
      setForm({
        fullName: teacherEntity.fullName || teacherEntity.name || '',
        email: teacherEntity.email || '',
        phoneNumber: teacherEntity.phoneNumber || '',
        address: teacherEntity.address || '',
        subject: teacherEntity.subject || 'Mathematics',
        qualification: teacherEntity.qualification || 'M.Sc, B.Ed',
        experience: teacherEntity.experience || 8,
        status: teacherEntity.status || 'ACTIVE'
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
          <h2 className="page-title">Teacher Profile</h2>
          <p className="page-subtitle">Manage your faculty credentials and database profile details.</p>
        </div>
      </div>

      {saved && (
        <div className="info-strip info-strip-success">
          ✅ Teacher profile updated and persisted successfully to database!
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
            {form.fullName?.charAt(0)?.toUpperCase() || 'T'}
          </div>
          <h3 className="profile-name">{form.fullName}</h3>
          <p className="profile-role">Teacher / Faculty</p>
          <div className="profile-badges">
            <span className="badge badge-primary">{form.subject}</span>
            <span className="badge badge-success">{form.status}</span>
          </div>

          {!editing ? (
            <Button
              variant="outline"
              icon={<RiEditLine />}
              fullWidth
              onClick={() => setEditing(true)}
              id="edit-teacher-profile-btn"
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
          <h4 className="profile-section-title">Faculty Profile Details</h4>
          {loading ? (
            <p>Loading teacher details from database...</p>
          ) : (
            <>
              <InfoRow icon={<RiUserLine />} label="Full Name" name="fullName" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiMailLine />} label="Email Address" name="email" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiPhoneLine />} label="Phone Number" name="phoneNumber" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiMapPinLine />} label="Address" name="address" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiBookLine />} label="Subject" name="subject" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiAwardLine />} label="Qualification" name="qualification" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiTimeLine />} label="Experience (Years)" name="experience" form={form} handleChange={handleChange} editing={editing} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
