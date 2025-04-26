import { gql } from "@apollo/client";

export const GET_REVIEWS_FOR_BOOK = gql`
  query GetAllReviewsForBook($googleBookId: String!) {
    getAllReviewsForBook(googleBookId: $googleBookId) {
      id
      googleBookId
      review
      rating
      user {
        id
        username
      }
    }
  }
`;
