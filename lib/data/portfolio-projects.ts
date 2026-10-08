export type PortfolioProject = {
  id: string;
  slug: string;
  category: string;
  name: string;
  description?: string;
  images: {
    col1a: string;
    col1b: string;
    col2: string;
  };
  liveUrl?: string;
  githubUrl?: string;
};

export const portfolioProjects: PortfolioProject[] = [];
