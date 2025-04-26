import { gql } from "@apollo/client";

export const GET_USER_BOOKS = gql`
  query GetUserBooks {
    getUserBooks {
      id
      googleBookId
      title
      author
      cover
      status
      rating
      review
      user {
        id
        username
      }
    }
  }
`;
