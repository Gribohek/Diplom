import { Prisma } from '@prisma/client';

// Определяем интерфейс для данных игры
export interface Game {
  id?: string; // Необязательный, так как Prisma сам генерирует ID
  title: string;
  score?: number; // Очки могут быть необязательными
  completed: boolean; // Завершена ли игра
  userId: string; // Идентификатор пользователя
}

// Если вам необходимо использовать типы от Prisma для базы данных
export type GameCreateInput = Prisma.GameCreateInput;
