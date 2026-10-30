export const PAGES = [
  { id: 'couverture', no: '01', fr: 'La couverture', cn: '封面', short: 'Couverture', menu: 'Couverture' },
  { id: 'atelier', no: '02', fr: 'L’atelier', cn: '创作台', short: 'Atelier', menu: 'Atelier' },
  { id: 'inspiration', no: '03', fr: 'L’inspiration', cn: '灵感', short: 'Inspiration', menu: 'Inspiration' },
  { id: 'maison', no: '04', fr: 'La maison', cn: '关于', short: 'À propos', menu: 'Maison' },
];

export function pageById(id) {
  return PAGES.find((page) => page.id === id) || PAGES[0];
}

export function pageIndex(id) {
  return Math.max(0, PAGES.findIndex((page) => page.id === id));
}

export function pageFromHash(hash = '') {
  const value = hash.replace(/^#\/?/, '').trim();
  return PAGES.some((page) => page.id === value) ? value : PAGES[0].id;
}
