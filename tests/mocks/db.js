import { vi } from "vitest"

const mockQueryBuilder = {
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  fullJoin: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  groupBy: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
}

export const mockDb = {
  select: vi.fn(() => mockQueryBuilder),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn(() => { return { onConflictDoNothing: vi.fn().mockReturnThis() } } ),
  returning: vi.fn(),
  batch: vi.fn(),
  update: vi.fn(() => mockUpdate),
  delete: vi.fn(() => mockQueryBuilder)
}