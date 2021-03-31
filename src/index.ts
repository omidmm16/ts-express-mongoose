import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import bodyParser from 'body-parser';
import auth from './routes/api/auth';
import { connectDB } from '../config/database';
import user from './routes/api/user';
import profile from './routes/api/profile';
const app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API Running');
});
connectDB();
app.use('/api/auth', auth);
const graphServer = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use('/api/user', user);
app.use('/api/profile', profile);
const port = app.get('port');
graphServer.applyMiddleware({ app });
const server = app.listen(port, () => {
  console.log(
    `Server Running  => API Url: localhost:${port}, Graphql: localhost:${port}${graphServer.graphqlPath}`
  );
});

export default server;
