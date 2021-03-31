import Payload from './Payload';
import { Request } from 'express';

type request = Request & Payload;

export default request;
