export default function AsyncScript({ load: src }) {

  const tag = document.createElement('script')
  tag.src = src

  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

  return null
}
