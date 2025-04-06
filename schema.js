const { gql } = require('apollo-server-express');

let todos = []; // In-memory data
let idCounter = 1;

const typeDefs = gql`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
    priority: String!
  }

  type Query {
    getTodos(completed: Boolean, priority: String): [Todo]
  }

  type Mutation {
    addTodo(task: String!, priority: String!): Todo
    deleteTodo(id: ID!): Boolean
    toggleTodo(id: ID!): Todo
  }
`;

const resolvers = {
    Query: {
        getTodos: (_, { completed, priority }) => {
            return todos.filter(todo => {
                return (completed === undefined || todo.completed === completed) &&
                    (priority === undefined || todo.priority === priority);
            });
        },
    },

    Mutation: {
        addTodo: (_, { task, priority }) => {
            const newTodo = {
                id: idCounter++,
                task,
                completed: false,
                priority: priority.toLowerCase(),
            };
            todos.push(newTodo);
            return newTodo;
        },

        deleteTodo: (_, { id }) => {
            const index = todos.findIndex(todo => todo.id == id);
            if (index === -1) return false;
            todos.splice(index, 1);
            return true;
        },

        toggleTodo: (_, { id }) => {
            const todo = todos.find(todo => todo.id == id);
            if (!todo) return null;
            todo.completed = !todo.completed;
            return todo;
        },
    },
};

module.exports = { typeDefs, resolvers };
