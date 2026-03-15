export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const i18n: Record<
  Locale,
  {
    nav: { wiki: string; news: string; aboutMe: string; drawerTitle: string };
    sidebar: { home: string; wikiDocs: string; companyGroup: string; companyAbout: string; productOverview: string };
    home: { title: string; lead: string; intro: string; newsLink: string; browseLabel: string };
    toc: { onThisPage: string; createdBy: string; lastEditedBy: string; lastEdited: string };
    about: { title: string; role: string; education: string; experience: string; focus: string };
    news: { title: string; lead: string };
    dirNames: Record<string, string>;
  }
> = {
  en: {
    nav: { wiki: 'Wiki', news: 'News', aboutMe: 'About me', drawerTitle: 'Menu' },
    sidebar: {
      home: 'Wiki home',
      wikiDocs: 'Wiki',
      companyGroup: 'Company',
      companyAbout: 'About Config',
      productOverview: 'Product overview',
    },
    home: {
      title: 'Config Wiki',
      lead: 'Company, domain, research, and industry knowledge in one place. Updated as we learn and research.',
      intro: 'Use the sidebar to browse by topic, or jump to a section below.',
      newsLink: 'News — scraping & summaries',
      browseLabel: 'Browse by section',
    },
    toc: {
      onThisPage: 'On this page',
      createdBy: 'Created by',
      lastEditedBy: 'Last edited by',
      lastEdited: 'Last edited',
    },
    about: {
      title: 'About me',
      role: 'Product Owner @ Toss → Head of Product @ Config (2026.04)',
      education: 'Education',
      experience: 'Experience',
      focus: 'Focus',
    },
    news: {
      title: 'News',
      lead: 'News & paper scraping & summaries. Update wiki-site/src/data/news.json via automation/scripts to reflect here.',
    },
    dirNames: {
      root: 'Wiki',
      company: 'Company',
      product: 'Product',
      domains: 'Domains',
      research: 'Research',
      industry: 'Industry',
      glossary: 'Glossary',
      'safety-eval': 'Safety & Evaluation',
    },
  },
  ko: {
    nav: { wiki: 'Wiki', news: 'News', aboutMe: '소개', drawerTitle: '메뉴' },
    sidebar: {
      home: 'Wiki 홈',
      wikiDocs: 'Wiki',
      companyGroup: 'Company',
      companyAbout: 'Config 소개',
      productOverview: 'Product 개요',
    },
    home: {
      title: 'Config Wiki',
      lead: '회사·도메인·리서치·산업 지식을 한곳에서. 학습·조사한 내용을 실시간으로 반영합니다.',
      intro: '왼쪽 사이드바에서 주제별로 둘러보거나, 아래 섹션으로 바로 이동할 수 있습니다.',
      newsLink: 'News — 뉴스·논문 스크래핑 & 요약',
      browseLabel: '섹션별 보기',
    },
    toc: {
      onThisPage: 'On this page',
      createdBy: 'Created by',
      lastEditedBy: 'Last edited by',
      lastEdited: 'Last edited',
    },
    about: {
      title: '소개',
      role: 'Product Owner @ Toss → Head of Product @ Config (2026.04)',
      education: 'Education',
      experience: 'Experience',
      focus: 'Focus',
    },
    news: {
      title: 'News',
      lead: '뉴스·논문 스크래핑 & 요약. automation/scripts에서 wiki-site/src/data/news.json을 갱신하면 여기에 반영됩니다.',
    },
    dirNames: {
      root: 'Wiki',
      company: 'Company',
      product: 'Product',
      domains: 'Domains',
      research: 'Research',
      industry: 'Industry',
      glossary: 'Glossary',
      'safety-eval': 'Safety & Evaluation',
    },
  },
};
