const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Generates a unique-ish slug by appending a short random suffix if needed
const generateUniqueSlug = async (Model, baseText) => {
  const base = slugify(baseText) || 'user';
  let slug = base;
  let counter = 0;
  // eslint-disable-next-line no-await-in-loop
  while (await Model.exists({ portfolioSlug: slug })) {
    counter += 1;
    slug = `${base}-${counter}`;
  }
  return slug;
};

module.exports = { slugify, generateUniqueSlug };
