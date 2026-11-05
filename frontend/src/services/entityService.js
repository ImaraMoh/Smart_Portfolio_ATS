import api from './api';
import { fetchCached, invalidateCached } from './queryCache';

/**
 * Generic CRUD client factory mirroring the backend's crudFactory. Each
 * dashboard section (education, experience, skills, projects, volunteer)
 * gets list/create/update/remove for free from a single resource path.
 */
const entityService = (resourcePath) => {
  const cacheKey = `entity:${resourcePath}`;
  return {
    cacheKey,
    list: () => fetchCached(cacheKey, () => api.get(`/${resourcePath}`).then((r) => r.data.data)),
    create: (payload) => api.post(`/${resourcePath}`, payload).then((r) => { invalidateCached(cacheKey); invalidateCached('portfolio:mine'); return r.data.data; }),
    update: (id, payload) => api.put(`/${resourcePath}/${id}`, payload).then((r) => { invalidateCached(cacheKey); invalidateCached('portfolio:mine'); return r.data.data; }),
    remove: (id) => api.delete(`/${resourcePath}/${id}`).then((r) => { invalidateCached(cacheKey); invalidateCached('portfolio:mine'); return r.data; })
  };
};

export const educationService = entityService('education');
export const experienceService = entityService('experience');
export const skillService = entityService('skills');
export const projectService = entityService('projects');
export const volunteerService = entityService('volunteer');
