import { gql } from "@apollo/client";

export const GET_PENDING_FRIEND_REQUESTS_RECEIVED = gql`
  query GetPendingFriendRequestsReceived {
    getPendingFriendRequestsReceived {
      id
      username
      image
    }
  }
`;
