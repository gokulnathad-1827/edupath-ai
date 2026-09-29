import { useState } from 'react';
import { RiSendPlaneLine, RiCheckLine } from 'react-icons/ri';
import Button from '../common/Button';
import './CareerAssessmentForm.css';

const INTERESTS = [
  'Mathematics', 'Science', 'Reading', 'Drawing',
  'Sports', 'Music', 'Computer Science', 'Public Speaking',
  'Helping Others', 'Nature', 'Technology', 'Art & Craft',
  'Problem Solving', 'Leadership', 'Teamwork',
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const initialForm = {
  favoriteSubjects: [],
  interests: [],
  programmingSkill: '',
  mathSkill: '',
  communicationSkill: '',
  preferredWorkStyle: '',
  careerGoal: '',
  extraCurricular: '',
  cgpa: '',
};

/**
 * CareerAssessmentForm
 * Props:
 *  onSubmit(formData) — called with validated form data
 *  loading            — disables form during AI call
 */
const CareerAssessmentForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const toggle = (field, value) => {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (form.interests.length === 0) errs.interests = 'Select at least one interest.';
    if (!form.programmingSkill) errs.programmingSkill = 'Required.';
    if (!form.mathSkill) errs.mathSkill = 'Required.';
    if (!form.communicationSkill) errs.communicationSkill = 'Required.';
    if (!form.preferredWorkStyle) errs.preferredWorkStyle = 'Required.';
    if (!form.cgpa) errs.cgpa = 'Required.';
    else if (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 100)
      errs.cgpa = 'Overall Percentage must be between 0 and 100%.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  };

  const SelectGroup = ({ label, field, options }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="tag-group">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`tag-btn ${form[field].includes(opt) ? 'tag-active' : ''}`}
            onClick={() => toggle(field, opt)}
          >
            {form[field].includes(opt) && <RiCheckLine />} {opt}
          </button>
        ))}
      </div>
      {errors[field] && <p className="form-error">{errors[field]}</p>}
    </div>
  );

  return (
    <form className="assessment-form" onSubmit={handleSubmit} noValidate>
      {/* Interests */}
      <SelectGroup label="Your Interests *" field="interests" options={INTERESTS} />

      {/* Skill Levels */}
      <div className="form-row">
        {[
          { label: 'Computer Skills *', name: 'programmingSkill' },
          { label: 'Mathematics Skills *', name: 'mathSkill' },
          { label: 'Communication Skills *', name: 'communicationSkill' },
        ].map(({ label, name }) => (
          <div className="form-group" key={name}>
            <label className="form-label">{label}</label>
            <select
              name={name}
              value={form[name]}
              onChange={handleChange}
              className={`form-input form-select ${errors[name] ? 'input-error' : ''}`}
            >
              <option value="">-- Select Level --</option>
              {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors[name] && <p className="form-error">{errors[name]}</p>}
          </div>
        ))}
      </div>

      {/* Work Style & CGPA */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Preferred Work Style *</label>
          <select
            name="preferredWorkStyle"
            value={form.preferredWorkStyle}
            onChange={handleChange}
            className={`form-input form-select ${errors.preferredWorkStyle ? 'input-error' : ''}`}
          >
            <option value="">-- Select Style --</option>
            <option value="Working with People">Working with People</option>
            <option value="Creative Work">Creative Work</option>
            <option value="Research">Research</option>
            <option value="Outdoor Activities">Outdoor Activities</option>
            <option value="Technology">Technology</option>
            <option value="Teaching">Teaching</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Business">Business</option>
          </select>
          {errors.preferredWorkStyle && <p className="form-error">{errors.preferredWorkStyle}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Overall Percentage (%) *</label>
          <input
            type="number"
            name="cgpa"
            value={form.cgpa}
            onChange={handleChange}
            placeholder="e.g. 85"
            step="1"
            min="0"
            max="100"
            className={`form-input ${errors.cgpa ? 'input-error' : ''}`}
          />
          {errors.cgpa && <p className="form-error">{errors.cgpa}</p>}
        </div>
      </div>

      {/* Career Goal */}
      <div className="form-group">
        <label className="form-label">Career Goal (optional)</label>
        <input
          type="text"
          name="careerGoal"
          value={form.careerGoal}
          onChange={handleChange}
          placeholder="e.g. I want to become a doctor, I want to become a teacher..."
          className="form-input"
        />
      </div>

      {/* Extra-curricular */}
      <div className="form-group">
        <label className="form-label">Extra-curricular Activities (optional)</label>
        <textarea
          name="extraCurricular"
          value={form.extraCurricular}
          onChange={handleChange}
          placeholder="Describe any sports, drawing competitions, science exhibitions, quiz competitions, cultural activities, NCC, Scout & Guide, or school clubs..."
          className="form-input form-textarea"
          rows={3}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        icon={<RiSendPlaneLine />}
      >
        {loading ? 'Analysing with AI...' : 'Get My Career Recommendations'}
      </Button>
    </form>
  );
};

export default CareerAssessmentForm;