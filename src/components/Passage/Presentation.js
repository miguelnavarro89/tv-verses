import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const Content = styled.div``

const Reference = styled.div``

export default function Presentation ({ passage }) {
  const { content, version, book, chapter, verse } = passage
  return (
    <Wrapper>
      <Content>{content}</Content>
      <Reference>{version} {book} {chapter}: {verse}</Reference>
    </Wrapper>
  )
}
