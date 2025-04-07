import Admin from './Admin';
import AdminGroup from './AdminGroup';

// Define associations
Admin.belongsTo(AdminGroup, { foreignKey: 'admin_group_id', as: 'admin_group' });
AdminGroup.hasMany(Admin, { foreignKey: 'admin_group_id', as: 'admins' });

// Export models
export { Admin, AdminGroup };
