import DeviceIndex from '@/components/device/index'
import DeviceInfo from '@/components/device/info'
import DeviceCreate from '@/components/device/create'

export default {
    path: '/device',
    name: DeviceIndex.name,
    component: DeviceIndex,
    meta: {
      isAuthRequired: true
    },
    children: [
      {
        path: 'info/:id',
        name: 'DeviceInfo',
        component: DeviceInfo,
        props: true
      },
      {
        path: 'create',
        name: DeviceCreate.name,
        component: DeviceCreate,
      },
      {
        path: 'edit/:id',
        name: 'DeviceEdit',
        component: DeviceCreate,
        props: true,
      },
    ]
}
