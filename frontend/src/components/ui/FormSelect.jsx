import React from 'react';

export default function FormSelect({
  label,
  id,
  name,
  value,
  onChange,
  error,
  options,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
