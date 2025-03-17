import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTable, useGlobalFilter } from "react-table";
import { fetchCargos, registerCargo } from "../services/api";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Cargo {
  id: number;
  nombre: string;
  tipo_empleado: string;
}

Modal.setAppElement("#root");

function Cargos() {
  const queryClient = useQueryClient();
  const {
    data: cargos,
    isLoading,
    error,
  } = useQuery<Cargo[]>({
    queryKey: ["cargos"],
    queryFn: fetchCargos,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newCargo, setNewCargo] = useState({
    nombre: "",
    tipo_empleado: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const mutation = useMutation({
    mutationFn: registerCargo,
    onSuccess: () => {
      queryClient.invalidateQueries(["cargos"]);
      setModalIsOpen(false);
      toast.success("Cargo agregado correctamente");
      setNewCargo({
        nombre: "",
        tipo_empleado: "",
      });
    },
    onError: (error: Error) => {
      toast.error("Error al agregar el cargo");
      console.log(error);
    },
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Nombre",
        accessor: "nombre",
      },
      {
        Header: "Tipo de Empleado",
        accessor: "tipoEmpleado.descripcion",
      },
      /* {
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }: { row: { original: Cargo } }) => (
          <div className="flex flex-col space-y-2">
            <button className="px-4 py-2 rounded bg-yellow-500 text-white">
              Modificar
            </button>
          </div>
        ),
      }, */
    ],
    []
  );

  const data = React.useMemo(() => cargos || [], [cargos]);

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
    setNewCargo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    mutation.mutate(newCargo);
  };

  useEffect(() => {
    const isValid =
      newCargo.nombre.trim() !== "" && newCargo.tipo_empleado !== "";
    setIsFormValid(isValid);
  }, [newCargo]);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los cargos</div>;

  return (
    <div className="p-4">
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
          Agregar cargo
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
                key={row.original.id}
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
        contentLabel="Agregar Cargo"
        className="bg-white p-8 rounded shadow-lg max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Agregar Cargo</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={newCargo.nombre}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tipo de Empleado</label>
            <select
              name="tipo_empleado"
              value={newCargo.tipo_empleado}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="1">Empleado</option>
              <option value="2">Obrero</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            disabled={!isFormValid}
          >
            Agregar
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Cargos;
