import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import {ArrowDropUp} from 'styled-icons/material'

const StyledLink = styled.div`
    font-size: 1.2rem;
    background: white;
`

const StyledLinkNumber = styled.span`
    font-size: 1.2rem;
    background: white;
`

const StyledLinkDescription= styled.span`
    font-size: 1.2rem;
    background: white;
`

const StyledVoteButton = styled.button`
    font-size: .75rem;
    color: green;
    border: 0;
`

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

class Link extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)

    return (
      <StyledLink>
        <div className="flex items-center">
        <StyledLinkNumber>{this.props.index + 1}. </StyledLinkNumber>
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ linkId: this.props.link.id }}
              update={(store, { data: { vote } }) =>
                this.props.updateStoreAfterVote(store, vote, this.props.link.id)
              }
            >
              {voteMutation => (
                <StyledVoteButton onClick={voteMutation}>
                  <ArrowDropUp size="34"/>
                </StyledVoteButton>
              )}
            </Mutation>
          )}
        </div>
        <StyledLinkDescription>
          <div>
            {this.props.link.description} ({this.props.link.url})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.link.votes.length} votes | by{' '}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
        </StyledLinkDescription>
      </StyledLink>
    )
  }
}

export default Link