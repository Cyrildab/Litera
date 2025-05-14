import { gql } from "@apollo/client";

export const DELETE_USER_BOOK = gql`
  mutation DeleteUserBook($googleBookId: String!) {
    deleteUserBook(googleBookId: $googleBookId)
  }
`;
