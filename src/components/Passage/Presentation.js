import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const Content = styled.div``

const Reference = styled.div``

export default function Presentation ({ content, version, chapter, verse }) {
  return (
    <Wrapper>
      <Content>{content}</Content>
      <Reference>{version} {chapter}: {verse}</Reference>
    </Wrapper>
  )
}
