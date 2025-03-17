import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTable, useGlobalFilter } from "react-table";
import {
  fetchPermisos,
  fetchEmployees,
  generatePermiso,
  fetchFeriados,
} from "../services/api";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  differenceInMonths,
  addYears,
  format,
  isSameDay,
  parseISO,
} from "date-fns";
import EmployeeSelectionModal from "./EmployeeSelectionModal";

interface Permiso {
  id: number;
  fecha_permiso: string;
  motivo: string;
  observaciones: string | null;
  funcionarioDetails: {
    cedula: number;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    fecha_ingreso: string;
    dependencia: {
      nombre: string;
    };
    cargo: {
      nombre: string;
      tipoEmpleado: {
        descripcion: string;
      };
    };
  };
}

interface Employee {
  cedula: number;
  primer_nombre: string;
  primer_apellido: string;
  fecha_ingreso: string;
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

interface Feriado {
  fecha: string;
}

const motivos = [
  "Enfermedad del Empleado",
  "Fallecimiento de un familiar",
  "Comparecencia ante autoridades",
  "Pre y Post natal",
  "Examenes medicos",
  "Curso de Adiestramiento",
  "Asistencia a Estudios",
  "Presentación de Examenes",
  "Siniestro",
  "Desempeño de Cargo Academico",
  "Matrimonio del Empleado",
  "Cuidados Maternos",
  "Otro",
];

Modal.setAppElement("#root");

function Permisos() {
  const queryClient = useQueryClient();
  const {
    data: permisos,
    isLoading,
    error,
  } = useQuery<Permiso[]>({
    queryKey: ["permisos"],
    queryFn: fetchPermisos,
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const { data: feriados } = useQuery<Feriado[]>({
    queryKey: ["feriados"],
    queryFn: fetchFeriados,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [employeeModalIsOpen, setEmployeeModalIsOpen] = useState(false);
  const [newPermiso, setNewPermiso] = useState({
    cedula: "",
    fecha_permiso: new Date(),
    motivo: "",
    observaciones: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: generatePermiso,
    onSuccess: () => {
      queryClient.invalidateQueries(["permisos"]);
      setModalIsOpen(false);
      setIsSubmitting(false);
      toast.success("Permiso agregado correctamente");
      setNewPermiso({
        cedula: "",
        fecha_permiso: new Date(),
        motivo: "",
        observaciones: "",
      });
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast.error("Error al agregar el permiso");
      console.log(error);
    },
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "ID Permiso",
        accessor: "id",
      },
      {
        Header: "Fecha de Permiso",
        accessor: "fecha_permiso",
      },
      {
        Header: "Motivo",
        accessor: "motivo",
      },
      {
        Header: "Observaciones",
        accessor: "observaciones",
      },
      {
        Header: "Cédula",
        accessor: "funcionarioDetails.cedula",
      },
      {
        Header: "Nombre",
        accessor: "funcionarioDetails.primer_nombre",
      },
      {
        Header: "Apellido",
        accessor: "funcionarioDetails.primer_apellido",
      },
      {
        Header: "Dependencia",
        accessor: "funcionarioDetails.dependencia.nombre",
      },
      {
        Header: "Cargo",
        accessor: "funcionarioDetails.cargo.nombre",
      },
    ],
    []
  );

  const data = React.useMemo(() => permisos || [], [permisos]);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewPermiso((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null, name: string) => {
    if (date) {
      setNewPermiso((prev) => ({ ...prev, [name]: date }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const formattedPermiso = {
      ...newPermiso,
      fecha_permiso: newPermiso.fecha_permiso.toISOString().split("T")[0],
      funcionario: parseInt(newPermiso.cedula, 10),
    };
    mutation.mutate(formattedPermiso);
  };

  useEffect(() => {
    const isValid =
      newPermiso.cedula && newPermiso.fecha_permiso && newPermiso.motivo;
    setIsFormValid(isValid);
  }, [newPermiso]);

  const handleSelectEmployee = (employee: Employee) => {
    setNewPermiso((prev) => ({
      ...prev,
      cedula: employee.cedula.toString(),
    }));
  };

  const selectedEmployee = employees?.find(
    (emp) => emp.cedula.toString() === newPermiso.cedula
  );

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const isHoliday = (date: Date) => {
    return feriados?.some((holiday) =>
      isSameDay(date, parseISO(holiday.fecha))
    );
  };

  const filterDate = (date: Date) => {
    return isWeekday(date) && !isHoliday(date);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los permisos</div>;

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
          Agregar Permiso
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
        contentLabel="Agregar Permiso"
        className="bg-white p-8 rounded shadow-lg max-w-xl mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Agregar Permiso</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Empleado</label>
            <div className="flex">
              <input
                type="text"
                value={
                  selectedEmployee
                    ? `${selectedEmployee.primer_nombre} ${selectedEmployee.primer_apellido} - ${selectedEmployee.cargo.nombre} - ${selectedEmployee.dependencia.nombre}`
                    : ""
                }
                readOnly
                className="border p-2 w-full"
              />
              <button
                type="button"
                onClick={() => setEmployeeModalIsOpen(true)}
                className="ml-2 px-4 py-2 rounded bg-blue-500 text-white"
              >
                Seleccionar
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha de Permiso</label>
            <DatePicker
              selected={newPermiso.fecha_permiso}
              onChange={(date) => handleDateChange(date, "fecha_permiso")}
              className="border p-2 w-full"
              dateFormat="yyyy-MM-dd"
              filterDate={filterDate}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Motivo</label>
            <select
              name="motivo"
              value={newPermiso.motivo}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Seleccione un motivo</option>
              {motivos.map((motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Observaciones</label>
            <textarea
              name="observaciones"
              value={newPermiso.observaciones}
              onChange={handleInputChange}
              className="border p-2 w-full"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            disabled={!isFormValid || isSubmitting}
          >
            Agregar
          </button>
        </form>
      </Modal>
      <EmployeeSelectionModal
        isOpen={employeeModalIsOpen}
        onRequestClose={() => setEmployeeModalIsOpen(false)}
        onSelectEmployee={handleSelectEmployee}
      />
    </div>
  );
}

export default Permisos;
