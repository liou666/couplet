import LowerLine from '@renderer/app/main/lower-line'
import UpperLine from '@renderer/app/main/upper-line'
import SettingPage from '@renderer/app/setting/page'
import { createHashRouter } from 'react-router'
import MiddleLine from './app/main/middle-line'

// TODO: Auto Build RouteTree!
const tree = [
  {
    path: '/',
    Component: () => <UpperLine />,
  },
  {
    path: '/upper-line',
    Component: () => <UpperLine />,
  },
  {
    path: '/lower-line',
    Component: () => <LowerLine />,
  },
  {
    path: '/middle-line',
    Component: () => <MiddleLine />,
  },
  {
    path: '/setting',
    Component: () => <SettingPage />,
  },
]

const router = createHashRouter(tree)

export default router
