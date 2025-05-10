import { gql } from "@apollo/client";

export const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($receiverId: Int!) {
    sendFriendRequest(receiverId: $receiverId) {
      id
      accepted
    }
  }
`;
