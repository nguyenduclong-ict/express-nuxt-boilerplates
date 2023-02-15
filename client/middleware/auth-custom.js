import { isSubRoute } from '~/utils'

export default function ({ $auth, route, redirect }) {
  const auth = route.meta[0]?.auth
  if (auth === false) return
  if (auth === true || auth === undefined) {
    if (isSubRoute(route.path, '/admin')) {
      if (!$auth.loggedIn) {
        redirect(302, '/admin/login')
      }
    } else if (!$auth.loggedIn) {
      redirect(302, '/login')
    }
  }

  if (auth === 'guest') {
    if (isSubRoute(route.path, '/admin')) {
      if ($auth.loggedIn) {
        redirect(302, '/admin')
      }
    } else if ($auth.loggedIn) {
      redirect(302, '/')
    }
  }
}
