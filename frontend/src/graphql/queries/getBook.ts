import { gql } from "@apollo/client";

export const GET_BOOK = gql`
  query GetBook($id: Float!) {
    book(id: $id) {
      id
      title
      author
      cover
      gender
      description
    }
  }
`;
