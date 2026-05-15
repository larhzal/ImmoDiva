import React from 'react';

export default function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 text-sm shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
