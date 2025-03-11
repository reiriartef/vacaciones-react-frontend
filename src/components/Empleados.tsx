import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTable, useGlobalFilter } from "react-table";
import {
  fetchEmployees,
  registerEmployee,
  fetchCargos,
  fetchDependencias,
} from "../services/api";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    tipo_empleado: string;
  };
}

Modal.setAppElement("#root");

function Empleados() {
  const queryClient = useQueryClient();
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const { data: cargos } = useQuery({
    queryKey: ["cargos"],
    queryFn: fetchCargos,
  });

  const { data: dependencias } = useQuery({
    queryKey: ["dependencias"],
    queryFn: fetchDependencias,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    cedula: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    id_dependencia: "",
    id_cargo: "",
    fecha_ingreso: "",
    fecha_prima: "",
  });

  const mutation = useMutation({
    mutationFn: registerEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setModalIsOpen(false);
      toast.success("Funcionario agregado correctamente");
      setNewEmployee({
        cedula: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        id_dependencia: "",
        id_cargo: "",
        fecha_ingreso: "",
        fecha_prima: "",
      });
    },
    onError: (error: Error) => {
      toast.error("Error al agregar el funcionario");
      console.log(error);
    },
  });

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
        Header: "Fecha de Ingreso",
        accessor: "fecha_ingreso",
      },
      {
        Header: "Fecha de Prima",
        accessor: "fecha_prima",
      },
      {
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }: { row: { original: Employee } }) => (
          <div className="flex flex-col space-y-2">
            <button className="px-4 py-2 rounded bg-yellow-500 text-white">
              Modificar
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null, name: string) => {
    if (date) {
      setNewEmployee((prev) => ({ ...prev, [name]: date }));
    }
  };

  const handleSubmit = () => {
    const formattedEmployee = {
      ...newEmployee,
      fecha_ingreso: newEmployee.fecha_ingreso.toISOString().split("T")[0],
      fecha_prima: newEmployee.fecha_prima.toISOString().split("T")[0],
      id_dependencia: parseInt(newEmployee.id_dependencia, 10),
      id_cargo: parseInt(newEmployee.id_cargo, 10),
      cedula: parseInt(newEmployee.cedula, 10),
    };
    mutation.mutate(formattedEmployee);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los empleados</div>;

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <button
          onClick={() => setModalIsOpen(true)}
          className="px-4 py-2 rounded bg-blue-500 text-white w-5/10"
        >
          Agregar Dependencias
        </button>
        <button
          onClick={() => setModalIsOpen(true)}
          className="ml-2 px-4 py-2 rounded bg-blue-500 text-white w-5/10"
        >
          Agregar Cargos
        </button>
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="p-2 border rounded w-7/10"
        />
        <button
          onClick={() => setModalIsOpen(true)}
          className="ml-2 px-4 py-2 rounded bg-blue-500 text-white w-3/10"
        >
          Agregar funcionario
        </button>
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Agregar Funcionario"
        className="bg-white p-8 rounded shadow-lg max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Agregar Funcionario</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Cédula</label>
            <input
              type="text"
              name="cedula"
              value={newEmployee.cedula}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Primer Nombre</label>
            <input
              type="text"
              name="primer_nombre"
              value={newEmployee.primer_nombre}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Segundo Nombre</label>
            <input
              type="text"
              name="segundo_nombre"
              value={newEmployee.segundo_nombre}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Primer Apellido</label>
            <input
              type="text"
              name="primer_apellido"
              value={newEmployee.primer_apellido}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Segundo Apellido</label>
            <input
              type="text"
              name="segundo_apellido"
              value={newEmployee.segundo_apellido}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Dependencia</label>
            <select
              name="id_dependencia"
              value={newEmployee.id_dependencia}
              onChange={handleInputChange}
              className="border p-2 w-full"
            >
              <option value="">Seleccione una dependencia</option>
              {dependencias?.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cargo</label>
            <select
              name="id_cargo"
              value={newEmployee.id_cargo}
              onChange={handleInputChange}
              className="border p-2 w-full"
            >
              <option value="">Seleccione un cargo</option>
              {cargos?.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nombre} - {cargo.tipoEmpleado.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha de Ingreso</label>
            <DatePicker
              selected={newEmployee.fecha_ingreso}
              onChange={(date) => handleDateChange(date, "fecha_ingreso")}
              className="border p-2 w-full"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha de Prima</label>
            <DatePicker
              selected={newEmployee.fecha_prima}
              onChange={(date) => handleDateChange(date, "fecha_prima")}
              className="border p-2 w-full"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Agregar
          </button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default Empleados;
