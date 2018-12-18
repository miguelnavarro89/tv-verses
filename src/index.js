import React from 'react'
import { render } from 'react-dom'
import GlobalStyle from './css/global'

import 'normalize.css/normalize.css'

const App = () => {
  return (
    <div>
      <h1>TV Verses</h1>
      <GlobalStyle />
    </div>
  )
}

render(<App />, document.getElementById('app'))
