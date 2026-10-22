// To add an artist: copy one block below, change it, paste the artist's SVG into `svg`.
const ARTISTS = [
  {
    id: 'example-artist',
    name: 'Example Artist',
    aliases: ['The Example'],
    years: '2001–present',
    verified: false,
    license: { name: 'Own work', url: '', status: 'redistributable' },
    source: { provider: 'self', url: '' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260"><path d="M60 170C90 60 130 60 120 150S150 200 190 110 230 60 250 150 300 190 340 100 390 80 400 160 450 200 540 90" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'sample-band',
    name: 'Sample Band',
    aliases: [],
    years: '',
    verified: false,
    license: { name: 'Own work', url: '', status: 'redistributable' },
    source: { provider: 'self', url: '' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260"><path d="M70 190C100 70 140 70 130 170M130 120C200 100 230 100 240 150S300 190 330 120 380 90 380 170M400 140C470 110 520 120 540 80" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'kim-chaewon',
    name: 'Kim Chaewon',
    aliases: ['Chaewon of LE SSERAFIM'],
    years: '2018–present',
    verified: true,
    license: { name: 'Own work', url: '', status: 'redistributable' },
    source: { provider: 'HYBE', url: '' },
    svg:https://github.com/cactusjuicewater-debug/Sign.API/blob/3801e9b4781b51387287cbc046e2ad5d8467c537/Untitled7_20261020181156.svg



const norm = (s) =>
  String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const keys = (a) => [a.name, ...(a.aliases || [])].map(norm);

function lookup(name) {
  const full = String(name || '');
  const parts = full.split(/,|;|&|\bfeat\.?|\bft\.?/i);
  const cands = [full, ...parts].map(norm).filter(Boolean);
  for (const q of cands) {
    const hit = ARTISTS.find((a) => keys(a).includes(q));
    if (hit) return { one: hit };
