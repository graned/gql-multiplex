const queries = `#graphql
  type Mutation {
    createNote(msg: string): Note
  }

  type Subscription {
      queryNotes: Note
  }
`
