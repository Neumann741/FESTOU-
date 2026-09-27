import { Festa } from '../models/festa';

export function criarFestasMock(hoje = new Date()): Festa[] {
  const data = (dias: number) => {
    const dia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias);
    return `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, '0')}-${String(dia.getDate()).padStart(2, '0')}`;
  };
  const sabado = (6 - hoje.getDay() + 7) % 7;
  const festas: Omit<Festa, 'cidade' | 'descricao' | 'imagem'>[] = [
    { id: 1, nome: 'Festou Night', local: 'Centro', latitude: -26.9194, longitude: -49.0661, categoria: 'Eletrônica', data: data(0), horario: '23:00', preco: 40, pessoasConfirmadas: 128, tipo: 'publica' },
    { id: 2, nome: 'Quintal do Pagode', local: 'Ponta Aguda', latitude: -26.916, longitude: -49.058, categoria: 'Pagode', data: data(0), horario: '19:00', preco: 0, pessoasConfirmadas: 86, tipo: 'publica' },
    { id: 3, nome: 'Sertanejo & Amigos', local: 'Vila Nova', latitude: -26.901, longitude: -49.085, categoria: 'Sertanejo', data: data(1), horario: '21:00', preco: 35, pessoasConfirmadas: 94, tipo: 'privada' },
    { id: 4, nome: 'Rock na Vila', local: 'Velha', latitude: -26.923, longitude: -49.091, categoria: 'Rock', data: data(sabado), horario: '20:00', preco: 25, pessoasConfirmadas: 67, tipo: 'publica' },
    { id: 5, nome: 'Baile Dourado', local: 'Itoupava Seca', latitude: -26.89, longitude: -49.074, categoria: 'Funk', data: data(sabado), horario: '22:00', preco: 30, pessoasConfirmadas: 152, tipo: 'privada' },
    { id: 6, nome: 'Festival das Luzes', local: 'Garcia', latitude: -26.95, longitude: -49.068, categoria: 'Festival', data: data(sabado + 1), horario: '17:00', preco: 60, pessoasConfirmadas: 240, tipo: 'publica' },
    { id: 7, nome: 'Open Bar Sunset', local: 'Vila Germânica', latitude: -26.915, longitude: -49.082, categoria: 'Open Bar', data: data(2), horario: '18:00', preco: 90, pessoasConfirmadas: 310, tipo: 'publica', limiteParticipantes: 500 },
    { id: 8, nome: 'Blumenau de Portas Abertas', local: 'Parque Ramiro', latitude: -26.912, longitude: -49.078, categoria: 'Abertas', data: data(3), horario: '15:00', preco: 0, pessoasConfirmadas: 184, tipo: 'publica' },
    { id: 9, nome: 'Festou Music Festival', local: 'Setor Norte', latitude: -26.905, longitude: -49.067, categoria: 'Eventos', data: data(sabado + 7), horario: '16:00', preco: 140, pessoasConfirmadas: 820, tipo: 'publica', eventoGrande: true, organizadora: 'Festou Produções', limiteParticipantes: 2000 },
    { id: 10, nome: 'Summer Beats', local: 'Arena Blumenau', latitude: -26.928, longitude: -49.055, categoria: 'Eventos', data: data(sabado + 14), horario: '14:00', preco: 180, pessoasConfirmadas: 1250, tipo: 'publica', eventoGrande: true, organizadora: 'Live Stage Brasil', limiteParticipantes: 3500 },
    { id: 11, nome: 'Open Bar Universitário', local: 'Itoupava Norte', latitude: -26.887, longitude: -49.076, categoria: 'Open Bar', data: data(8), horario: '22:00', preco: 75, pessoasConfirmadas: 276, tipo: 'privada', limiteParticipantes: 400 },
    { id: 12, nome: 'Encontro Cultural Aberto', local: 'Centro Histórico', latitude: -26.918, longitude: -49.061, categoria: 'Abertas', data: data(10), horario: '11:00', preco: 0, pessoasConfirmadas: 133, tipo: 'publica' },
  ];

  return festas.map((festa, index) => ({ ...festa, cidade: 'Blumenau', descricao: 'Uma noite para celebrar e encontrar amigos. Evento fictício para demonstração.', imagem: `assets/img${(index % 6) + 1}.jpg` }));
}
