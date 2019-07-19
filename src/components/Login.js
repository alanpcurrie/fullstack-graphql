import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'

const StyledLogin = styled.div`
  background: rosybrown;
  display: flex;
  flex-direction: column;
  margin: 1rem auto;
  padding: 1rem;
  width: 25vw;
`
const StyledInput = styled.input`
  margin-bottom: 1rem;
`

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  background-color: papayawhip;
  border-radius: 0.5rem;
`

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  }

  render() {
    const { login, email, password, name } = this.state
    return (
      <StyledLogin>
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
          {!login && (
            <StyledInput
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
           <StyledInput
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <StyledInput
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <StyledButton onClick={mutation}>
                {login ? 'login' : 'create account'}
              </StyledButton>
            )}
          </Mutation>
          <StyledButton
            onClick={() => this.setState({ login: !login })}
          >
            {login ? 'need to create an account?' : 'already have an account?'}
          </StyledButton>
      </StyledLogin>
    )
  }

  _confirm = async data => {
    const { token } = this.state.login ? data.login : data.signup
    this._saveUserData(token)
    this.props.history.push(`/`)
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}

export default Login
