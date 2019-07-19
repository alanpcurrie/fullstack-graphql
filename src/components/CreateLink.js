import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'
import styled from 'styled-components'

const StyledCreateLink = styled.div`
  padding: 10rem;
`

const StyledInput = styled.input`
  margin-bottom: 1rem;
`

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: papayawhip;
  border-radius: 0.5rem;
`


const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`
class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    const { description, url } = this.state
    return (
      <StyledCreateLink>
          <StyledInput
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <StyledInput
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />

        <Mutation
          mutation={POST_MUTATION}
          variables={{ description, url }}
          onCompleted={() => this.props.history.push('/new/1')}
          update={(store, { data: { post } }) => {
            const first = LINKS_PER_PAGE
            const skip = 0
            const orderBy = 'createdAt_DESC'
            const data = store.readQuery({
              query: FEED_QUERY,
              variables: { first, skip, orderBy },
            })
            data.feed.links.unshift(post)
            store.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy },
            })
          }}
        >
          {postMutation => <StyledButton onClick={postMutation}>Submit</StyledButton>}
        </Mutation>
     </StyledCreateLink>
    )
  }
}

export default CreateLink
