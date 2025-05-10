import { gql } from "@apollo/client";

export const GET_FRIENDS = gql`
  query GetFriends {
    getFriends {
      id
      username
      image
    }
  }
`;
