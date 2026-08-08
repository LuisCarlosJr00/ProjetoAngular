
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { cpfValidator, senhaValidator } from '../../validators/custom-validators';


@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm: FormGroup;
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  carregando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.registerForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, cpfValidator()]],
      senha: ['', [Validators.required, Validators.minLength(6), senhaValidator()]]
    });
  }

  get nome(): AbstractControl {
    return this.registerForm.get('nome')!;
  }

  get email(): AbstractControl {
    return this.registerForm.get('email')!;
  }

  get cpf(): AbstractControl {
    return this.registerForm.get('cpf')!;
  }

  get senha(): AbstractControl {
    return this.registerForm.get('senha')!;
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const apenasDigitos = input.value.replace(/\D/g, '').slice(0, 11);
    this.registerForm.get('cpf')?.setValue(apenasDigitos, { emitEvent: false });
    input.value = apenasDigitos;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.carregando = true;
      this.mensagemErro = '';
      this.mensagemSucesso = '';

      const usuario: Usuario = this.registerForm.value;

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
    } else {
      console.log('⚠️ Formulário inválido');
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
      this.registerForm.markAllAsTouched();
    }
  }
}
