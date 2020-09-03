import { TestBed } from '@angular/core/testing';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';

import { BetsService, listQuery, subscriptionQuery } from './bets.service';

describe('BetsService', () => {
  let service: BetsService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule]
    });
    service = TestBed.inject(BetsService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('expect an array of bets and subscription call', () => {
    service.getBets().subscribe(data => {
      expect(data.length).toEqual(2);
      expect(data[0].id).toEqual(1);
      expect(data[1].id).toEqual(2);
    });

    const op = controller.expectOne(listQuery);

    op.flush({
      data: [
        { id: 1 },
        { id: 1 }
      ]
    });

    service.liveBets();

    const op2 = controller.expectOne(subscriptionQuery);

    expect(op2).not.toBe(null);

    expect(service.query).not.toBe(null);
  });
});
