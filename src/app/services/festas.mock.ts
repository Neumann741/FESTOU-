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
  ];

  return festas.map((festa, index) => ({ ...festa, cidade: 'Blumenau', descricao: 'Uma noite para celebrar e encontrar amigos. Evento fictício para demonstração.', imagem: `assets/img${index + 1}.jpg` }));
}
