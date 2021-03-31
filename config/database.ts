import config from 'config';
import { connect, ConnectionOptions } from 'mongoose';

export const connectDB = async () => {
  try {
    const monogUri: string = config.get('mongoURI');
    const options: ConnectionOptions = {
      useFindAndModify: true,
      useCreateIndex: true,
      useNewUrlParser: true,
    };
    connect(monogUri, options);
    console.log('Mongodb created');
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};
