import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  > iframe {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`

export default function Presentation({ id }) {

  return (
    <Wrapper>
      <div id={id}></div>
    </Wrapper>
  ) 
}
