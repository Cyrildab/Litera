import { gql } from "@apollo/client";

export const REMOVE_FRIEND = gql`
  mutation RemoveFriend($userId: Int!) {
    removeFriend(userId: $userId)
  }
`;
