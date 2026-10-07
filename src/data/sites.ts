import { z } from 'zod';
import rawData from './sites.yaml';

const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  subtitle: z.string().optional(),
  internal: z.string().optional(),
  intro: z.string(),
  tagline: z.string(),
});

const SiteSchema = z.object({
  domain: z.string(),
  group: z.string(),
  description: z.string().max(120),
  languages: z.array(z.enum(['sv', 'da', 'no', 'nl', 'en', 'multi'])).min(1),
  status: z.enum(['live', 'building']).default('live'),
  url: z.string().url(),
  featured: z.boolean().default(false),
  showcase: z.boolean().default(false),
  hidden: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

const DataSchema = z.object({
  groups: z.array(GroupSchema),
  sites: z.array(SiteSchema),
});

const parsed = DataSchema.parse(rawData);

const groupIds = new Set(parsed.groups.map(g => g.id));
for (const site of parsed.sites) {
  if (!groupIds.has(site.group)) {
    throw new Error(
      `sites.yaml: domain "${site.domain}" has unknown group "${site.group}". Valid groups: ${[...groupIds].join(', ')}`
    );
  }
}

for (const group of parsed.groups) {
  const showcaseCount = parsed.sites.filter(s => s.group === group.id && s.showcase && !s.hidden).length;
  if (showcaseCount > 4) {
    console.warn(`sites.yaml: group "${group.id}" has ${showcaseCount} showcase sites (max 4 recommended).`);
  }
}

export const groups = parsed.groups;
export const sites = parsed.sites;

export function getVisibleSites() {
  return parsed.sites.filter(s => !s.hidden);
}
export function getFeaturedSites() {
  return parsed.sites.filter(s => s.featured && !s.hidden);
}
export function getSitesByGroup(groupId: string) {
  return parsed.sites.filter(s => s.group === groupId && !s.hidden);
}
export function getGroupsWithSites() {
  return parsed.groups.filter(g => getSitesByGroup(g.id).length > 0);
}
export function getShowcaseSitesByGroup(groupId: string) {
  return parsed.sites.filter(s => s.group === groupId && s.showcase && !s.hidden);
}
