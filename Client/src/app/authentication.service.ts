import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface UserDetails{
  _id: string ;
  email: string;
  name: string;
  exp: number;
}

export interface TokenPayLoad{
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;
  constructor(private http: HttpClient, private router: Router) { }

  private setToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public register(user: TokenPayLoad): string{
   return 'test';
  }
}
