export const MAPA_CONFIG = {
  centro: [-26.9194, -49.0661] as [number, number],
  zoom: 13,
  zoomFesta: 16,
  raioKm: 5,
  tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  // Ativar somente quando a página /festa/:id existir.
  detalhesDisponiveis: false,
};
