import React, { Component } from 'react'
import Presentation from './Presentation'
import Api from '../../Api'
import { castLotsFor, getRandomOf } from '../../utils'

export default class Container extends Component {
  constructor () {
    super()
    this.state = {
      bibles: [],
      books: [],
      activePassage: {
        content: '',
        version: '',
        chapter: 0,
        verse: 0
      }
    }
    this.api = new Api()
  }

  componentDidMount () {
    Promise.all([
      this.fetchBibles(),
      this.fetchBooks()
    ]).then(this.setRandomPassage.bind(this))
  }

  setRandomPassage () {
    const book = castLotsFor(this.state.books)
    const chapter = getRandomOf(book.chapters)
    const chapterFetch = this.state.bibles.map(
      ({ code: version }) =>
        this.fetchChapter({ version, book: book.short_name, chapter })
          .then((verses) => ({ version, verses }))
    )
    Promise.all(chapterFetch)
      .then(function (verses) {
        return verses.reduce((acc, cur) => acc[cur.version] = cur.verses, {})
      })
      .then((res) => {
        debugger
      })
  }

  fetchChapter ({ version, book, chapter }) {
    return this.api
      .with({ version, book, chapter })
      .get('chapter')
  }

  fetchBooks () {
    const version = 'gnv'
    return this.api
      .with({ version })
      .get('books')
      .then((books) => this.setState({ books }))
  }

  fetchBibles () {
    return this.api
      .get('bibles')
      .then((bibles) => this.setState({ bibles }))
  }

  render () {
    return (
      <Presentation passage={this.state.activePassage} />
    )
  }
}
