import { gql } from "@apollo/client";

export const REVIEW_USER_BOOK = gql`
  mutation ReviewUserBook($googleBookId: String!, $review: String!) {
    reviewUserBook(googleBookId: $googleBookId, review: $review) {
      id
      review
    }
  }
`;
