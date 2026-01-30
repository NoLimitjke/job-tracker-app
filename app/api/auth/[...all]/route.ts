import { auth } from '@/lib/auth/auth'; // путь к вашему конфигу better auth
import connectDB from '@/lib/db';
import { toNextJsHandler } from 'better-auth/next-js';

// Создаем обработчик
const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  await connectDB(); // <--- ЯВНО ПОДКЛЮЧАЕМСЯ ПЕРЕД ЗАПРОСОМ
  return handler.POST(req);
};

export const GET = async (req: Request) => {
  await connectDB(); // <--- И ЗДЕСЬ
  return handler.GET(req);
};
