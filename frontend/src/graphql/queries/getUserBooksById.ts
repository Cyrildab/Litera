import { gql } from "@apollo/client";

export const GET_USER_BOOKS_BY_ID = gql`
  query GetUserBooksById($userId: Int!) {
    getUserBooksById(userId: $userId) {
      id
      googleBookId
      title
      author
      cover
      status
      rating
    }
  }
`;
