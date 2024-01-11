// credit: https://github.com/TanStack/table/blob/main/packages/react-table/src/index.tsx

import { createTable } from "@tanstack/table-core"
import { atom } from "jotai/vanilla"

import type {
  RowData,
  Table,
  TableOptions,
  TableOptionsResolved,
  TableState,
} from "@tanstack/table-core"
import type { Atom } from "jotai/vanilla"

type Read<Value> = Atom<Value>["read"]

export function atomWithTable<TData extends RowData>(
  read: Read<TableOptions<TData>>,
) {
  let table: Table<TData> | null = null
  let state: TableState | null = null
  const baseAtom = atom((get, opts) => {
    const options = read((a) => get(a), opts)

    if (!table) {
      // Compose in the generic options to the user options
      const resolvedOptions: TableOptionsResolved<TData> = {
        state: {}, // Dummy state
        onStateChange: () => {}, // noop
        renderFallbackValue: null,
        ...options,
      }

      // Create a new table and store it in state
      table = createTable<TData>(resolvedOptions)
      // By default, manage table state here using the table's initial state
      state = table.initialState
    }

    // Compose the default state above with any user state. This will allow the user
    // to only control a subset of the state if desired.
    table.setOptions((prev) => ({
      ...prev,
      ...options,
      state: {
        ...state,
        ...options.state,
      },
      // Similarly, we'll maintain both our internal state and any user-provided
      // state.
      onStateChange: (updater) => {
        state = typeof updater === "function" ? updater(state!) : updater
        options.onStateChange?.(updater)
      },
    }))

    return table
  })
  const derivedAtom = atom((get) => get(baseAtom))
  return derivedAtom
}
