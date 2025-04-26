import { gql } from "@apollo/client";

export const SEARCH_GOOGLE_BOOKS = gql`
  query SearchGoogleBooks($query: String!, $maxResults: Int) {
    searchGoogleBooks(query: $query, maxResults: $maxResults) {
      id
      title
      author
      cover
      gender
      description
    }
  }
`;
