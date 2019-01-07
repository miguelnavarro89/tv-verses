import { pipe, propEq, prop, find } from 'ramda'
import Api from '../Api'
import { getRandomOf } from '../utils'

export class Book {
  constructor ({ id = null, bibleId = null }) {
    this.api = new Api()
    this.id = id
    this.bibleId = bibleId
    this.chapters = {
      total: 0
    }

    this.getVersion = pipe(
      find(propEq('id', this.bibleId)),
      prop('code')
    )
    this.setTotalChapters = this.setTotalChapters.bind(this)
  }

  setTotalChapters (total) {
    return (this.chapters.total = total)
  }

  getTotalChapters (bibles) {
    return this.api
      .with({
        version: this.getVersion(bibles),
        book: this.all[this.bibleId].content[this.id].short_name
      })
      .get('totalChapters')
      .then(this.setTotalChapters)
  }

  randomChapter () {
    return getRandomOf(this.total)
  }
}
