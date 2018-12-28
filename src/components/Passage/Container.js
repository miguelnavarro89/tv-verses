import React, { Component } from 'react'
import Presentation from './Presentation'
import Api from '../../Api'
import { getRandomOf } from '../../utils'

export default class Container extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bibles: [],
      books: [],
      activePassage: {
        content: '',
        version: '',
        book: '',
        chapter: 0,
        verse: 0
      }
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
        const book = getRandomOf(books[bookIndex])
        const chapter = getRandomOf(book.chapters)
        return [bookIndex, chapter]
      })
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
