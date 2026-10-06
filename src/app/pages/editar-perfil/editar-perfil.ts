import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../services/usuario';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-editar-perfil',
  styleUrl: './editar-perfil.css',
  templateUrl: './editar-perfil.html',
})
export class EditarPerfil {
  private readonly usuario = inject(Usuario);
  private readonly router = inject(Router);
  dados = { ...this.usuario.perfil() };
  mensagem = '';

  salvar(): void {
    const nome = this.dados.nome.trim();
    const foto = this.dados.foto.trim();
    if (nome.length < 3 || nome.length > 60) {
      this.mensagem = 'Use um nome entre 3 e 60 caracteres.';
      return;
    }
    if (foto) {
      try {
        if (!['http:', 'https:'].includes(new URL(foto).protocol)) throw new Error();
      } catch {
        this.mensagem = 'Use um link de imagem começando com http:// ou https://.';
        return;
      }
    }
    this.usuario.salvar({
      nome,
      foto,
      bio: this.dados.bio.trim().slice(0, 180),
      estilos: this.dados.estilos.trim().slice(0, 120),
    });
    void this.router.navigate(['/perfil']);
  }
}
