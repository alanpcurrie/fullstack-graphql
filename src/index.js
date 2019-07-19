import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BrowserRouter } from 'react-router-dom'
import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from './constants'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import './styles/index.css'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import {
  space,
  color,
  fontSize,
  width,
  fontWeight,
  lineHeight,
} from 'styled-system'


const Style = createGlobalStyle`
  * { box-sizing: border-box; }
  body{ margin:0; }
`

const theme = {
    fontSizes: [12, 14, 16, 24, 32, 48, 64, 96, 128],
    space: [
      0,
      4,
      8,
      16,
      32,
      64,
      128,
      256,
    ],
    colors: {
      blue: '#07c',
      red: '#e10',
    },
  }

  const StyledRoot = styled.div`
  font-family: system-ui, sans-serif;
  line-height: 1.5;
`

const Box = styled.div`
  ${space}
  ${width}
  ${fontSize}
  ${color}
`
Box.propTypes = {
  ...space.propTypes,
  ...width.propTypes,
  ...fontSize.propTypes,
  ...color.propTypes,
}

const Text = styled.div`
  ${space}
  ${fontSize}
  ${fontWeight}
  ${lineHeight}
  ${color}
`
Text.propTypes = {
  ...space.propTypes,
  ...fontSize.propTypes,
  ...fontWeight.propTypes,
  ...lineHeight.propTypes,
  ...color.propTypes,
}

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <BrowserRouter>
      <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
              <StyledRoot>
                  <Style />
                  <App />
              </StyledRoot>
          </ThemeProvider>
      </ApolloProvider>
  </BrowserRouter>,
   document.getElementById('root')
)
serviceWorker.unregister();
