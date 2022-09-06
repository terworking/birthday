export const fetchBirthdayNotificationServer = (
  path: string,
  init?: RequestInit
) => {
  const url = new URL(
    import.meta.env.DEV
      ? 'http://localhost:8787'
      : import.meta.env.PUBLIC_BACKEND_SERVER
  )

  url.pathname += path

  return fetch(url.href, init)
}
