import { HasRoleGuard } from './has-role-guard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
export { HasRoleGuard } from './has-role-guard';

describe('', () => {
  let hasRoleGuard: HasRoleGuard;
  let reflector: Reflector;
  let mockExecutionContext;

  beforeEach(async () => {
    mockExecutionContext = createMock<ExecutionContext>();
    reflector = new Reflector();
    hasRoleGuard = new HasRoleGuard(reflector);
  });

  it('It should be defined', () => {
    expect(hasRoleGuard).toBeDefined();
  });

  it('Allow user with role', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['ADMIN']);
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
      user: {
        id: 1,
        roles: ['USER', 'ADMIN'],
      },
    });
    expect(hasRoleGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('Will not allow user without role', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['ADMIN']);
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
      user: {
        id: 1,
        roles: ['USER'],
      },
    });
    expect(hasRoleGuard.canActivate(mockExecutionContext)).toBe(false);
  });

  it('Will not allow anonymus if any role is requires', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['USER']);
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({});
    expect(hasRoleGuard.canActivate(mockExecutionContext)).toBe(false);
  });
});
