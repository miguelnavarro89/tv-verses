import React, { Fragment } from 'react'
import { render } from 'react-dom'

import 'normalize.css/normalize.css'
import GlobalStyle from './css/global'

import { YOUTUBE_API_URL } from './config/youtube'
import { BgVideo, AsyncScript } from './components'

const App = () => {
  return (
    <Fragment>
      <BgVideo id="bg-video" />
      <GlobalStyle />
      <AsyncScript load={YOUTUBE_API_URL} />
    </Fragment>
  )
}

render(<App />, document.getElementById('app'))
