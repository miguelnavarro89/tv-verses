import { pipe, propEq, prop, find } from 'ramda'
import Api from '../Api'
import { getRandomOf } from '../utils'

export class Book {
  constructor ({ id = null, bibleId = null, bibles = [] }) {
    this.api = new Api()
    this.id = id
    this.bibleId = bibleId
    this.bibles = bibles
    this.chapters = {
      active: 0,
      total: 0
    }
    this.verses = {
      active: 0,
      total: 0
    }
    this.setTotalChapters = this.setTotalChapters.bind(this)
  }

  fetchVerse () {
    return Promise.all(
      this.bibles.map(({ id, code }) => this.api
        .with({
          version: code,
          book: this.getBookShortName(id),
          chapter: this.chapters.active,
          verse: this.verses.active
        })
        .get('verse')
        .then((res) => ({
          version: code,
          book: [this.getBookShortName(id), this.getBookLongName(id)],
          ...res
        }))
      )
    )
  }

  getVersion () {
    return pipe(
      find(propEq('id', this.bibleId)),
      prop('code')
    )(this.bibles)
  }

  setTotalChapters (total) {
    return (this.chapters.total = total)
  }

  setTotalVerses (total) {
    return (this.verses.total = total)
  }

  getBookLongName (bibleId = this.bibleId) {
    return this.bibles[bibleId].content[this.id + 1].long_name
  }

  getBookShortName (bibleId = this.bibleId) {
    return this.bibles[bibleId].content[this.id + 1].short_name
  }

  getTotalChapters () {
    return this.api
      .with({
        version: this.getVersion(),
        book: this.getBookShortName()
      })
      .get('totalChapters')
      .then(this.setTotalChapters)
  }

  getTotalVerses () {
    return this.api
      .with({
        version: this.getVersion(),
        book: this.getBookShortName(),
        chapter: this.chapters.active + 1
      })
      .get('totalVerses')
      .then(this.setTotalChapters)
  }

  chooseRandomChapter () {
    return (this.chapters.active = getRandomOf(this.chapters.total))
  }

  chooseRandomVerse () {
    return (this.verses.active = getRandomOf(this.verses.total))
  }
}
