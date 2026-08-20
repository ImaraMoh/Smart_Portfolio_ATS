import api from './api';

/* ============================================================
   PORTFOLIO SERVICE
============================================================ */

export const portfolioService = {
  /* Get current user's portfolio */
  getMine: () =>
    api
      .get('/portfolio/me')
      .then((response) => response.data.data),

  /* Regenerate portfolio */
  regenerate: () =>
    api
      .post('/portfolio/regenerate')
      .then((response) => response.data.data),

  /* Change portfolio template */
  setTemplate: (templatePreference) =>
    api
      .put('/portfolio/template', {
        templatePreference,
      })
      .then((response) => response.data.data),

  /* Change portfolio color theme */
  setColorTheme: (colorTheme) =>
    api
      .put('/portfolio/color-theme', {
        colorTheme,
      })
      .then((response) => response.data.data),
};

/* ============================================================
   RESUME SERVICE
============================================================ */

export const resumeService = {
  downloadUrl: () =>
    `${
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api'
    }/resume/download`,

  regenerate: () =>
    api
      .post('/resume/regenerate')
      .then((response) => response.data.data),
};

/* ============================================================
   ATS SERVICE
============================================================ */

export const atsService = {
  score: (payload) =>
    api
      .post('/ats/score', payload)
      .then((response) => response.data.data),

  history: () =>
    api
      .get('/ats/history')
      .then((response) => response.data.data),
};

/* ============================================================
   USER SERVICE
============================================================ */

export const userService = {
  updateProfile: (payload) =>
    api
      .put('/users/me', payload)
      .then((response) => response.data.data),

  changePassword: (payload) =>
    api
      .put('/users/me/password', payload)
      .then((response) => response.data),
};
