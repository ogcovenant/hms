"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreSquare } from "iconsax-react";
import { useEffect } from "react";

export type Appointment = {
  id: string;
  time: string;
  date: string;
  patientName: string;
  doctor: string;
};

export const appointments: Appointment[] = [
  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },
  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },
  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },
  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },
  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },
  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },
  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },

  {
    id: "12223e3e",
    time: "9:30 AM",
    date: "05/12/2024",
    patientName: "Patricia Ogungbe",
    doctor: "Dr. John",
  },
];

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
  },
  {
    accessorKey: "doctor",
    header: "Doctor",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreSquare size="32" color="#FF8A65" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
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

const Dashtab = <TData, TValue>({
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
    <Tabs defaultValue="upcoming" className="mt-3 w-full">
      <TabsList className="">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
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
      </TabsContent>
      <TabsContent value="past">
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
      </TabsContent>
    </Tabs>
  );
};

export default Dashtab;
