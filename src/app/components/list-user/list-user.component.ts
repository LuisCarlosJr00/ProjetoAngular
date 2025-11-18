import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../service/usuario.service';
import { UsuarioResponse } from '../../models/usuario.model';
import { tick } from '@angular/core/testing';
import { NavbarComponent } from "../navbar/navbar.component";



@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];
  usuariosFiltrados: UsuarioResponse[] = [];
  carregando: boolean = false;
  mensagemErro: string = '';
  mensagemSucesso: string = '';
  termoPesquisa: string = '';
  idEdicao?: number;

  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  constructor() {}

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
    // navegar para o formulário com id como param
    this.router.navigate(['/register', id]);
  }


  excluirUsuario(id: number): void {
    const confirma = confirm('Tem certeza que deseja excluir este usuário?');
    if (!confirma) {
      return;
    }
    
    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.usuarioService.deletar(id).subscribe({
      next: () => {
        // Remover usuário da lista localmente
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
        this.usuariosFiltrados = this.usuariosFiltrados.filter(usuario => usuario.id !== id);
        this.mensagemSucesso = 'Usuário excluído com sucesso!';
        console.log('✅ Usuário excluído com sucesso');
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Erro ao excluir usuário:', error);
        this.mensagemErro = 'Erro ao excluir usuário. Tente novamente.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
