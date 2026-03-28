import type { Locale } from './i18n';
import { i18n } from './i18n';

export type WikiNavItem = { label: string; href?: string; children?: WikiNavItem[]; id?: string };

export function getWikiNav(locale: Locale, base: string): WikiNavItem[] {
  const prefix = `${base}/${locale}`;
  const s = i18n[locale]?.sidebar ?? i18n.en.sidebar;
  const w = (path: string) => {
    const clean = path.replace(/\/+$/, '').replace(/\.md$/, '');
    return `${prefix}/wiki/${clean}/`;
  };
  return [
    { label: s.wikiDocs, children: [{ label: s.home, href: `${prefix}/` }] },
    { label: s.companyGroup, children: [{ label: s.companyAbout, href: w('01-company/about.md') }] },
    {
      label: 'Product',
      children: [
        { label: s.productOverview, href: w('02-product') },
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
        { label: 'Overview', href: w('03-domains') },
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
            { label: 'ML Fundamentals', href: w('03-domains/02-model-class/02-ml-fundamentals.md') },
            { label: 'LLM', href: w('03-domains/02-model-class/03-llm.md') },
            { label: 'VLM', href: w('03-domains/02-model-class/04-vlm.md') },
            { label: 'VLA', href: w('03-domains/02-model-class/05-vla.md') },
          ],
        },
        {
          id: 'model-algorithm',
          label: 'Model Algorithm (VLA deepdive)',
          children: [
            { label: 'Overview', href: w('03-domains/03-model-algorithm/01-overview.md') },
            { label: 'DL Foundations', href: w('03-domains/03-model-algorithm/02-deep-learning-vla.md') },
            { label: 'Perception Inputs', href: w('03-domains/03-model-algorithm/03-perception-inputs.md') },
            { label: 'Multimodal Fusion', href: w('03-domains/03-model-algorithm/04-multimodal-fusion.md') },
            { label: 'Action Space', href: w('03-domains/03-model-algorithm/05-action-space.md') },
            { label: 'Action Heads', href: w('03-domains/03-model-algorithm/06-action-heads.md') },
            { label: 'Action Chunking', href: w('03-domains/03-model-algorithm/07-action-chunking.md') },
            { label: 'Policy Architectures', href: w('03-domains/03-model-algorithm/08-policy-architectures.md') },
            { label: 'Training Strategies', href: w('03-domains/03-model-algorithm/09-training-strategies.md') },
            { label: 'Generalization', href: w('03-domains/03-model-algorithm/10-generalization.md') },
            { label: 'Inference & Deployment', href: w('03-domains/03-model-algorithm/11-inference-deployment.md') },
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
        { label: 'Overview', href: w('04-research') },
        {
          id: 'research-foundations',
          label: 'Architecture & VL',
          children: [
            { label: 'Attention Is All You Need', href: w('04-research/attention-is-all-you-need.md') },
            { label: 'CLIP', href: w('04-research/clip.md') },
            { label: 'SmolVLM', href: w('04-research/smolvlm.md') },
          ],
        },
        {
          id: 'research-policy-vla',
          label: 'Policy & VLA',
          children: [
            { label: 'Diffusion Policy', href: w('04-research/diffusion-policy.md') },
            { label: 'ACT', href: w('04-research/act.md') },
            { label: 'RT-2', href: w('04-research/rt-2.md') },
            { label: 'Octo', href: w('04-research/octo.md') },
            { label: 'OpenVLA', href: w('04-research/openvla.md') },
            { label: 'π0', href: w('04-research/pi0.md') },
          ],
        },
        {
          id: 'research-datasets',
          label: 'Datasets',
          children: [
            { label: 'Bridge / DROID', href: w('04-research/bridge-droid.md') },
            { label: 'OXE', href: w('04-research/oxe.md') },
          ],
        },
      ],
    },
    {
      label: 'Industry',
      children: [
        { label: 'Overview', href: w('05-industry') },
        { label: 'Competitive Landscape', href: w('05-industry/00-landscape.md') },
        {
          id: 'industry-model-first',
          label: 'Model-first',
          children: [
            { label: 'Physical Intelligence', href: w('05-industry/01-physical-intelligence.md') },
            { label: 'Generalist', href: w('05-industry/02-generalist.md') },
            { label: 'NVIDIA GR00T', href: w('05-industry/08-nvidia-groo-t.md') },
          ],
        },
        {
          id: 'industry-hardware-first',
          label: 'Hardware-first',
          children: [
            { label: '1x', href: w('05-industry/03-1x.md') },
            { label: 'Figure', href: w('05-industry/04-figure.md') },
            { label: 'Agility Robotics', href: w('05-industry/05-agility.md') },
            { label: 'Boston Dynamics', href: w('05-industry/06-boston-dynamics.md') },
            { label: 'Unitree Robotics', href: w('05-industry/07-unitree.md') },
            { label: 'Apptronik', href: w('05-industry/09-apptronik.md') },
            { label: 'Machina Labs', href: w('05-industry/10-machina-labs.md') },
          ],
        },
      ],
    },
    {
      label: 'Glossary',
      children: [{ label: 'Overview', href: w('06-glossary') }],
    },
  ];
}
