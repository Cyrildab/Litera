import { gql } from "@apollo/client";

export const CANCEL_FRIEND_REQUEST = gql`
  mutation CancelFriendRequestOrRemoveFriend($friendshipId: Int!) {
    cancelFriendRequestOrRemoveFriend(friendshipId: $friendshipId)
  }
`;
