import React, { useState } from 'react';
import Input from '../common/Input.jsx';
import TextArea from '../common/TextArea.jsx';
import Button from '../common/Button.jsx';

/**
 * Renders a form from a declarative field config, used by EntitySection for
 * every dashboard data category (education, experience, skills, projects,
 * volunteering). Keeps the five CRUD pages from duplicating form markup.
 *
 * field: { name, label, type: 'text'|'textarea'|'number'|'date'|'select'|'tags'|'checkbox', required, options, placeholder }
 */
const EntityForm = ({ fields, initialValues = {}, onSubmit, onCancel, submitting }) => {
  const [values, setValues] = useState(() => {
    const base = {};
    fields.forEach((f) => {
      base[f.name] = initialValues[f.name] ?? (f.type === 'tags' ? [] : f.type === 'checkbox' ? false : '');
    });
    return base;
  });

  const setField = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...values };

    fields.forEach((field) => {
      if (field.type === 'number' && payload[field.name] === '') {
        payload[field.name] = null;
      }
    });

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => {
        if (f.type === 'textarea') {
          return (
            <TextArea
              key={f.name}
              label={f.label}
              required={f.required}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={(e) => setField(f.name, e.target.value)}
            />
          );
        }
        if (f.type === 'select') {
          return (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <select
                className="input-field"
                required={f.required}
                value={values[f.name]}
                onChange={(e) => setField(f.name, e.target.value)}
              >
                <option value="" disabled>Select...</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          );
        }
        if (f.type === 'tags') {
          return (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input
                className="input-field"
                placeholder={f.placeholder || 'Comma-separated, e.g. React, Node.js, MongoDB'}
                value={Array.isArray(values[f.name]) ? values[f.name].join(', ') : values[f.name]}
                onChange={(e) =>
                  setField(f.name, e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
                }
              />
            </div>
          );
        }
        if (f.type === 'checkbox') {
          return (
            <label key={f.name} className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={!!values[f.name]}
                onChange={(e) => setField(f.name, e.target.checked)}
                className="rounded border-gray-300"
              />
              {f.label}
            </label>
          );
        }
        return (
          <Input
            key={f.name}
            label={f.label}
            type={f.type || 'text'}
            required={f.required}
            placeholder={f.placeholder}
            value={values[f.name]}
            onChange={(e) => setField(f.name, e.target.value)}
          />
        );
      })}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  );
};

export default EntityForm;
