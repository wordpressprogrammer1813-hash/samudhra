export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export function SiteFooter({
  columns,
  logoUrl,
  tagline,
}: {
  columns: FooterColumn[];
  logoUrl: string | null;
  tagline: string;
}) {
  return (
    <footer className="border-t border-heath/18 bg-serenade text-heath">
      <div className="mx-auto max-w-[1320px] px-5 pt-16 pb-10 sm:px-14 sm:pt-24">
        <div className="grid grid-cols-2 gap-9 sm:grid-cols-3 lg:grid-cols-[minmax(0,2.2fr)_repeat(5,minmax(0,1fr))]">
          <div className="col-span-2 flex flex-col gap-5 sm:col-span-3 lg:col-span-1">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage URL, not a next/image case yet
              <img src={logoUrl} alt="Samudhra" className="h-auto w-[200px] max-w-full" />
            ) : (
              <span className="text-xl font-medium tracking-wide text-heath">Samudhra</span>
            )}
            <p className="max-w-65 text-[17px] text-heath/78">{tagline}</p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="mb-3.5 text-[10px] font-semibold tracking-[0.26em] text-korma uppercase">
                {column.heading}
              </p>
              <div className="flex flex-col">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex min-h-9 items-center text-[16px] text-heath decoration-zest underline-offset-[5px] hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-heath/18 pt-6">
          <p className="m-0 flex flex-wrap gap-x-7 gap-y-2.5 text-[10px] font-medium tracking-[0.24em] text-heath/75 uppercase">
            <a href="#top">Back to top</a>
            <span>© {new Date().getFullYear()} Samudhra</span>
            <span>Prototype — [bracketed] details are placeholders</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
