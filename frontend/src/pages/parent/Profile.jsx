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
  RiBriefcaseLine
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

const ParentProfile = () => {
  const { user, updateUser } = useAuth();
  const [parentEntity, setParentEntity] = useState(null);
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
    occupation: '',
    childName: '',
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
          console.info(`[API CALL] GET /api/parents/user/${identifier}`);
          data = await edupathApi.getParentByUserId(identifier);
        } catch (e) {
          if (user.email) {
            try {
              console.info(`[API CALL] GET /api/parents/email/${user.email}`);
              data = await edupathApi.getParentByEmail(user.email);
            } catch (e2) {}
          }
        }
      }

      if (data) {
        console.info('[API SUCCESS] Loaded Parent Entity from Database:', data);
        setParentEntity(data);
        setForm({
          fullName: data.fullName || data.fatherName || user.fullName || user.name || '',
          email: data.email || user.email || '',
          phoneNumber: data.phoneNumber || user.phone || '',
          address: data.address || '',
          occupation: data.occupation || '',
          childName: data.childName || '',
          status: data.status || 'ACTIVE'
        });
      } else {
        setParentEntity(null);
        setForm({
          fullName: user.fullName || user.name || '',
          email: user.email || '',
          phoneNumber: user.phone || '',
          address: '',
          occupation: '',
          childName: '',
          status: 'UNLINKED'
        });
      }
    } catch (err) {
      console.error('[Parent Profile Load Error]', err);
      setErrorMsg('Failed to load parent profile from database.');
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
      let targetId = parentEntity?.id;

      const payload = {
        fullName: form.fullName.trim(),
        fatherName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address.trim(),
        occupation: form.occupation.trim(),
        childName: form.childName.trim(),
        status: form.status,
        userId: user?.id && !isNaN(Number(user.id)) ? Number(user.id) : null
      };

      let result;
      if (targetId) {
        console.info(`[API CALL] PUT /api/parents/${targetId}`, payload);
        result = await edupathApi.updateParent(targetId, payload);
      } else {
        console.info(`[API CALL] POST /api/parents`, payload);
        result = await edupathApi.createParent(payload);
      }

      console.info('[API SUCCESS] Persisted Parent Entity to Database:', result);
      setParentEntity(result);
      if (updateUser && user) {
        updateUser({
          ...user,
          name: result.fullName || result.fatherName,
          fullName: result.fullName || result.fatherName,
          email: result.email,
          phone: result.phoneNumber,
        });
      }

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
      await loadProfile();
    } catch (err) {
      console.error('[Parent Profile Save Error]', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to update parent profile in database.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (parentEntity) {
      setForm({
        fullName: parentEntity.fullName || parentEntity.fatherName || '',
        email: parentEntity.email || '',
        phoneNumber: parentEntity.phoneNumber || '',
        address: parentEntity.address || '',
        occupation: parentEntity.occupation || '',
        childName: parentEntity.childName || '',
        status: parentEntity.status || 'ACTIVE'
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
          <h2 className="page-title">Parent Profile</h2>
          <p className="page-subtitle">Manage guardian contact details and student association in database.</p>
        </div>
      </div>

      {saved && (
        <div className="info-strip info-strip-success">
          ✅ Parent profile updated and persisted successfully to database!
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
            {form.fullName?.charAt(0)?.toUpperCase() || 'P'}
          </div>
          <h3 className="profile-name">{form.fullName}</h3>
          <p className="profile-role">Parent / Guardian</p>
          <div className="profile-badges">
            <span className="badge badge-primary">{form.occupation}</span>
            <span className="badge badge-success">{form.status}</span>
          </div>

          {!editing ? (
            <Button
              variant="outline"
              icon={<RiEditLine />}
              fullWidth
              onClick={() => setEditing(true)}
              id="edit-parent-profile-btn"
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
          <h4 className="profile-section-title">Guardian & Child Details</h4>
          {loading ? (
            <p>Loading parent details from database...</p>
          ) : (
            <>
              <InfoRow icon={<RiUserLine />} label="Full Name" name="fullName" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiMailLine />} label="Email Address" name="email" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiPhoneLine />} label="Phone Number" name="phoneNumber" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiMapPinLine />} label="Address" name="address" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiBriefcaseLine />} label="Occupation" name="occupation" form={form} handleChange={handleChange} editing={editing} />
              <InfoRow icon={<RiBookLine />} label="Child Name" name="childName" form={form} handleChange={handleChange} editing={editing} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
