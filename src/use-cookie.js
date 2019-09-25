import { useState } from 'react'

const setCookie = (name, value, day = 30) => {
  const exp = new Date()
  exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${exp.toGMTString()}`
}

const getCookie = name => {
  let arr
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
  if (document.cookie.match(reg)) {
    arr = document.cookie.match(reg)
    if (arr && arr[2]) {
      return decodeURIComponent(arr[2])
    }
  }
  return ''
}

export default function (key, initialValue = '') {
  const [item, setItem] = useState(() => {
    return getCookie(key) || initialValue
  })

  const updateItem = (value) => {
    setItem(value)
    setCookie(key, value)
  }

  return [item, updateItem]
}
