import Api from '../Api'
// import { getRandomOf } from '../utils'

export class Book {
  constructor () {
    this.api = new Api()
    this.id = 0
    this.bibleId = 0
    this.shortName = null
    this.longName = null
    this.chapters = {
      total: 0
    }
    this.verses = {
      total: 0
    }
  }

  totalChapters (bibles, bible, book = 0) {
    return this.api
      .with({
        version: pipe(
          find(propEq('id', bible)),
          prop('code')
        )(bibles),
        book: this.all[bible].content[book].short_name
      })
      .get('totalChapters')
  }
}
