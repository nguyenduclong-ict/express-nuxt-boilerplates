export default function ({ store, redirect, route, $auth }) {
  const inited = store.state.inited
  if (inited && route.path === '/admin/init') {
    redirect(302, '/')
  }
  if (!inited && route.path !== '/admin/init') {
    return redirect(302, '/admin/init')
  }
}
