import { gql } from "@apollo/client";

export const GET_PUBLIC_USER = gql`
  query GetUserById($userId: Int!) {
    getUserById(userId: $userId) {
      id
      username
      description
      image
    }
  }
`;
