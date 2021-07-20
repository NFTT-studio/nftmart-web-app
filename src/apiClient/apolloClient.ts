import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';
import { GRAPHQL_ENDPOINT } from '../constants';

export const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});
