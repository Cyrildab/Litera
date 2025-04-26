import { gql } from "@apollo/client";

export const GET_GOOGLE_BOOK = gql`
  query GetGoogleBook($id: String!) {
    searchGoogleBooks(query: $id) {
      id
      title
      author
      cover
      gender
      description
    }
  }
`;
