import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { map, replace, __ } from 'ramda';
import Presentation from './Presentation';
import videosIds from '../../config/videos'

export default class Container extends Component {
  
  constructor() {
    super()
    this.state = {
      videos: [],
      chosenVideo: 0,
    }
  }

  componentDidMount() {
    // const youtubeLinkTpl = 'https://www.youtube.com/embed/{videoId}'
    // const videos = map(replace('{videoId}', __, youtubeLinkTpl))(videosIds)
    const chooseVideo = () => this.chooseRandomVideo(this.initPlayer)
    this.setState({ videos: videosIds }, chooseVideo)
    
  }

  initPlayer() {
    clearTimeout(this.YTTimer)
    const YTloaded = window.YT && window.YT.loaded
    if (!YTloaded || !this.props) {
      this.YTTimer = setTimeout(this.initPlayer, 250)
      return
    }
    this.player = new YT.Player(this.props.id, {
      height: '640',
      width: '480',
      videoId: this.state.chosenVideo,
      playerVars: {
        'autoplay': 1,
        'controls': 0,
        'enablejsapi': 1,
        'fs': 0,
        'showinfo': 0,
        // playlist: [],
      },
      events: {
        // 'onReady': onPlayerReady,
        // 'onStateChange': onPlayerStateChange
      }
    });
  }

  getRandomVideo() {
    const randomNumber = Math.floor(Math.random() * this.state.videos.length)
    return this.state.videos[randomNumber]
  }

  chooseRandomVideo(doneCb = () => {}) {
    this.setState({ chosenVideo: this.getRandomVideo() }, doneCb)
  }

  render() {
    return (
      <Presentation id={this.props.id} />
    )
  }
}

Container.propTypes = {
  id: PropTypes.string.isRequired,
}
