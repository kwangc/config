import type { Locale } from './i18n';
import { i18n } from './i18n';

export type WikiNavItem = { label: string; href?: string; children?: WikiNavItem[] };

export function getWikiNav(locale: Locale, base: string): WikiNavItem[] {
  const prefix = `${base}/${locale}`;
  const s = i18n[locale]?.sidebar ?? i18n.en.sidebar;
  const w = (path: string) => `${prefix}/wiki/${path}`;
  return [
    { label: s.wikiDocs, children: [{ label: s.home, href: `${prefix}/` }] },
    { label: s.companyGroup, children: [{ label: s.companyAbout, href: w('company/about.md') }] },
    {
      label: 'Product',
      children: [
        { label: s.productOverview, href: w('product/README.md') },
        { label: 'Data Platform', href: w('product/data-platform.md') },
        { label: 'Foundation Model', href: w('product/foundation-model.md') },
      ],
    },
    {
      label: 'Domains',
      children: [
        { label: 'AI / ML', href: w('domains/ai-ml.md') },
        { label: 'LLM', href: w('domains/llm.md') },
        { label: 'VLA', href: w('domains/vla.md') },
        { label: 'Robotics', href: w('domains/robotics.md') },
        { label: 'Simulation & Sim2Real', href: w('domains/sim2real.md') },
        { label: 'Data & Scaling', href: w('domains/data-scaling.md') },
        { label: 'Deployment', href: w('domains/deployment.md') },
      ],
    },
    { label: 'Research', href: w('research/README.md') },
    { label: 'Industry', href: w('industry/README.md') },
    { label: 'Glossary', href: w('glossary/README.md') },
    { label: 'Safety & Evaluation', href: w('safety-eval/README.md') },
  ];
}
