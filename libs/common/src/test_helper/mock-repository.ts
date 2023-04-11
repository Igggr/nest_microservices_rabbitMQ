import { Repository } from 'typeorm';


export type MockRepository<T extends any> =
    Partial<
        Record<keyof Repository<T>, jest.Mock>
    >;

export const createMockRepository = <T extends any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});