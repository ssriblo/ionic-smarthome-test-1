import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetersPage } from './meters.page';

describe('MetersPage', () => {
  let component: MetersPage;
  let fixture: ComponentFixture<MetersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MetersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
