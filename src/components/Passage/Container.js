import React, { Component } from 'react'
import { pipe, filter, prop, then, propEq, head } from 'ramda'
import Presentation from './Presentation'
import Api from '../../Api'
import { getRandomOf } from '../../utils'

const log = console.log

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
        const chapter = getRandomOf(book.chapters)
        return this.state.bibles.map(({ code }) => {
          let bookShortName
          pipe(
            filter(propEq('version', code)),
            head,
            prop('books'),
            then((books) => {
              bookShortName = books[bookIndex].short_name
            })
          )(this.state.books)
          return {
            version: code,
            bookIndex: bookIndex,
            chapter: chapter,
            verses: this.fetchChapter({ version: code, book: bookShortName, chapter })
          }
        })
      })
      .then((res) => {
        log(res)
        res[3].verses.then((res) => {
        })
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
    return (
      <Presentation passage={this.state.activePassage} />
    )
  }
}
