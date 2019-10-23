export default function formatLocale (locale, style) {
  const splitter = locale.includes('-') ? '-' : '_'
  const [lang, zone] = locale.split(splitter)
  return style
    .replace('aa', lang.toLowerCase())
    .replace('AA', lang.toUpperCase())
    .replace('bb', zone.toLowerCase())
    .replace('BB', zone.toUpperCase())
}
