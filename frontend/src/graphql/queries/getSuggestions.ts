import { gql } from "@apollo/client";

export const GET_SUGGESTIONS = gql`
  query GetSuggestions {
    books {
      id
      title
    }
  }
`;
