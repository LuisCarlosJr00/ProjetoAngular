import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioResponse } from '../../models/usuario.model';
import { cpfValidator, senhaValidator } from '../../validators/custom-validators';

@Component({
  selector: 'app-lista-usuario',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css'
})
export class ListUserComponent implements OnInit {
  usuarios: UsuarioResponse[] = [];
  usuariosFiltrados: UsuarioResponse[] = [];
  carregando: boolean = false;
  mensagemErro: string = '';
  termoPesquisa: string = '';

  usuarioEditando: UsuarioResponse | null = null;
  editForm: FormGroup;
  salvandoEdicao: boolean = false;
  mensagemErroEdicao: string = '';

  usuarioExcluindo: UsuarioResponse | null = null;
  excluindo: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, cpfValidator()]],
      senha: ['', [senhaValidator()]]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.mensagemErro = '';
    this.cdr.detectChanges();

    this.usuarioService.listar().subscribe({
      next: (response) => {
        this.usuarios = response;
        this.usuariosFiltrados = response;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.mensagemErro = 'Erro ao carregar usuários. Tente novamente.';
        this.carregando = false;
        this.cdr.detectChanges();
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

  get nomeEdit(): AbstractControl {
    return this.editForm.get('nome')!;
  }

  get emailEdit(): AbstractControl {
    return this.editForm.get('email')!;
  }

  get cpfEdit(): AbstractControl {
    return this.editForm.get('cpf')!;
  }

  get senhaEdit(): AbstractControl {
    return this.editForm.get('senha')!;
  }

  onCpfInputEdit(event: Event): void {
    const input = event.target as HTMLInputElement;
    const apenasDigitos = input.value.replace(/\D/g, '').slice(0, 11);
    this.editForm.get('cpf')?.setValue(apenasDigitos, { emitEvent: false });
    input.value = apenasDigitos;
  }

  editarUsuario(usuario: UsuarioResponse): void {
    this.usuarioEditando = usuario;
    this.mensagemErroEdicao = '';
    this.editForm.reset({
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      senha: ''
    });
  }

  cancelarEdicao(): void {
    this.usuarioEditando = null;
    this.mensagemErroEdicao = '';
  }

  salvarEdicao(): void {
    if (!this.usuarioEditando) {
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.mensagemErroEdicao = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.salvandoEdicao = true;
    this.mensagemErroEdicao = '';

    const { nome, email, cpf, senha } = this.editForm.value;
    const payload = {
      nome,
      email,
      cpf,
      senha: senha ? senha : null
    };

    this.usuarioService.atualizar(this.usuarioEditando.id, payload).subscribe({
      next: (atualizado) => {
        const index = this.usuarios.findIndex(u => u.id === atualizado.id);
        if (index !== -1) {
          this.usuarios[index] = atualizado;
        }
        this.filtrarUsuarios();
        this.salvandoEdicao = false;
        this.usuarioEditando = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao atualizar usuário:', error);
        this.mensagemErroEdicao = error.error?.error || error.error?.email || 'Erro ao atualizar usuário. Verifique os dados e tente novamente.';
        this.salvandoEdicao = false;
        this.cdr.detectChanges();
      }
    });
  }

  excluirUsuario(usuario: UsuarioResponse): void {
    this.usuarioExcluindo = usuario;
  }

  cancelarExclusao(): void {
    this.usuarioExcluindo = null;
  }

  confirmarExclusao(): void {
    if (!this.usuarioExcluindo) {
      return;
    }

    this.excluindo = true;
    const id = this.usuarioExcluindo.id;

    this.usuarioService.excluir(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.filtrarUsuarios();
        this.excluindo = false;
        this.usuarioExcluindo = null;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao excluir usuário:', error);
        this.mensagemErro = 'Erro ao excluir usuário. Tente novamente.';
        this.excluindo = false;
        this.usuarioExcluindo = null;
        this.cdr.detectChanges();
      }
    });
  }
}
