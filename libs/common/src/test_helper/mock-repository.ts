import { Repository } from 'typeorm';

export type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

export const createMockRepository = <T>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
