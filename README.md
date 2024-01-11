# jotai-tanstack-table

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]
[![code style: prettier][code-style-src]][code-style-href]

[Jotai](https://github.com/pmndrs/jotai) integration library for [TanStack Table](https://github.com/TanStack/table)

## Install

```sh
ni jotai-tanstack-table jotai @tanstack/table-core
```

## Usage

```tsx
import { getCoreRowModel } from "@tanstack/react-table"
import { atom, useAtomValue } from "jotai"
import { atomWithTable } from "jotai-tanstack-table"

const dataAtom = atom([...defaultData])
const tableAtom = atomWithTable((get) => ({
  data: get(dataAtom),
  columns,
  getCoreRowModel: getCoreRowModel(),
}))

const table = useAtomValue(tableAtom)
```

## License

[MIT](./LICENSE) License © 2023-PRESENT [Stephen Zhou](https://github.com/hyoban)

<!-- Badges -->

[code-style-src]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[code-style-href]: https://github.com/prettier/prettier
[npm-version-src]: https://img.shields.io/npm/v/jotai-tanstack-table?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/jotai-tanstack-table
[npm-downloads-src]: https://img.shields.io/npm/dm/jotai-tanstack-table?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/jotai-tanstack-table
[bundle-src]: https://img.shields.io/bundlephobia/minzip/jotai-tanstack-table?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=jotai-tanstack-table
[license-src]: https://img.shields.io/github/license/hyoban/jotai-tanstack-table.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/hyoban/jotai-tanstack-table/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/jotai-tanstack-table
