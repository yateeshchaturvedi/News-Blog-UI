import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/seo';

type Crumb = {
  name: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href ? toAbsoluteUrl(item.href) : undefined,
    })),
  };

  return (
    <div className="mb-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-blue-700 hover:underline">
                  {item.name}
                </Link>
              ) : (
                <span className="font-semibold text-slate-700">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
