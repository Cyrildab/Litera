import { gql } from "@apollo/client";

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($friendshipId: Int!) {
    acceptFriendRequest(friendshipId: $friendshipId) {
      id
      accepted
    }
  }
`;
