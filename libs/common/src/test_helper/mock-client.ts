import { ClientProxy } from '@nestjs/microservices';


export type MockClient =
    Partial<
        Record<keyof ClientProxy, jest.Mock>
    >;

export const createMockClient = (): MockClient => ({
    send: jest.fn(),
});