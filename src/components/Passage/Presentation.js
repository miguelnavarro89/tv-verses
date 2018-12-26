import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const Content = styled.div``

const Reference = styled.div``

export default function Presentation({ content = '', reference = '' }) {

  return (
    <Wrapper>
      <Content>{content}</Content>
      <Reference>{reference}</Reference>
    </Wrapper>
  ) 
}
