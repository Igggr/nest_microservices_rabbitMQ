import { Test, TestingModule } from '@nestjs/testing';
import { HasRoleGuard } from './has-role-guard';
import { ExecutionContext } from '@nestjs/common';

export { HasRoleGuard } from './has-role-guard';

describe('', () => {
    let hasRoleGuard: HasRoleGuard;
    // const context: ExecutionContext = {
    //     // getClass() { return {}},
    // };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HasRoleGuard
            ],
        }).compile();  // bootstrap module

        hasRoleGuard =  module.get<HasRoleGuard>(HasRoleGuard)
    })
    it('It should be defined', () => {
        expect(hasRoleGuard).toBeDefined();
    });

    // it('', () => {
    //     expect(hasRoleGuard.canActivate(context)).toBe(true);
    // });
})