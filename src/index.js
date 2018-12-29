import React from 'react'
import { render } from 'react-dom'

import 'normalize.css/normalize.css'
import GlobalStyle from './css/global'

import { YOUTUBE_API_URL } from './config/youtube'
import { Passage, BgVideo, AsyncScript } from './components'
import { Layout } from './css/layout'

const App = () => {
  return (
    <Layout.App>
      <Layout.Passage>
        <Passage />
      </Layout.Passage>
      <Layout.Video>
        <BgVideo id='bg-video' />
      </Layout.Video>
      <GlobalStyle />
      <AsyncScript load={YOUTUBE_API_URL} />
    </Layout.App>
  )
}

render(<App />, document.getElementById('app'))
