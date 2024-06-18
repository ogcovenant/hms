"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { MoreSquare } from "iconsax-react";
import { useEffect, useState } from "react";
import axios from "axios";


export type Appointment = {
  id: string;
  date: string;
  patientName: string;
  doctorName: string;
  status: string;
  userID: string;
};

const markAsComplete = async (id: string) => {
  try {
    const res = await axios.put(
      "/api/appointments",
      {
        appointmentID: id,
        type: "mark",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};

  const handleReschedule = async(id: string) => {
    
    const newDate = document.querySelector("#newDate")

    const res = await axios.put("/api/appointments", {
      appointmentID: id,
      //@ts-ignore
      newDate: newDate.value,
      type: "update"
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })

    window.location.reload()
    console.log(res)
  }

const removeAppointment = async (id: string) => {
  try {
    const res = await axios.delete("/api/appointments", {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        appointmentID: id,
      },
    });
  
    window.location.reload()
  } catch (err) {
    console.log(err);
  }
};

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "patientName",
    header: "Patient",
  },
  {
    accessorKey: "doctorName",
    header: "Doctor",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreSquare size="32" color="#FF8A65" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              {appointment.status === "pending" ? (
                <DropdownMenuItem
                  className="text-green-500"
                  onClick={() => markAsComplete(appointment.id)}
                >
                  Mark as completed
                </DropdownMenuItem>
              ) : null}
              <DialogTrigger>
                <DropdownMenuItem className="text-blue-500">
                  Reschedule Appointment
                </DropdownMenuItem>
              </DialogTrigger>
              {appointment.status === "completed" ? (
                <DropdownMenuItem className="text-red-500" onClick={() => removeAppointment(appointment.id)}>
                  Remove Appointment
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-red-500" onClick={() => removeAppointment(appointment.id)}>
                  Cancel Appointment
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>Rechedule Appointments</DialogHeader>
            <div className="mt-3 w-full">
              <form className="p-3 w-full flex flex-col items-center" onSubmit={(e) => { e.preventDefault(); handleReschedule(appointment.id)}}>
                <div className="w-4/5 gap-1">
                  <p className="text-2xl font-semibold">Former Date:</p>
                  <p>{appointment.date}</p>
                </div>
                <div className="flex flex-col w-4/5 mt-10 gap-1">
                  <label htmlFor="newDate">New Date:</label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 rounded-md border-2 border-black outline-none"
                    id="newDate"
                    name="newDate"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-3 bg-blue-700 p-3 rounded-md w-4/5 text-white"
                >
                  Reschedule
                </button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const Apptab = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  useEffect(() => {
    table.setPageSize(5);
  }, []);

  const handleTabChange = (value: string) => {
    switch (value) {
      case "all":
        table.getColumn("status")?.setFilterValue("");
        break;
      case "past":
        table.getColumn("status")?.setFilterValue("completed");
        break;
      case "upcoming":
        table.getColumn("status")?.setFilterValue("pending");
        break;
    }
  };

  return (
    <>
      <Tabs
        defaultValue="all"
        onValueChange={handleTabChange}
        className="mt-3 w-full"
      >
        <TabsList className="">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
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
    </>
  );
};

export default Apptab;
