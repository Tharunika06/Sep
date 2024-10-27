import { TestBed } from '@angular/core/testing';

import { ExpenseSplitterService } from './expense-splitter.service';

describe('ExpenseSplitterService', () => {
  let service: ExpenseSplitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseSplitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
