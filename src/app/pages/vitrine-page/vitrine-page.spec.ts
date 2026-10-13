import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VitrinePage } from './vitrine-page';

describe('VitrinePage', () => {
  let component: VitrinePage;
  let fixture: ComponentFixture<VitrinePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitrinePage],
    }).compileComponents();

    fixture = TestBed.createComponent(VitrinePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
