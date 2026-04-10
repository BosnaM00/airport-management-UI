import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFlights } from './search-flights';

describe('SearchFlights', () => {
  let component: SearchFlights;
  let fixture: ComponentFixture<SearchFlights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFlights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFlights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
