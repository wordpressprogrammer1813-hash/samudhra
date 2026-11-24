'use client';

export function CustomizeTextField({
  label,
  value,
  multiline = false,
  onChange,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  const commonProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className:
      'w-full rounded-[3px] border border-heath/30 bg-transparent px-3 py-2 text-sm text-heath outline-none focus-visible:border-heath',
  };

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
        {label}
      </span>
      {multiline ? <textarea rows={2} {...commonProps} /> : <input {...commonProps} />}
    </label>
  );
}
