import { gql } from "@apollo/client";

export const GET_GOOGLE_BOOK = gql`
  query GetGoogleBook($id: String!) {
    getGoogleBook(id: $id) {
      id
      title
      author
      cover
      gender
      description
    }
  }
`;
