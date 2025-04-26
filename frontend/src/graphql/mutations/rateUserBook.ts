import { gql } from "@apollo/client";

export const RATE_USER_BOOK = gql`
  mutation RateUserBook($googleBookId: String!, $rating: Int!) {
    rateUserBook(googleBookId: $googleBookId, rating: $rating) {
      googleBookId
      rating
    }
  }
`;
