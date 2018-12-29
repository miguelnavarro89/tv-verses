export function castLotsFor (collection = []) {
  const total = collection.length
  const id = getRandomOf(total)
  return [id, collection[id]]
}

export function getRandomOf (total = 10) {
  return Math.floor(Math.random() * total)
}
