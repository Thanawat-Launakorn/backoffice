/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";

type DataType<T> = T;

export type ColumnType<T> = {
  id: string;
  accessor: keyof T | "id";
  header: string;
  type: "text" | "image";
  width?: string | number;
};

interface TableOptions<T> {
  maxRows?: number;
  isActive?: string;
  data: DataType<T>[];
  columns: ColumnType<T>[];
  onPressItem: (id: string) => void;
}

export default function TableApp<T>({
  data,
  columns,
  isActive,
  onPressItem,
  maxRows = 10,
}: TableOptions<T>) {
  const columnHelper = createColumnHelper<DataType<T>>();
  const formattedColumns: ColumnDef<DataType<T>, any>[] = useMemo(
    () =>
      columns.map((col) =>
        columnHelper.accessor(col.accessor as keyof DataType<T>, {
          id: col.id,
          cell: (info) => {
            const value = info.getValue() as string;
            return col.type === "image" ? (
              <Image
                unoptimized
                width={30}
                height={30}
                src={value}
                alt={col.header}
                className="rounded-full w-[30px] h-[30px] object-cover"
              />
            ) : (
              <span>{value}</span>
            );
          },
          header: col.header,
        })
      ),
    [columns, columnHelper]
  );

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const pageIndex = 0;
  const pageSize = maxRows;
  const limitedData = useMemo(() => {
    if (Array.isArray(data)) {
      if (Array.isArray(data)) {
        const startIndex = pageIndex * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
      }
    }
    return [];
  }, [data, maxRows, pageSize]);
  const totalPages = Math.ceil(data.length / pageSize);
  const table = useReactTable({
    data,
    pageCount: totalPages,
    initialState: {
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    columns: formattedColumns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onPreviousPage = useCallback(() => {
    table.previousPage();
  }, []);

  const onNextPage = useCallback(() => {
    table.nextPage();
  }, []);

  const onPressEachItem = useCallback((rowId: string) => {
    onPressItem(rowId);
  }, []);

  return (
    <div className="flex flex-col flex-grow">
      {/* table content */}
      <div className="flex flex-grow">
        <table className="border border-gray-700 w-full text-left shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      width:
                        columns.find((col) => col.id === header.id)?.width ||
                        "auto",
                    }}
                    className="text-slate-500 text-sm px-3.5 py-4 uppercase"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  onClick={() => {
                    onPressEachItem(row.original.id);
                  }}
                  key={row.id}
                  className={`text-black cursor-pointer hover:brightness-110 transition-all delay-[10ms] ${
                    Number(isActive) === row.original.id &&
                    "bg-gradient-to-tr from-green-600 to-green-400 shadow-md shadow-green-500/20 text-white"
                  }
            ${i % 2 === 0 ? "bg-white" : "bg-gray-100"}
            `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3.5 py-2 text-sm"
                      style={{
                        width:
                          columns.find((col) => col.id === cell.column.id)
                            ?.width || "auto",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="text-center h-32">
                <td colSpan={12}>No Recoard Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination content */}
      <div className="flex justify-between items-center pt-5">
        <Button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onPreviousPage}
          isDisabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <Button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onNextPage}
          isDisabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
