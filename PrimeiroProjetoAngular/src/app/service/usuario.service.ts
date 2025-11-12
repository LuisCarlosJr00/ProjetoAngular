import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, UsuarioResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  cadastrar(usuario: Usuario): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.apiUrl, usuario);
  }

  listar(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.apiUrl);
  }

  // pegar usuário pelo id
  buscarPorId(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  // atualizar usuário (PUT)
  atualizar(usuario: Usuario): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.apiUrl}/${usuario.id}`, usuario);
  }

  // deletar usuário (DELETE)
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}