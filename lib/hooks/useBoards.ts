'use client';

import React from 'react';
import { Board, Column } from '../models/models.types';

export function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = React.useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = React.useState<Column[]>(initialBoard?.columns || []);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialBoard) {
      setBoard(initialBoard);
      setColumns(initialBoard.columns || []);
    }
  }, [initialBoard]);

  async function moveJob(jobApplicationId: string, newColumnId: string, newOrder: number) {}

  return { board, columns, error, moveJob };
}
