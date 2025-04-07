//src/middlewares/aclCheck.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendErrorResponse } from '../helpers/responseHelper';
import { getAdminDetails } from '../services/admin/adminService';
import { ResponseMessageKey } from '../constants';

interface AdminDetails {
  admin_group: string | null;
  admin_group_id: number | null;
  admin_permission: string | null;
}

const checkSuperUser = (admin: AdminDetails) => {
  return admin.admin_group === 'Super Users' && admin.admin_group_id === 1;
};

const checkModulePermission = (data: string, module_name: string, action_type: string) => {
  const permissions = JSON.parse(data);
  if (permissions[module_name] !== undefined) {
    let actionArray = Object.values(permissions[module_name]);
    return actionArray.includes(action_type);
  }
  return false;
};

// Factory function to create the ACL middleware
const aclCheck = (module_name: string, action_type: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return sendErrorResponse(res, 'UNAUTHORIZED', req, undefined, null, 401);
    }

    const userDetail = jwt.decode(token);
    if (!userDetail || typeof userDetail === 'string') {
      return sendErrorResponse(res, 'UNAUTHORIZED', req, undefined, null, 401);
    }

    const userId = userDetail.id;
    if (!userId) {
      return sendErrorResponse(res, 'UNAUTHORIZED', req, undefined, null, 401);
    }

    const adminDetails = await getAdminDetails(userId);
    if (typeof adminDetails === 'object' && 'error' in adminDetails) {
      return sendErrorResponse(res, adminDetails.error as ResponseMessageKey, req, undefined, null, 401);
    }

    if (adminDetails && typeof adminDetails === 'object' && adminDetails.admin_permission) {
      const permissionString = adminDetails.admin_permission;
      if (checkSuperUser(adminDetails as AdminDetails)) {
        next();
      } else if (module_name === 'common') {
        next();
      } else if (checkModulePermission(permissionString, module_name, action_type)) {
        next();
      } else {
        return sendErrorResponse(res, 'UNAUTHORIZED', req, undefined, null, 403);
      }
    } else {
      return sendErrorResponse(res, 'UNAUTHORIZED', req, undefined, null, 403);
    }
  };
};

export default aclCheck;
