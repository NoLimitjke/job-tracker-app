'use client';

import React from 'react';
import { Board, Column } from '../models/models.types';

export function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = React.useState<Board | null>(initialBoard || null);
  const [column, setColumn] = React.useState<Column[]>(initialBoard?.columns || []);
  const [error, setError] = React.useState<string | null>(null);

  return {};
}

//4 04
