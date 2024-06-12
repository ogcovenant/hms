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
import copy from "@/utils/copyText";
import toast, { Toaster as T } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";


export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

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
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const doctor = row.original;

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreSquare size="32" color="#FF8A65" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger>
                <DropdownMenuItem>View Doctor Details</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => {deleteDoctor(doctor.id)}}>
                Remove Doctor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-medium">Doctor Details</DialogTitle>
            </DialogHeader>
            <h2 className="text-2xl mt-3">
              {doctor.firstName} {doctor.lastName}
            </h2>
            <p className="text-lg flex gap-3 items-center">
              <span>{doctor.email}</span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  copy(doctor.email);
                  toast.success("Copied!");
                }}
              >
                <Copy size="20" color="#FF8A65" />
              </span>
            </p>
            <p className="text-lg flex gap-3 items-center">
              <span>{doctor.phoneNumber}</span>{" "}
              <span
                className="cursor-pointer"
                onClick={() => {
                  copy(doctor.phoneNumber);
                  toast.success("Copied!");
                }}
              >
                <Copy size="20" color="#FF8A65" />
              </span>
            </p>
          </DialogContent>
        </Dialog>
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

export default DocTab;
