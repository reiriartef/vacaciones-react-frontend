import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTable, useGlobalFilter } from "react-table";
import { fetchEmployees } from "../services/api";
import Modal from "react-modal";

interface Employee {
  cedula: number;
  primer_nombre: string;
  primer_apellido: string;
  dependencia: {
    nombre: string;
  };
  cargo: {
    nombre: string;
    tipoEmpleado: {
      descripcion: string;
    };
  };
}

interface EmployeeSelectionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSelectEmployee: (employee: Employee) => void;
}

const EmployeeSelectionModal: React.FC<EmployeeSelectionModalProps> = ({
  isOpen,
  onRequestClose,
  onSelectEmployee,
}) => {
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const [globalFilter, setGlobalFilter] = useState("");

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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Seleccionar Empleado"
      className="bg-white p-8 rounded shadow-lg max-w-3xl mx-auto mt-20"
    >
      <h2 className="text-xl font-bold mb-4">Seleccionar Empleado</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="p-2 border rounded w-full"
        />
      </div>
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
                className="border-b cursor-pointer"
                onClick={() => {
                  onSelectEmployee(row.original);
                  onRequestClose();
                }}
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
    </Modal>
  );
};

export default EmployeeSelectionModal;
