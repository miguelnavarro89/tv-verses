import React from 'react'
import styled from 'styled-components'

const FONT_SIZE = 3
const UNIT = 'vw'
const CHARS_IN_CONTEXT = 160
const INC_PER_CHAR = FONT_SIZE / CHARS_IN_CONTEXT

const Wrapper = styled.div`
  position: relative;
  padding: 7%;
  font-size: ${({ size }) => size || FONT_SIZE + UNIT};
  color: white;
  font-variant-ligatures: common-ligatures;
  transition: ease opacity ${({ fadeMs }) => (fadeMs && (fadeMs / 1000)) || 3}s;
  opacity: ${({ visible }) => visible ? 1 : 0};

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: -10%;
    left: -40%;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .62);
    filter: blur(12vw);
    border-radius: 100%;
  }

  f {
    display: none;
  }
`

const Content = styled.div`
  position: relative;
  z-index: 2;
`

const Reference = styled.div`
  position: relative;
  z-index: 2;
  margin-top: 2em;
  font-size: .62em;
  text-align: right;
  font-style: italic;
`

const Version = styled.abbr`
  text-transform: uppercase;
  font-size: .8em;
`

export default function Presentation ({ passage, visible, fadeMs }) {
  const { content, version, book: [, bookLongName], chapter, verse } = passage
  const diff = FONT_SIZE - content.length * INC_PER_CHAR
  let fontSize = FONT_SIZE + diff
  fontSize < 3 && (fontSize = 3)
  fontSize = fontSize + UNIT
  return (
    <Wrapper fadeMs={fadeMs} visible={visible} size={fontSize}>
      <Content dangerouslySetInnerHTML={{ __html: content }} />
      <Reference>{bookLongName} {chapter}:{verse} (<Version>{version}</Version>)</Reference>
    </Wrapper>
  )
}
