// Import required modules from Apollo Client
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create the main HTTP link to your GraphQL server
const httpLink = new HttpLink({
  uri: "http://10.1.9.101:30699/graphql", // Replace with your actual GraphQL endpoint
});

// Set up a context link to attach custom headers to every request
const authLink = setContext((_, { headers }) => {
  // Get metadata values from localStorage or fallback values
  const deviceId = localStorage.getItem("deviceId") || "default-device";
  const userId = localStorage.getItem("userId") || "guest";
  const correlationId = crypto.randomUUID(); // Generate unique request ID
  const companyId = localStorage.getItem("companyId") || "default-company";

  // Return the updated headers to be used in the request
  return {
    headers: {
      ...headers,
      "X-Device-ID": deviceId,
      "X-User-ID": userId,
      "X-Correlation-ID": correlationId,
      "X-Company-ID": companyId,
    },
  };
});

// Create and export the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine auth headers with HTTP link
  cache: new InMemoryCache(), // Use in-memory caching for queries
});

export default client;
