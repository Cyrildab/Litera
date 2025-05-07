import { gql } from "@apollo/client";

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      username
      description
      image
      birthday
      gender
    }
  }
`;
