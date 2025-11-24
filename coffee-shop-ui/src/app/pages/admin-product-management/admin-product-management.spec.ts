import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductManagement } from './admin-product-management';

describe('AdminProductManagement', () => {
  let component: AdminProductManagement;
  let fixture: ComponentFixture<AdminProductManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
