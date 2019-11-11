export const loadScriptPromise = (src, { defer = false, async = true } = {}) => {
  if (!src) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onload = resolve
    script.onerror = reject
    script.onabort = reject
    script.defer = defer
    script.async = async
    script.src = src
    document.body.appendChild(script)
  })
}
