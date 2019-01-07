import  { find, prop, propEq, pipe } from 'ramda'
import Api from '../Api'
import { getRandomOf } from '../utils'

export class Books {
  constructor () {
    this.api = new Api()
    this.all = []
  }

  fetch (versions = []) {
    return Promise.all(
      versions.map(({ id: bibleId, code }) =>
        this.api
          .with({ version: code })
          .get('books')
          .then((res) => ({
            bibleId,
            content: res
          }))
      ))
      .then((res) => (this.all = res))
  }

  get total () {
    return this.all[0].content.length
  }

  random () {
    return getRandomOf(this.total)
  }
}
