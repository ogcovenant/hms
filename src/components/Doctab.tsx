"use client";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreSquare } from "iconsax-react";
import { useEffect } from "react";

export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
};

export const Doctors: Doctor[] = [
  {
    id: "12223e3e",
    firstName: "Covenant",
    lastName: "Ogowale",
    email: "justcovenant@gmail.com",
    phoneNo: "09038168618",
  },{
    id: "12223e3e",
    firstName: "Covenant",
    lastName: "Ogowale",
    email: "justcovenant@gmail.com",
    phoneNo: "09038168618",
  },
  {
    id: "12223e3e",
    firstName: "Covenant",
    lastName: "Ogowale",
    email: "justcovenant@gmail.com",
    phoneNo: "09038168618",
  },
  {
    id: "12223e3e",
    firstName: "Covenant",
    lastName: "Ogowale",
    email: "justcovenant@gmail.com",
    phoneNo: "09038168618",
  },
  {
    id: "12223e3e",
    firstName: "Covenant",
    lastName: "Ogowale",
    email: "justcovenant@gmail.com",
    phoneNo: "09038168618",
  },
  {
    id: "12223e3e",
    firstName: "Covenant",
    lastName: "Ogowale",
    email: "justcovenant@gmail.com",
    phoneNo: "09038168618",
  },
  {
    id: "12223e3e",
    firstName: "Covenant",
    lastName: "Ogowale",
    email: "justcovenant@gmail.com",
    phoneNo: "09038168618",
  },
];

export const columns: ColumnDef<Doctor>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNo",
    header: "Phone Number",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const doctors = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreSquare size="32" color="#FF8A65" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Doctor Details</DropdownMenuItem>
            <DropdownMenuItem>Message</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Remove Doctor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const DocTab = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setPageSize(5);
  }, []);

  return (

        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="max-h-64 overflow-y-auto">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
  );
};

export default DocTab;
