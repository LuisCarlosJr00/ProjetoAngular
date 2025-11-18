
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../service/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NavbarComponent
],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  carregando: boolean = false;
  idEdicao?: number;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      cpf: ['', []],
      telefone: ['', []],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
  if (this.registerForm.valid) {
    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    const usuario: Usuario = this.registerForm.value;

    // Se estivermos em modo edição (this.editing definido), chama atualizar()
    if (this.idEdicao) {
      // garante que o objeto tenha o id para a API
      usuario.id = this.idEdicao;

      this.usuarioService.atualizar(usuario).subscribe({
        next: (response) => {
          console.log('✅ Usuário atualizado com sucesso:', response);
          this.mensagemSucesso = `Usuário ${response.nome} atualizado com sucesso!`;
          // opcional: resetar o form ou navegar para a lista
          this.registerForm.reset();
          this.router.navigate(['/list']); // Para redirecionar
          this.carregando = false;
        },
        error: (error) => {
          console.error('❌ Erro ao atualizar:', error);
          this.mensagemErro = error.error?.message || 'Erro ao atualizar usuário. Verifique os dados e tente novamente.';
          this.carregando = false;
        },
        complete: () => {
          console.log('🏁 Requisição de atualização finalizada');
        }
      });

    } else {
      // Modo criação (comportamento original)
      this.usuarioService.cadastrar(usuario).subscribe({
        next: (response) => {
          console.log('✅ Usuário cadastrado com sucesso:', response);
          this.mensagemSucesso = `Usuário ${response.nome} cadastrado com sucesso!`;
          this.registerForm.reset();
          this.carregando = false;
        },
        error: (error) => {
          console.error('❌ Erro ao cadastrar:', error);
          this.mensagemErro = error.error?.message || 'Erro ao cadastrar usuário. Verifique os dados e tente novamente.';
          this.carregando = false;
        },
        complete: () => {
          console.log('🏁 Requisição finalizada');
        }
      });
    }

  } else {
    console.log('⚠️ Formulário inválido');
    this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
    this.registerForm.markAllAsTouched();
  }

  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.idEdicao = id;
      this.carregando = true;
      this.usuarioService.buscarPorId(id).subscribe({
        next: (u) => {
          this.registerForm.patchValue({
            nome: u.nome,
            email: u.email,
            cpf: (u as any).cpf || '',
            telefone: (u as any).telefone || '',
            // não precisa preencher a senha ao editar
          });
          this.carregando = false;
        },
        error: (error) => {
          console.error('❌ Erro ao buscar usuário para edição:', error);
        }
      });
    }
  }
}

