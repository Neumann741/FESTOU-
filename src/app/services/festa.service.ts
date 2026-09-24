import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Festa } from '../models/festa';
import { criarFestasMock } from './festas.mock';

@Injectable({ providedIn: 'root' })
export class FestaService {
  getFestas(): Observable<Festa[]> {
    return of(criarFestasMock());
  }
}
