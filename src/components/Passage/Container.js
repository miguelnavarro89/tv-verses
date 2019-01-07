import React, { Component } from 'react'
import { pipe, filter, prop, then, propEq, head } from 'ramda'
import Presentation from './Presentation'
import { Bibles, Books, Book } from '../../models'
import { castLotsFor, getRandomOf, timer } from '../../utils'

export default class Container extends Component {
  constructor (props) {
    super(props)
    this.constants()
    this.setInitialState()
    this.setModels()
    this.bindings()
  }

  constants () {
    this.TIME_FADE = 3000
    this.TIME_HIDDEN = 15000 + (this.TIME_FADE * 2)
    this.TIME_SHOWN = 15000 + (this.TIME_FADE * 2)
  }

  setModels () {
    this.bibles = new Bibles()
    this.books = new Books()
    this.book = new Book()
  }

  setInitialState () {
    this.state = {
      passage: [],
      book: 0,
      chapter: 0,
      verse: 0,
      activeBible: 0,
      visible: false
    }
  }

  bindings () {
    this.fetchBooks = this.books.fetch.bind(this.books)
    this.chooseRandomPassage = this.chooseRandomPassage.bind(this)
    this.setRandomChapter = this.setRandomChapter.bind(this)
    this.fetchVerse = this.fetchVerse.bind(this)
    this.startSlideshow = this.startSlideshow.bind(this)
  }

  componentDidMount () {
    this.bibles.fetch()
      .then(this.fetchBooks)
      .then(this.chooseRandomPassage)
      .then(this.fetchVerse)
      .then(this.startSlideshow)
  }

  chooseRandomPassage () {
    this.setRandomBook()
    this.setRandomChapter()
      .then(setRandomVerse)
    const setRandomChapter = this.setRandomChapter.bind(this)
    this.books.totalChapters(this.bibles.all, this.bibles.all[0].id, this.state.book)
      .then(setRandomChapter)
      .then(setRandomVerse)

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
        this.setActive(0)
        !this.slideshowPlaying && this.startSlideshow()
      })
  }

  setRandomBook () {
    this.setState({ book: this.books.random() })
  }

  setRandomChapter (totalChapters) {
    const chapter = getRandomOf(totalChapters)
    this.setState({ chapter })
    return chapter
  }

  setActive (index) {
    this.setState({ active: index })
  }

  stopSlideshow () {
    clearInterval(this.verseTimer)
    this.slideshowPlaying = false
  }

  startSlideshow () {
    setTimeout(this.show.bind(this), 0)
    this.slideshowPlaying = true
    const showNextVerse = () => {
      this.hide()
      const currentIndex = this.state.active
      const totalVerses = this.state.passage.length
      if (currentIndex === totalVerses - 1) {
        this.stopSlideshow()
        setTimeout(this.setRandomPassage.bind(this), this.TIME_HIDDEN)
        return
      }
      setTimeout(() => {
        this.setActive(currentIndex + 1)
        this.show()
      }, this.TIME_FADE)
    }
    this.verseTimer = setInterval(showNextVerse, this.TIME_SHOWN)
  }

  hide () {
    this.setState({ visible: false })
  }

  show () {
    this.setState({ visible: true })
  }

  // fetchVerse ({ version, book, chapter, verse }) {
  //   return this.api
  //     .with({ version, book, chapter, verse })
  //     .get('verse')
  // }

  // fetchChapter ({ version, book, chapter }) {
  //   return this.api
  //     .with({ version, book, chapter })
  //     .get('chapter')
  // }

  render () {
    const passage = this.state.passage.length && this.state.passage[this.state.active]
    return (
      passage ? <Presentation fadeMs={this.TIME_FADE} visible={this.state.visible} passage={passage} /> : null
    )
  }
}
