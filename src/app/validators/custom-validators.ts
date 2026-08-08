import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function isValidCpf(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calcularDigito = (tamanho: number, pesoInicial: number): number => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += parseInt(cpf[i], 10) * (pesoInicial - i);
    }
    const resto = 11 - (soma % 11);
    return resto >= 10 ? 0 : resto;
  };

  const primeiroDigito = calcularDigito(9, 10);
  if (primeiroDigito !== parseInt(cpf[9], 10)) {
    return false;
  }

  const segundoDigito = calcularDigito(10, 11);
  return segundoDigito === parseInt(cpf[10], 10);
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const cpf = String(value).replace(/\D/g, '');

    if (cpf.length !== 11) {
      return { cpfTamanho: true };
    }

    if (!isValidCpf(cpf)) {
      return { cpfInvalido: true };
    }

    return null;
  };
}

export function senhaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    if (!/^[A-Za-z0-9]+$/.test(value)) {
      return { senhaCaracteresInvalidos: true };
    }

    const temLetra = /[A-Za-z]/.test(value);
    const temNumero = /[0-9]/.test(value);
    if (!temLetra || !temNumero) {
      return { senhaFraca: true };
    }

    return null;
  };
}
