import { flexRender } from "@tanstack/react-table"
import { getCoreRowModel } from "@tanstack/table-core"
import * as RTL from "@testing-library/react"
import { act, renderHook } from "@testing-library/react-hooks"
import { useAtomValue } from "jotai"
import { atom } from "jotai/vanilla"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { atomWithTable } from "."

import type { ColumnDef } from "@tanstack/table-core"

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Person[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 29,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "derek",
    lastName: "perkins",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "bergevin",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
]

const defaultColumns: ColumnDef<Person>[] = [
  {
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: "firstName",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        cell: (info) => info.renderValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        cell: (info) => info.renderValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: "Info",
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: "age",
        header: () => "Age",
        footer: (props) => props.column.id,
      },
      {
        header: "More Info",
        columns: [
          {
            accessorKey: "visits",
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "status",
            header: "Status",
            footer: (props) => props.column.id,
          },
          {
            accessorKey: "progress",
            header: "Profile Progress",
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
  },
]

describe("core", () => {
  it("renders a table with markup", () => {
    const dataAtom = atom<Person[]>([...defaultData])
    const columnsAtom = atom<typeof defaultColumns>([...defaultColumns])
    const columnVisibilityAtom = atom<Record<string, boolean>>({})
    const tableAtom = atomWithTable((get) => ({
      data: get(dataAtom),
      columns: get(columnsAtom),
      //   onColumnVisibilityChange: setColumnVisibility,
      state: {
        columnVisibility: get(columnVisibilityAtom),
      },
      getCoreRowModel: getCoreRowModel(),
      // debug: true,
    }))

    const Table = () => {
      const rerender = React.useReducer(() => ({}), {})[1]
      const table = useAtomValue(tableAtom)

      return (
        <div className="p-2">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <div className="h-4" />
          <button
            onClick={() => {
              rerender()
            }}
            className="border p-2"
          >
            Rerender
          </button>
        </div>
      )
    }

    // let api: any;

    const rendered = RTL.render(<Table />)

    // RTL.screen.logTestingPlaygroundURL()

    RTL.screen.getByRole("table")
    expect(RTL.screen.getAllByRole("rowgroup").length).toEqual(3)
    expect(RTL.screen.getAllByRole("row").length).toEqual(9)
    expect(RTL.screen.getAllByRole("columnheader").length).toEqual(24)
    expect(RTL.screen.getAllByRole("cell").length).toEqual(18)

    expect(
      [...rendered.container.querySelectorAll("thead > tr")].map((d) =>
        [...d.querySelectorAll("th")].map((d) => [
          d.innerHTML,
          d.getAttribute("colspan"),
        ]),
      ),
    ).toMatchSnapshot()

    expect(
      [...rendered.container.querySelectorAll("tbody > tr")].map((d) =>
        [...d.querySelectorAll("td")].map((d) => d.innerHTML),
      ),
    ).toMatchSnapshot()

    expect(
      [...rendered.container.querySelectorAll("tfoot > tr")].map((d) =>
        [...d.querySelectorAll("th")].map((d) => [
          d.innerHTML,
          d.getAttribute("colspan"),
        ]),
      ),
    ).toMatchSnapshot()
  })

  it("has a stable api", () => {
    const dataAtom = atom<Person[]>([...defaultData])
    const columnsAtom = atom<typeof defaultColumns>([...defaultColumns])
    const tableAtom = atomWithTable((get) => ({
      data: get(dataAtom),
      columns: get(columnsAtom),
      getCoreRowModel: getCoreRowModel(),
    }))

    const { result } = renderHook(() => {
      const rerender = React.useReducer(() => ({}), {})[1]

      const table = useAtomValue(tableAtom)

      return {
        table,
        rerender,
      }
    })

    const prev = result.current

    act(() => {
      result.current.rerender()
    })

    const next = result.current

    expect(prev).toStrictEqual(next)
  })

  it("can return the rowModel", () => {
    const dataAtom = atom<Person[]>([...defaultData])
    const columnsAtom = atom<typeof defaultColumns>([...defaultColumns])
    const tableAtom = atomWithTable((get) => ({
      data: get(dataAtom),
      columns: get(columnsAtom),
      getCoreRowModel: getCoreRowModel(),
    }))
    const { result } = renderHook(() => {
      const rerender = React.useReducer(() => ({}), {})[1]

      const table = useAtomValue(tableAtom)

      return {
        table,
        rerender,
      }
    })

    const rowModel = result.current.table.getRowModel()

    expect(rowModel.rows.length).toEqual(3)
    expect(rowModel.flatRows.length).toEqual(3)
    expect(rowModel.rowsById["2"]?.original).toEqual(defaultData[2])
  })
})
