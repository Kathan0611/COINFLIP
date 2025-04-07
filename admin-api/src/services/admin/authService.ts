//src/services/admin/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/authConfig';
import commonConfig from '../../config/commonConfig';
import { emailConfig } from '../../helpers/emailHelper';
import { Admin, AdminGroup } from '../../models';

interface DecodedToken {
  id: number;
  iat: number;
  exp: number;
}

interface ResponseMessage {
  success?: string;
  error?: string;
}

// Sign-in logic
export const signinUser = async (email: string, password: string) => {
  const admin = await Admin.findOne({
    where: { email },
    include: [{ model: AdminGroup, as: 'admin_group' }],
  });
  if (!admin) return { error: 'USER_NOT_FOUND' };
  if (!admin.status) return { error: 'USER_INACTIVE' };

  const passwordIsValid = bcrypt.compareSync(password, admin.password);

  if (!passwordIsValid) return { error: 'INVALID_CREDENTIALS' };

  const token = jwt.sign({ id: admin.id }, authConfig.secret, {
    expiresIn: 86400,
  });

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    accessToken: token,
    admin_group: admin.admin_group?.admin_group_name ?? null,
    admin_group_id: admin.admin_group?.id ?? null,
    admin_permission: admin.admin_group?.permission ?? null,
  };
};

// Forgot password logic
export const sendForgotPasswordEmail = async (email: string) => {
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    return { error: 'USER_NOT_FOUND' };
  }
  const token = jwt.sign({ id: admin.id }, authConfig.forgot_secret, {
    expiresIn: 3600, // 1 hour
  });
  const viewPath = './src/emails/admin/auth';
  const emailTemplate = emailConfig(viewPath);
  await emailTemplate.send({
    template: 'forgot_password',
    message: {
      to: email,
    },
    locals: {
      logo_url: `${commonConfig.FRONT_URL}/assets/logo-sm.png`,
      name: admin.name,
      reset_url: `${commonConfig.FRONT_URL}/reset-password/${token}`,
      email_footer: commonConfig.EMAIL_FOOTER,
    },
  });

  return true;
};

// Reset password logic
export const resetPassword = (token: string, newPassword: string): Promise<ResponseMessage> => {
  return new Promise(resolve => {
    jwt.verify(token, authConfig.forgot_secret, (err, decoded) => {
      if (err) {
        resolve({ error: 'TOKEN_EXPIRED' });
        return;
      }

      if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        resolve({ error: 'TOKEN_EXPIRED' });
        return;
      }

      const { id } = decoded as DecodedToken;

      Admin.update({ password: bcrypt.hashSync(newPassword, 10) }, { where: { id } })
        .then(() => resolve({ success: 'PASSWORD_RESET' }))
        .catch(() => resolve({ error: 'UPDATE_FAILED' }));
    });
  });
};
