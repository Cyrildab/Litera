import { gql } from "@apollo/client";

export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      id
      title
      author
      cover
    }
  }
`;
