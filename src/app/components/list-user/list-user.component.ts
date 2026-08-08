import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioResponse } from '../../models/usuario.model';

@Component({
  selector: 'app-lista-usuario',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css'
})
export class ListUserComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];
  usuariosFiltrados: UsuarioResponse[] = [];
  carregando: boolean = false;
  mensagemErro: string = '';
  termoPesquisa: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🔵 ngOnInit - Iniciando carregamento de usuários');
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    console.log('🔵 Iniciando requisição para listar usuários...');
    this.carregando = true;
    this.mensagemErro = '';
    this.cdr.detectChanges(); // Força detecção de mudança

    this.usuarioService.listar().subscribe({
      next: (response) => {
        console.log('✅ Usuários carregados:', response);
        this.usuarios = response;
        this.usuariosFiltrados = response;
        this.carregando = false;
        this.cdr.detectChanges(); // Força atualização da view
      },
      error: (error) => {
        console.error('❌ Erro ao carregar usuários:', error);
        this.mensagemErro = 'Erro ao carregar usuários. Tente novamente.';
        this.carregando = false;
        this.cdr.detectChanges(); // Força atualização da view
      }
    });
  }

  filtrarUsuarios(): void {
    const termo = this.termoPesquisa.toLowerCase().trim();
    
    if (termo === '') {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo)
      );
    }
    this.cdr.detectChanges();
  }

  // Métodos para serem implementados depois
  editarUsuario(id: number): void {
    console.log('Editar usuário ID:', id);
    // TODO: Implementar edição
  }

  excluirUsuario(id: number): void {
    console.log('Excluir usuário ID:', id);
    // TODO: Implementar exclusão
  }
}
