const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {

    Query: {
        me: async (parent, args, context) => { // retrieve the logged in user from the contrext and find the user in the database
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, profile };
        },

        login: async (parent, { email, password}) => {
            const user = await User.findOne({ email });

            if(!user) { // check if user
                throw AuthenticationError;
            }

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) { // see if correct password
                throw AuthenticationError;
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, book, context) => {
            // see if user has valid jwt by checking if they have a context property
            if (context.user) {
                return User.findOneAndUpdate(
                  { _id: context.user._id },
                  {
                    $addToSet: { savedBooks: book },
                  },
                  {
                    new: true,
                    runValidators: true,
                  }
                );
            }
            throw AuthenticationError('You need to be logged in!');
        },

        deleteBook: async (parent, book, context) => {
            // see if user has valid jwt by checking if they have a context property
            if (context.user) {
                return User.findOneAndUpdate(
                  { _id: context.user._id },
                  {
                    $pull: { savedBooks: book },
                  },
                  {
                    new: true,
                  }
                );
            }
            throw AuthenticationError('You need to be logged in!');
        }
    },

};


module.exports = resolvers;