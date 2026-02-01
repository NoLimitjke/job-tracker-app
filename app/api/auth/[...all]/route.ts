import { auth } from '@/lib/auth/auth';
import connectDB from '@/lib/db';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  await connectDB();
  return handler.POST(req);
};

export const GET = async (req: Request) => {
  await connectDB();
  return handler.GET(req);
};
