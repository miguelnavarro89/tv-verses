import React, { Component } from 'react'
import { pipe, filter, prop, then, propEq, head } from 'ramda'
import Presentation from './Presentation'
import Api from '../../Api'
import { castLotsFor, getRandomOf } from '../../utils'

export default class Container extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bibles: [],
      books: [],
      passage: [],
      active: 0
    }
    this.api = new Api()
    this.TIME_HIDDEN = 10000
    this.TIME_SHOWN = 5000
  }

  componentDidMount () {
    this.fetchBibles()
      .then((bibles) => (this.setState({ bibles }), bibles))
      .then((bibles) => bibles.map(({ code }) => ({
        version: code,
        books: this.fetchBooks(code)
      })))
      .then((books) => (this.setState({ books }), books))
      .then(() => this.setRandomPassage())
  }

  setRandomPassage () {
    this.state.books[0].books
      .then((books) => {
        const [selectedBookIndex, selectedBook] = castLotsFor(books)
        const chapter = getRandomOf(selectedBook.chapters) + 1
        return Promise.all(
          this.state.bibles.map(({ code }) =>
            pipe(
              filter(propEq('version', code)),
              head,
              prop('books'),
              then((versionBooks) => ({
                version: code,
                book: [versionBooks[selectedBookIndex].short_name, versionBooks[selectedBookIndex].long_name],
                chapter,
                verse: this.fetchChapter({
                  version: code,
                  book: versionBooks[selectedBookIndex].short_name,
                  chapter
                })
              }))
            )(this.state.books)
          )
        )
      })
      .then((passage) => passage[0].verse.then(
        (verses) => ({
          passage,
          selectedVerseIndex: getRandomOf(verses.length)
        })
      ))
      .then(({ selectedVerseIndex, passage }) => Promise.all(
        passage.map(({ verse, ...rest }) =>
          verse.then((versionVerses) => ({
            verse: selectedVerseIndex + 1,
            content: versionVerses[selectedVerseIndex].content,
            ...rest
          }))
        )
      ))
      .then((passage) => {
        this.setState({ passage })
        this.setPassage(0)
        !this.slideshowPlaying && this.startSlideshow()
      })
  }

  setPassage (index) {
    this.passage = this.state.passage[index]
    this.setState({ active: index })
  }

  stopSlideshow () {
    clearInterval(this.verseTimer)
    this.slideshowPlaying = false
  }

  startSlideshow () {
    this.slideshowPlaying = true
    this.verseTimer = setInterval(() => {
      const currentIndex = this.state.active
      const totalVerses = this.state.passage.length
      if (currentIndex === totalVerses - 1) {
        this.setRandomPassage()
        this.stopSlideshow()
        return
      }
      this.setPassage(currentIndex + 1)
    }, this.TIME_SHOWN)
  }

  fetchVerse ({ version, book, chapter, verse }) {
    return this.api
      .with({ version, book, chapter, verse })
      .get('verse')
  }

  fetchChapter ({ version, book, chapter }) {
    return this.api
      .with({ version, book, chapter })
      .get('chapter')
  }

  fetchBooks (version) {
    return this.api
      .with({ version })
      .get('books')
  }

  fetchBibles () {
    return this.api.get('bibles')
  }

  render () {
    return (
      this.passage ? <Presentation passage={this.passage} /> : null
    )
  }
}
