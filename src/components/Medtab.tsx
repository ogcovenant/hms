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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { MoreSquare, Copy } from "iconsax-react";
import { useEffect } from "react";
import toast, { Toaster as T } from "react-hot-toast";
import axios, { AxiosError } from "axios";


export type Medicine = {
  id: string;
  productName: string;
  type: string;
  price: string;
  inStock: string;
  expiry: string
  manufacturer: string
};

export const MedCOlumn: ColumnDef<Medicine>[] = [
  {
    accessorKey: "productName",
    header: "Product Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "inStock",
    header: "In Stock",
  },
  {
    accessorKey: "expiry",
    header: "Expiry Date",
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const medicine = row.original;

      return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreSquare size="32" color="#FF8A65" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>View Medicine Details</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Delete Medicine
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      );
    },
  },
];  

const deleteDoctor = async( id: string ) => {
  try{
    const res = await axios.delete("/api/doctors", {
      data: { id },
    })

    if(res.status === 200){
      toast.success("Doctor Removed Successfully")
      window.location.reload()
    }
  }catch(err){

    const error = err as AxiosError

    if (error.response && error.response.status === 500) {
      toast.error("An unexpected error occured!");
    }

    if (error.response && error.response.status === 401) {
      window.location.replace("/login")
    }

    if (error.response && error.response.status === 404) {
      toast.error("Doctor to delete does not exist!")
    }
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const Medtab = <TData, TValue>({
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
      <div>
        <T />
      </div>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
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

export default Medtab;
