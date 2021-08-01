import { gql } from "apollo-angular";

export const MESSAGE_ME = gql`
  mutation messageMe($message: String!) {
    messageMe(message: $message) {
      success
    }
  }
`;
