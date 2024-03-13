import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me ($_id: ID!){
    me(userId: $_id){
        _id
        username
        email
        bookCount
        savedBooks {
            bookId
            title
            description
            authors
            image
            link
        }
    }
  }
`;