import { RolesBuilder } from 'nest-access-control';
import { Role } from '@prisma/client';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

RBAC_POLICY.grant(Role.student).readOwn('course');
