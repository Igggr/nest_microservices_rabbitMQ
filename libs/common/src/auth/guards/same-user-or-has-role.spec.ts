import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { SameUserOrHasRoleGuard } from './same-user-or-has-role-guard';

describe('', () => {
  let sameUserOrHasRoleGuard: SameUserOrHasRoleGuard;
  let reflector: Reflector;
  let mockExecutionContext;

  beforeEach(async () => {
    mockExecutionContext = createMock<ExecutionContext>();
    reflector = new Reflector();
    sameUserOrHasRoleGuard = new SameUserOrHasRoleGuard(reflector);
  });

  it('It should be defined', () => {
    expect(sameUserOrHasRoleGuard).toBeDefined();
  });

  it('Allow owner even without role', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['ADMIN']);
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
      params: {
        userId: 1,
      },
      user: {
        id: 1,
        roles: ['USER'],
      },
    });
    expect(sameUserOrHasRoleGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it("But non-owner without role shouldn't be allowed", () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['ADMIN']);
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
      params: {
        userId: 1,
      },
      user: {
        id: 2,
        roles: ['USER'],
      },
    });
    expect(sameUserOrHasRoleGuard.canActivate(mockExecutionContext)).toBe(
      false,
    );
  });

  it('Non-owner is allowed only if he has role', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['ADMIN']);
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
      params: {
        userId: 1,
      },
      user: {
        id: 2,
        roles: ['USER', 'ADMIN'],
      },
    });
    expect(sameUserOrHasRoleGuard.canActivate(mockExecutionContext)).toBe(true);
  });
});
