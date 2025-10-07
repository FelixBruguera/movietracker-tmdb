import { vi } from "vitest"

export const authMock = {
  api: { getSession: vi.fn(() => { return {user: { id: 5 } } } ) }
}

export const invalidAuthMock = {
  api: { getSession: vi.fn(() => null ) }
}