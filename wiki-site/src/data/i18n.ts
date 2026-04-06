export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const i18n: Record<
  Locale,
  {
    nav: {
      wiki: string;
      news: string;
      aboutMe: string;
      drawerTitle: string;
      themeSelect: string;
      themeLightLabel: string;
      themeDarkLabel: string;
      themeSystemLabel: string;
    };
    sidebar: { home: string; wikiDocs: string; companyGroup: string; companyAbout: string; productOverview: string };
    home: { title: string; lead: string; intro: string; newsLink: string; browseLabel: string };
    toc: { onThisPage: string; createdBy: string; lastEditedBy: string; lastEdited: string };
    about: {
      title: string;
      role: string;
      education: string;
      experience: string;
      focus: string;
      focusDesc: string;
      totalExperience: string;
      degree: string;
      highSchool: string;
      highSchoolMajor: string;
    };
    news: { title: string; lead: string };
    dirNames: Record<string, string>;
  }
> = {
  en: {
    nav: {
      wiki: 'Wiki',
      news: 'News',
      aboutMe: 'About me',
      drawerTitle: 'Menu',
      themeSelect: 'Color theme',
      themeLightLabel: 'Light',
      themeDarkLabel: 'Dark',
      themeSystemLabel: 'System',
    },
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
      title: 'Tony Lee',
      role: 'Head of Product @ Config Intelligence Inc.',
      education: 'Education',
      experience: 'Experience',
      focus: 'Focus',
      focusDesc: 'AI, LLM, VLA, robotics—learning and tracking industry research. Using this wiki to organize company knowledge, domains, and news; and Claude/Claude Code for workflow automation.',
      totalExperience: 'Total experience ≈ 10 years 3 months',
      degree: 'B.S. Chemical Engineering',
      highSchool: 'Daewon Foreign Language High School',
      highSchoolMajor: 'French major',
    },
    news: {
      title: 'News',
      lead: 'Daily AI news summaries from news.smol.ai, updated automatically every morning.',
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
    nav: {
      wiki: 'Wiki',
      news: 'News',
      aboutMe: '소개',
      drawerTitle: '메뉴',
      themeSelect: '색 테마',
      themeLightLabel: '라이트',
      themeDarkLabel: '다크',
      themeSystemLabel: '시스템',
    },
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
      title: '이광현',
      role: 'Head of Product @ Config Intelligence Inc.',
      education: '학력',
      experience: '경력',
      focus: '관심 분야',
      focusDesc: 'AI, LLM, VLA, 로봇공학—산업 리서치 학습 및 추적. 이 위키로 회사 지식, 도메인, 뉴스를 정리하고, Claude/Claude Code로 워크플로우 자동화를 진행합니다.',
      totalExperience: '총 경력 약 10년 3개월',
      degree: '화학공학 학사',
      highSchool: '대원외국어고등학교',
      highSchoolMajor: '프랑스어과',
    },
    news: {
      title: 'News',
      lead: 'news.smol.ai의 AI 뉴스를 매일 아침 자동으로 요약합니다.',
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
