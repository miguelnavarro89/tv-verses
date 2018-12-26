import React, { Component } from 'react'
import Presentation from './Presentation';

export default class Container extends Component {
  
  constructor() {
    super()
  }

  componentDidMount() {}

  render() {
    return (
      <Presentation passage={null} />
    )
  }
}
