const queries = `#graphql
  type Note {
      id: Int
      msg: String
  }

  input NoteInput {
      msg: String
  }

  type Query {
      getNotes: [Note]
  }

  type Mutation {
    createNote(note: NoteInput): Note
  }

  type Subscription {
      newNoteCreated: Note
  }
`

export default queries