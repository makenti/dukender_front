import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesDropdownComponent } from './entries-dropdown.component';

describe('EntriesDropdownComponent', () => {
  let component: EntriesDropdownComponent;
  let fixture: ComponentFixture<EntriesDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntriesDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntriesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
