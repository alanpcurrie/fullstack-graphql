import React, { Component } from "react"
import styled, { keyframes } from "styled-components"

const StyledBounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 15px }
  100% { margin-bottom: 0 }
`
const StyledDotWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledDot = styled.div`
  background-color: hotpink;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 5px;
  animation: ${StyledBounceAnimation} 0.5s linear infinite;
  animation-delay: ${props => props.delay};
`

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: 'Loading '};
      }

  render() {
    return (
      <StyledDotWrapper>
        <p>{ this.state.loading }</p>
        <StyledDot delay="0s" />
        <StyledDot delay=".1s" />
        <StyledDot delay=".2s" />
      </StyledDotWrapper>
    )
  }
}

export default Loading