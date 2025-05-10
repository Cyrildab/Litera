import { gql } from "@apollo/client";

export const IS_USERNAME_TAKEN = gql`
  query IsUsernameTaken($username: String!) {
    isUsernameTaken(username: $username)
  }
`;
