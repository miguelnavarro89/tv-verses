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
  }

  setInitialState () {
    this.state = {
      passage: [],
      activeBibleId: 0,
      visible: false
    }
  }

  bindings () {
    
    this.fetchBooks = this.books.fetch.bind(this.books)
    this.chooseRandomPassage = this.chooseRandomPassage.bind(this)
    this.fetchPassage = this.book.fetchVerse.bind(this.book)
    this.startSlideshow = this.startSlideshow.bind(this)
  }

  componentDidMount () {
    this.bibles.fetch()
      .then(this.fetchBooks)
      .then(this.chooseRandomPassage)
      .then(this.fetchPassage)
      .then(this.setState.bind(this))
      // .then(this.startSlideshow)
    debugger
  }

  chooseRandomPassage () {
    const chooseBook = () => {
      this.book = new Book({
        id: this.books.random(),
        bibleId: this.bibles.all[0].id,
        bibles: this.bibles.all
      })
    }
    const chooseChapter = () => this.book.getTotalChapters()
      .then(() => this.book.chooseRandomChapter())
    const chooseVerse = () => this.book.getTotalVerses()
      .then(() => this.book.chooseRandomVerse())

    chooseBook()
    chooseChapter().then(chooseVerse)
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

  render () {
    const passage = this.state.passage.length && this.state.passage[this.state.active]
    return (
      passage ? <Presentation fadeMs={this.TIME_FADE} visible={this.state.visible} passage={passage} /> : null
    )
  }
}
