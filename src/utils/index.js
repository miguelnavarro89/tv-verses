import { curry } from 'ramda'

export function castLotsFor (collection = []) {
  const total = collection.length
  const id = getRandomOf(total)
  return [id, collection[id]]
}

export function getRandomOf (total = 10) {
  return Math.floor(Math.random() * total)
}

export const timer = {
  after: curry((miliseconds = 0, cb = () => {}) => setTimeout(cb, miliseconds))
}
