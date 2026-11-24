'use client';

import { useState, type ReactNode } from 'react';

export interface SectionItem {
  id: string;
  label: string;
  editable: boolean;
  form: ReactNode;
}

export function PageSectionsAccordion({ items }: { items: SectionItem[] }) {
  const firstEditable = items.find((i) => i.editable)?.id ?? null;
  const [openId, setOpenId] = useState<string | null>(firstEditable);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <section key={item.id} className="overflow-hidden rounded-[3px] border border-heath/15">
            <button
              type="button"
              disabled={!item.editable}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left disabled:cursor-default"
            >
              <span className="text-sm font-medium text-heath">{item.label}</span>
              {item.editable ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className={`size-4 text-heath/50 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              ) : (
                <span className="text-xs tracking-[0.15em] text-heath/35 uppercase">Soon</span>
              )}
            </button>
            {open && item.editable ? (
              <div className="border-t border-heath/10 px-5 py-6">{item.form}</div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
