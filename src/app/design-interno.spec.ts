import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';

@Component({ template: '<p>Tela de teste</p>' })
class TelaTeste {}

describe('Navegação do design interno', () => {
  it('mantém a Home sem o menu e sem os estilos internos', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([
      { path: 'home-page', component: TelaTeste },
      { path: 'login', component: TelaTeste },
      { path: 'perfil', component: TelaTeste },
    ])] });
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/home-page');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.area-interna')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-navegacao-interna')).toBeNull();
    await router.navigateByUrl('/perfil');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-navegacao-interna')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.conteudo-interno')).not.toBeNull();
    await router.navigateByUrl('/home-page');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.area-interna')).toBeNull();
    await router.navigateByUrl('/login');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-navegacao-interna')).toBeNull();
    expect(fixture.nativeElement.querySelector('.area-interna')).toBeNull();
  });
});
