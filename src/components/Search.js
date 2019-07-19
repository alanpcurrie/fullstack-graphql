import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'
import styled from 'styled-components'

const StyledSeach = styled.div`
  margin-bottom: 1rem;
`

const StyledInput = styled.input`
  margin-bottom: 1rem;
`

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: papayawhip;
  border-radius: 0.5rem;
`

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`
class Search extends Component {
  state = {
    links: [],
    filter: '',
  }

  render() {
    return (
      <StyledSeach>
        <div>
          Search
          <StyledInput
            type="text"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <StyledButton onClick={() => this._executeSearch()}>OK</StyledButton>
        </div>
        {this.state.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
       </StyledSeach>
    )
  }

  _executeSearch = async () => {
    const {filter} = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const links = result.data.feed.links
    this.setState({ links })
  }
}

export default withApollo(Search)
