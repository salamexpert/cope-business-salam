// Service catalog (static data, not stored in DB)
export const mockServices = [
  {
    id: 1,
    name: 'SEO Optimization',
    description: 'Comprehensive SEO strategy to improve your search rankings',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    plans: [
      { tier: 'Basic', price: 299, description: 'Basic keyword research and on-page optimization' },
      { tier: 'Standard', price: 599, description: 'Keyword research, on-page, technical SEO, and link building' },
      { tier: 'Premium', price: 1199, description: 'Full service including monthly reporting and strategy adjustments' }
    ]
  },
  {
    id: 2,
    name: 'Content Writing',
    description: 'Professional blog posts, articles, and web content creation',
    category: 'Content',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    plans: [
      { tier: 'Basic', price: 149, description: '5 blog posts (500 words each)' },
      { tier: 'Standard', price: 349, description: '10 blog posts (1000 words each) + keyword research' },
      { tier: 'Premium', price: 699, description: '20 blog posts + keyword research + monthly strategy' }
    ]
  },
  {
    id: 3,
    name: 'Social Media Management',
    description: 'Post scheduling, content creation, and community management',
    category: 'Social',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    plans: [
      { tier: 'Basic', price: 199, description: 'Posting to 2 social media platforms (4 posts per week)' },
      { tier: 'Standard', price: 399, description: 'Posting to 4 platforms + basic analytics (8 posts per week)' },
      { tier: 'Premium', price: 799, description: 'All platforms + full analytics + community engagement (daily)' }
    ]
  },
  {
    id: 4,
    name: 'Web Design',
    description: 'Custom website design and development',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    plans: [
      { tier: 'Basic', price: 999, description: '5-page static website' },
      { tier: 'Standard', price: 1999, description: '10-page website with CMS integration' },
      { tier: 'Premium', price: 3999, description: 'Custom e-commerce solution with full functionality' }
    ]
  }
];
