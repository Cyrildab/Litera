import { gql } from "@apollo/client";

export const GET_FRIEND_IDS = gql`
  query GetFriendIds {
    getFriendIds
  }
`;
