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

const CounselorProfile = () => {
  const { user, updateUser } = useAuth();
  const [counselorEntity, setCounselorEntity] = useState(null);
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
    qualification: 'M.Sc Psychology',
    specialization: 'Academic & Career Guidance',
    experience: 6,
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
          console.info(`[API CALL] GET /api/counselors/user/${identifier}`);
          data = await edupathApi.getCounselorByUserId(identifier);
        } catch (e) {
          if (user.email) {
            try {
              console.info(`[API CALL] GET /api/counselors/email/${user.email}`);
              data = await edupathApi.getCounselorByEmail(user.email);
            } catch (e2) {}
          }
        }
      }

      if (data) {
        console.info('[API SUCCESS] Loaded Counselor Entity from Database:', data);
        setCounselorEntity(data);
        setForm({
          fullName: data.fullName || user.fullName || user.name || '',
          email: data.email || user.email || '',
          phoneNumber: data.phoneNumber || user.phone || '',
          address: data.address || 'EduPath Wellness Center',
          qualification: data.qualification || 'M.Sc Psychology',
          specialization: data.specialization || 'Academic & Career Guidance',
          experience: data.experience || 6,
          status: data.status || 'ACTIVE'
        });
      } else {
        setForm({
          fullName: user.fullName || user.name || 'Ms. Deepa Nair',
          email: user.email || 'counselor@edupath.com',
          phoneNumber: user.phone || '9876543213',
          address: 'EduPath Wellness Center',
          qualification: 'M.Sc Psychology',
          specialization: 'Academic & Career Guidance',
          experience: 6,
          status: 'ACTIVE'
        });
      }
    } catch (err) {
      console.error('[Counselor Profile Load Error]', err);
      setErrorMsg('Failed to load counselor profile from database.');
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
      let targetId = counselorEntity?.id;

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        qualification: form.qualification.trim(),
        specialization: form.specialization.trim(),
        experience: Number(form.experience) || 0,
        status: form.status,
        userId: user?.id && !isNaN(Number(user.id)) ? Number(user.id) : null
      };

      let result;
      if (targetId) {
        console.info(`[API CALL] PUT /api/counselors/${targetId}`, payload);
        result = await edupathApi.updateCounselor(targetId, payload);
      } else {
        console.info(`[API CALL] POST /api/counselors`, payload);
        result = await edupathApi.createCounselor(payload);
      }

      console.info('[API SUCCESS] Persisted Counselor Entity to Database:', result);
      setCounselorEntity(result);
      if (updateUser && user) {
        updateUser({
          ...user,
          name: result.fullName,
          fullName: result.fullName,
          email: result.email,
          phone: result.phoneNumber,
        });
      }

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
      await loadProfile();
    } catch (err) {
      console.error('[Counselor Profile Save Error]', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to update counselor profile in database.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (counselorEntity) {
      setForm({
        fullName: counselorEntity.fullName || '',
        email: counselorEntity.email || '',
        phoneNumber: counselorEntity.phoneNumber || '',
        address: counselorEntity.address || '',
        qualification: counselorEntity.qualification || 'M.Sc Psychology',
        specialization: counselorEntity.specialization || 'Academic & Career Guidance',
        experience: counselorEntity.experience || 6,
        status: counselorEntity.status || 'ACTIVE'
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
          <h2 className="page-title">Counselor Profile</h2>
          <p className="page-subtitle">Manage wellness specialist credentials and database profile details.</p>
        </div>
      </div>

      {saved && (
        <div className="info-strip info-strip-success">
          ✅ Counselor profile updated and persisted successfully to database!
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
            {form.fullName?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <h3 className="profile-name">{form.fullName}</h3>
          <p className="profile-role">Student Counselor</p>
          <div className="profile-badges">
            <span className="badge badge-primary">{form.specialization}</span>
            <span className="badge badge-success">{form.status}</span>
          </div>

          {!editing ? (
            <Button
              variant="outline"
              icon={<RiEditLine />}
              fullWidth
              onClick={() => setEditing(true)}
              id="edit-counselor-profile-btn"
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
          <h4 className="profile-section-title">Counselor Profile Details</h4>
          {loading ? (
            <p>Loading counselor details from database...</p>
          ) : (
            <>
              <InfoRow icon={<RiUserLine />} label="Full Name" name="fullName" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiMailLine />} label="Email Address" name="email" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiPhoneLine />} label="Phone Number" name="phoneNumber" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiMapPinLine />} label="Address" name="address" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiAwardLine />} label="Qualification" name="qualification" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiBookLine />} label="Specialization" name="specialization" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiTimeLine />} label="Experience (Years)" name="experience" form={form} handleChange={handleChange} editing={editing} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounselorProfile;
