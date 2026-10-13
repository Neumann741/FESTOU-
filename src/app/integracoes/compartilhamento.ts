// Exceção: a área de transferência depende da API do navegador.
export function linkDaFesta(id: number): string {
  return window.location.origin + '/festa/' + id;
}

export function linkDoWhatsapp(nome: string, link: string): string {
  const texto = 'Bora para ' + nome + '? ' + link + ' (demonstração local)';
  return 'https://wa.me/?text=' + encodeURIComponent(texto);
}

export async function copiarLink(link: string): Promise<string> {
  try {
    await navigator.clipboard.writeText(link);
    return 'Link copiado!';
  } catch {
    return 'Não foi possível copiar automaticamente. Selecione o link abaixo e copie.';
  }
}
