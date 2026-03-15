import { defineCollection } from 'astro:content';

const wiki = defineCollection({
  type: 'content',
});

export const collections = {
  wiki,
};
