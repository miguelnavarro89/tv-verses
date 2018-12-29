import React, { Component } from 'react'
import { pipe, filter, prop, then, propEq, head } from 'ramda'
import Presentation from './Presentation'
import Api from '../../Api'
import { getRandomOf } from '../../utils'

export default class Container extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bibles: [],
      books: [],
      activePassage: []
    }
    this.api = new Api()
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
        const bookIndex = getRandomOf(books.length)
        const book = books[bookIndex]
        const chapter = getRandomOf(book.chapters) + 1
        return Promise.all(
          this.state.bibles.map(({ code }) =>
            pipe(
              filter(propEq('version', code)),
              head,
              prop('books'),
              then((books) => ({
                version: code,
                book: [books[bookIndex].short_name, books[bookIndex].long_name],
                chapter,
                verse: this.fetchChapter({
                  version: code,
                  book: books[bookIndex].short_name,
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
          verseIndex: getRandomOf(verses.length)
        })
      ))
      .then(({ verseIndex, passage }) => Promise.all(
        passage.map(({ verse, ...rest }) =>
          verse.then((verses) => ({
            verse: verseIndex + 1,
            content: verses[verseIndex].content,
            ...rest
          }))
        )
      ))
      .then((passage) => {
        this.setState({activePassage: passage})
      })
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
    const passage = this.state.activePassage[0]
    return (
      passage ? <Presentation passage={passage} /> : 'Loading'
    )
  }
}
