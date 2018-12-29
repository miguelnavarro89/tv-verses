import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Presentation from './Presentation'
import YTvideos from '../../config/videos'
import { castLotsFor } from '../../utils'

export default class Container extends Component {
  constructor (props) {
    super(props)
    this.state = {
      playedVideos: [],
      videos: [],
      chosenVideo: null,
      player: null
    }
    this.id = props.id
  }

  componentDidMount () {
    const [, chosenVideo] = castLotsFor(YTvideos)
    this.setState({
      videos: YTvideos,
      chosenVideo
    })
    this.initPlayer()
  }

  initPlayer () {
    const YTApiloaded = window.YT && window.YT.loaded
    if (!YTApiloaded) {
      this.YTTimer = setTimeout(() => this.initPlayer(), 250)
      return
    }
    clearTimeout(this.YTTimer)
    this.player = new YT.Player(this.id, {
      videoId: this.state.chosenVideo,
      playerVars: {
        autoplay: 1,
        controls: 0,
        enablejsapi: 1,
        fs: 0,
        showinfo: 0,
        origin: window.location.origin,
      },
      events: {
        onReady ({target}) {
          target.mute()
        },
        onStateChange: ({data}) => {
          if (data === YT.PlayerState.ENDED) {
            this.playAnotherVideo()
          }
        }
      }
    })
    this.setState({player: this.player})
  }

  playAnotherVideo () {
    const currentVideo = this.state.chosenVideo
    this.setState(({ playedVideos }) => ({ playedVideos: [currentVideo, ...playedVideos] }))
    this.playRandomVideo()
  }

  playRandomVideo() {
    let unplayedVideos = this.state.videos.filter((video) => !this.state.playedVideos.includes(video))
    if (!unplayedVideos.length) {
      unplayedVideos = this.state.videos
      this.setState({ playedVideos: [] })
    }
    const [, chosenVideo] = castLotsFor(unplayedVideos)
    this.setState({ chosenVideo })
    this.player.loadVideoById(chosenVideo)
  }

  render () {
    return (
      <Presentation id={this.id} />
    )
  }
}

Container.propTypes = {
  id: PropTypes.string.isRequired
}
