import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTable, useGlobalFilter } from "react-table";
import { fetchEmployees, generateUser } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Employee {
  cedula: string;
  primer_nombre: string;
  primer_apellido: string;
  dependencia: {
    nombre: string;
  };
  cargo: {
    nombre: string;
  };
  usuarioDetails?: {
    estado: string;
  };
}

function Usuarios() {
  const queryClient = useQueryClient();
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const [globalFilter, setGlobalFilter] = useState("");

  const generateUserMutation = useMutation({
    mutationFn: generateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      toast.success("Usuario generado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al generar el usuario");
      console.error(error);
    },
  });

  const handleGenerateUser = (cedula: string) => {
    generateUserMutation.mutate({ cedula: parseInt(cedula, 10) });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Cédula",
        accessor: "cedula",
      },
      {
        Header: "Nombre",
        accessor: "primer_nombre",
      },
      {
        Header: "Apellido",
        accessor: "primer_apellido",
      },
      {
        Header: "Dependencia",
        accessor: "dependencia.nombre",
      },
      {
        Header: "Cargo",
        accessor: "cargo.nombre",
      },
      {
        Header: "Nombre de Usuario",
        accessor: "usuarioDetails.nombre_usuario",
        Cell: ({ row }: { row: { original: Employee } }) => (
          <div>
            {row.original.usuarioDetails
              ? row.original.usuarioDetails.nombre_usuario
              : "No tiene usuario"}
          </div>
        ),
      },
      {
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }: { row: { original: Employee } }) => (
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleGenerateUser(row.original.cedula)}
              disabled={!!row.original.usuarioDetails}
              className={`px-4 py-2 rounded ${
                row.original.usuarioDetails
                  ? "bg-gray-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              Generar Usuario
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => employees || [], [employees]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter);

  React.useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los empleados</div>;

  return (
    <div className="p-4">
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Buscar..."
        className="mb-4 p-2 border rounded w-full"
      />
      <table {...getTableProps()} className="min-w-full bg-white">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="p-2 border-b text-left"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="border-b"
                key={row.original.cedula}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="p-2 text-left"
                    key={cell.column.id}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default Usuarios;
