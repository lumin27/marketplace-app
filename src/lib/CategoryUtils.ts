export function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and");
}

export function slugToCategory(
  slug: string,
  categories: { id: string; name: string }[]
): string {
  const map: Record<string, string> = {};
  categories.forEach((cat) => {
    map[toSlug(cat.name)] = cat.name;
  });

  return (
    map[slug] ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
}

export function getCategoryUrl(categoryName: string): string {
  return `/browse?category=${toSlug(categoryName)}`;
}
