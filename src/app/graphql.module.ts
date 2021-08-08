import { NgModule } from '@angular/core';

import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';

import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

const uri = environment.graphqlUri;
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    const expiration = localStorage.getItem("AWW_expiration");
    const token = localStorage.getItem('AWW_token');
    if (
      !token ||
      !expiration ||
      (expiration && Date.now() > +expiration)
    ) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `JWT ${token}`
        }
      };
    }
  });
  // TODO: Do Network error handling
  // Probably dispatch an error for the auth store
  const errorHandling = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      localStorage.setItem('error', graphQLErrors[0].message);
      alert(graphQLErrors[0].message + ` -- The website is suffering from technical issues and
        will probably not function correctly. I suggest reloading or trying again later. Sorry for the inconvenience.
      `);
    }
    if (networkError) {
      localStorage.setItem('error', networkError.message);
      alert(networkError.message  + ` -- The website is suffering from technical issues and
        will probably not function correctly. I suggest reloading or trying again later. Sorry for the inconvenience.
      `);
    }
  });

  const link = ApolloLink.from([basic, auth, errorHandling, httpLink.create({ uri })]);
  const cache = new InMemoryCache()
  return {
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all'
      }
    }
  };
}

@NgModule({
  exports: [
    HttpClientModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
