import { gql } from "@apollo/client";

export const GET_FRIENDSHIP_WITH_USER = gql`
  query GetFriendshipWithUser($userId: Int!) {
    getFriendshipWithUser(userId: $userId) {
      id
      accepted
      requester {
        id
      }
      receiver {
        id
      }
    }
  }
`;
