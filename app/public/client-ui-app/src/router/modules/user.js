import UserIndex from '@/components/user/index'
import UserList from '@/components/user/list'
import UserEdit from '@/components/user/edit'
import UserCreate from '@/components/user/create'

export default {
    path: '/user',
    name: UserIndex.name,
    component: UserIndex,
    meta: {
      isAuthRequired: true
    },
    children: [
      {
        path: '/users',
        name: UserList.name,
        component: UserList,
        meta: {
          isAdminRequired: true
        }
      },
      // {
      //   path: 'info/:id',
      //   name: DeviceInfo.name,
      //   component: DeviceInfo,
      // },
      {
        path: 'create',
        name: UserCreate.name,
        component: UserCreate,
      },
      {
        path: 'edit',
        name: UserEdit.name+'Personal',
        component: UserEdit
      },
      {
        path: 'edit/:id',
        name: UserEdit.name,
        component: UserEdit,
        props: true,
      },
    ]
}
