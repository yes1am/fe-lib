export const addEventListener = (target, eventType, callback) => {
  const wrapCallback = e => {
    callback.call(target, e)
  }
  target.addEventListener(eventType, wrapCallback)

  return {
    remove () {
      target.removeEventListener(eventType, wrapCallback)
    }
  }
}
