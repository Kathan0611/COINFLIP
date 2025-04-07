//src/routes.js
import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AdminManagement = React.lazy(() => import('./views/pages/admin/list'))
const AdminCreateEdit = React.lazy(() => import('./views/pages/admin/createEdit'))
const AdminGroupList = React.lazy(() => import('./views/pages/admin-group/adminGroupList'))
const Profile = React.lazy(() => import('./views/pages/profile/index'))
const AdminGroupAdd = React.lazy(() => import('./views/pages/admin-group/adminGroupAdd'))
const AdminGroupEdit = React.lazy(() => import('./views/pages/admin-group/adminGroupEdit'))
const ForgotPasswordPage = React.lazy(() => import('./views/pages/forgot-password/forgot-password'))
const ReSetPasswordPage = React.lazy(() => import('./views/pages/reset-password/reset-password'))
const CMSPageList = React.lazy(() => import('./views/pages/cms-page/cms-pagelist'))
const AddEditCMSPage = React.lazy(
  () => import('./views/pages/cms-page/add-edit-cms/add-edit-cms-page'),
)
const Login = React.lazy(() => import('./views/pages/login/Login'))
const SlotMachine_Config = React.lazy(() => import('./views/pages/slot-machine/Slot_Config_Form'))
const Memory_Game_Config = React.lazy(() => import('./views/pages/Memory_Game/game_config'))
const SlotMachine_Loggs = React.lazy(() => import('./views/pages/slot-machine/User_Loggs'))
const Memory_Game_Loggs = React.lazy(() => import('./views/pages/Memory_Game/User_logs'))
const SpinConfig = React.lazy(() => import('./views/pages/spin/spin-config'))
const customerLogs = React.lazy(() => import('./views/pages/spin/customer-logs'))
const Plinko_Game_Config = React.lazy(() => import('./views/pages/Plinko_Game/configuration'))
const Plinko_Game_Logs = React.lazy(() => import('./views/pages/Plinko_Game/User_Logs'))
const coinFlip_Game_Config = React.lazy(() => import('./views/pages/coin-flip/add-edit-coin-flip'))
const coinFlip_Game_Logs = React.lazy(() => import('./views/pages/coin-flip/user-logs'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/groups', name: 'Groups', element: AdminGroupList },
  { path: '/profile', name: 'My Profile', element: Profile },
  { path: '/admins', name: 'Admins', element: AdminManagement },
  { path: '/admins/add', name: 'Add', element: AdminCreateEdit },
  { path: `/admins/edit/:id`, name: 'Edit', element: AdminCreateEdit },
  { path: '/login', name: 'LogIn', element: Login },
  { path: '/forgot-password', name: 'ForGotPassword', element: ForgotPasswordPage },
  { path: '/reset-password/:token', name: 'ResetPassword', element: ReSetPasswordPage },
  { path: '/cms', name: 'CMS', element: CMSPageList },
  { path: '/cms/add', name: 'Add CMS', element: AddEditCMSPage },
  { path: '/cms/edit/:id', name: 'Edit CMS', element: AddEditCMSPage },
  { path: '/slotmachine_config', name: 'Slot Machine Config', element: SlotMachine_Config },
  { path: '/slotmachine_logs', name: 'Slot Machine Logs', element: SlotMachine_Loggs },
  { path: '/memory_config', name: 'Memory Game Config', element: Memory_Game_Config },
  { path: '/memory_logs', name: 'Memory Game Logs', element: Memory_Game_Loggs },
  { path: `/spin_customer_logs`, name: 'Spin Game logs', element: customerLogs },
  // { path: `/blocked-numbers`, name: 'Blocked numbers', element: blockedCustomers },
  { path: `/spinconfig`, name: 'Spin Config', element: SpinConfig },

  { path: `/spinconfig/:id`, name: 'Spin Config', element: SpinConfig },
  { path: '/plinko_config', name: 'Plinko Config', element: Plinko_Game_Config },
  { path: '/plinko_logs', name: 'Plinko Logs', element: Plinko_Game_Logs },
  {
    path: '/coin_flip_config',
    exact: true,
    name: 'Coin Flip Config',
    element: coinFlip_Game_Config,
  },
  {
    path: '/coin_flip_logs',
    exact: true,
    name: 'Coin Flip Logs',
    element: coinFlip_Game_Logs,
  },

  {
    path: '/groups/add',
    exact: true,
    name: 'Add',
    element: AdminGroupAdd,
    module_name: 'admin_groups',
    action: 'create',
  },
  {
    path: '/groups/edit/:id',
    exact: true,
    name: 'Edit',
    element: AdminGroupEdit,
    module_name: 'admin_groups',
    action: 'update',
  },


]

export default routes
