import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTable, useGlobalFilter } from "react-table";
import { fetchDependencias, registerDependencia } from "../services/api";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Dependencia {
  id: number;
  nombre: string;
}

Modal.setAppElement("#root");

function Dependencias() {
  const queryClient = useQueryClient();
  const {
    data: dependencias,
    isLoading,
    error,
  } = useQuery<Dependencia[]>({
    queryKey: ["dependencias"],
    queryFn: fetchDependencias,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newDependencia, setNewDependencia] = useState({
    nombre: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const mutation = useMutation({
    mutationFn: registerDependencia,
    onSuccess: () => {
      queryClient.invalidateQueries(["dependencias"]);
      setModalIsOpen(false);
      toast.success("Dependencia agregada correctamente");
      setNewDependencia({
        nombre: "",
      });
    },
    onError: (error: Error) => {
      toast.error("Error al agregar la dependencia");
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
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }: { row: { original: Dependencia } }) => (
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

  const data = React.useMemo(() => dependencias || [], [dependencias]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDependencia((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    mutation.mutate(newDependencia);
  };

  useEffect(() => {
    const isValid = newDependencia.nombre.trim() !== "";
    setIsFormValid(isValid);
  }, [newDependencia]);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar las dependencias</div>;

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
          Agregar dependencia
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
        contentLabel="Agregar Dependencia"
        className="bg-white p-8 rounded shadow-lg max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Agregar Dependencia</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={newDependencia.nombre}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
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

export default Dependencias;
