import type { Locale } from './i18n';
import { i18n } from './i18n';

export type WikiNavItem = { label: string; href?: string; children?: WikiNavItem[]; id?: string };

export function getWikiNav(locale: Locale, base: string): WikiNavItem[] {
  const prefix = `${base}/${locale}`;
  const s = i18n[locale]?.sidebar ?? i18n.en.sidebar;
  const w = (path: string) => {
    const clean = path.replace(/\/+$/, '');
    return `${prefix}/wiki/${clean}/`;
  };
  return [
    { label: s.wikiDocs, children: [{ label: s.home, href: `${prefix}/` }] },
    { label: s.companyGroup, children: [{ label: s.companyAbout, href: w('01-company/about.md') }] },
    {
      label: 'Product',
      children: [
        { label: s.productOverview, href: w('02-product/README.md') },
        { label: 'Data Platform', href: w('02-product/01-data-platform.md') },
        { label: 'Foundation Model', href: w('02-product/02-foundation-model.md') },
        { label: 'Task & Applications', href: w('02-product/03-task-and-applications') },
        { label: 'Operations', href: w('02-product/04-operations.md') },
        { label: 'Product Strategy', href: w('02-product/05-product-strategy.md') },
      ],
    },
    {
      label: 'Domains',
      children: [
        { label: 'Overview', href: w('03-domains/README.md') },
        {
          id: 'robotics',
          label: 'Robotics',
          children: [
            { label: 'Overview', href: w('03-domains/01-robotics/01-robotics.md') },
            { label: 'Hardware taxonomy', href: w('03-domains/01-robotics/02-hardware-taxonomy.md') },
            { label: 'System architecture', href: w('03-domains/01-robotics/03-system-architecture.md') },
            { label: 'Bimanual', href: w('03-domains/01-robotics/04-bimanual.md') },
          ],
        },
        {
          id: 'model-class',
          label: 'Model Class',
          children: [
            { label: 'Overview', href: w('03-domains/02-model-class/01-overview.md') },
            { label: 'LLM', href: w('03-domains/02-model-class/02-llm.md') },
            { label: 'VLM', href: w('03-domains/02-model-class/02-vlm.md') },
            { label: 'VLA', href: w('03-domains/02-model-class/03-vla.md') },
          ],
        },
        {
          id: 'model-algorithm',
          label: 'Model Algorithm (VLA deepdive)',
          children: [
            { label: 'Overview', href: w('03-domains/03-model-algorithm/01-overview.md') },
            { label: 'Deep Learning & VLA', href: w('03-domains/03-model-algorithm/02-deep-learning-vla.md') },
          ],
        },
        {
          id: 'model-training',
          label: 'Model Training',
          children: [
            { label: 'Overview', href: w('03-domains/04-model-training/01-overview.md') },
            { label: 'Teleops', href: w('03-domains/04-model-training/02-teleops.md') },
            { label: 'Behavior Cloning', href: w('03-domains/04-model-training/03-behavior-cloning.md') },
            { label: 'Robot Learning (RL)', href: w('03-domains/04-model-training/04-robot-learning-rl.md') },
          ],
        },
        { label: 'Data & Scaling', href: w('03-domains/05-data-scaling/01-data-scaling.md') },
        { label: 'Simulation', href: w('03-domains/06-simulation-sim2real/01-simulation-sim2real.md') },
        { label: 'Evaluation', href: w('03-domains/07-evaluation/01-overview.md') },
        { label: 'Deployment', href: w('03-domains/08-deployment/01-deployment.md') },
        { label: 'Safety', href: w('03-domains/09-safety/01-overview.md') },
      ],
    },
    {
      label: 'Research',
      children: [
        { label: 'Overview', href: w('04-research/README.md') },
        { label: 'RT-2', href: w('04-research/rt-2.md') },
        { label: 'SmolVLM', href: w('04-research/smolvlm.md') },
      ],
    },
    {
      label: 'Industry',
      children: [
        { label: 'Overview', href: w('05-industry/README.md') },
        { label: 'Physical Intelligence', href: w('05-industry/01-physical-intelligence.md') },
        { label: 'Generalist', href: w('05-industry/02-generalist.md') },
        { label: '1x', href: w('05-industry/03-1x.md') },
        { label: 'Figure', href: w('05-industry/04-figure.md') },
      ],
    },
    {
      label: 'Glossary',
      children: [{ label: 'Overview', href: w('06-glossary/README.md') }],
    },
  ];
}
