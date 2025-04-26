import { gql } from "@apollo/client";

export const ADD_USER_BOOK = gql`
  mutation AddUserBook($googleBookId: String!, $status: ReadingStatus!) {
    addUserBook(googleBookId: $googleBookId, status: $status) {
      id
      googleBookId
      status
    }
  }
`;
