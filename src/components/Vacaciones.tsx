import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTable, useGlobalFilter } from "react-table";
import {
  fetchVacaciones,
  fetchEmployees,
  registerVacacion,
  updateVacation,
  fetchFeriados,
  downloadVacationApprovalReport,
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
import { Tooltip } from "@reach/tooltip";
import "@reach/tooltip/styles.css";

interface Vacacion {
  id: number;
  fecha_salida: string;
  fecha_reincorporacion: string;
  año: number;
  dias_disfrutar: number;
  estatus: string;
  fecha_finalizacion: string;
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
  usuarioAprobador: {
    nombre_usuario: string;
    funcionarioDetails: {
      cedula: number;
      primer_nombre: string;
      segundo_nombre: string;
      primer_apellido: string;
      segundo_apellido: string;
      fecha_ingreso: string;
    } | null;
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

Modal.setAppElement("#root");

function Vacaciones() {
  const queryClient = useQueryClient();
  const {
    data: vacaciones,
    isLoading,
    error,
  } = useQuery<Vacacion[]>({
    queryKey: ["vacaciones"],
    queryFn: fetchVacaciones,
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
  const [newVacacion, setNewVacacion] = useState({
    cedula: "",
    fecha_salida: new Date(),
    año: new Date().getFullYear(),
    observaciones: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [validYears, setValidYears] = useState<number[]>([]);
  const [existingYears, setExistingYears] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: registerVacacion,
    onSuccess: () => {
      queryClient.invalidateQueries(["vacaciones"]);
      setModalIsOpen(false);
      setIsSubmitting(false);
      toast.success("Vacación agregada correctamente");
      setNewVacacion({
        cedula: "",
        fecha_salida: new Date(),
        año: new Date().getFullYear(),
        observaciones: "",
      });
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      toast.error("Error al agregar la vacación");
      console.log(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateVacation,
    onSuccess: () => {
      queryClient.invalidateQueries(["vacaciones"]);
      toast.success("Vacación actualizada correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar la vacación");
      console.log(error);
    },
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "ID Vacaciones",
        accessor: "id",
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
        Header: "Fecha de Inicio",
        accessor: "fecha_salida",
      },
      {
        Header: "Fecha de Finalización",
        accessor: "fecha_finalizacion",
      },
      {
        Header: "Fecha de Reincorporación",
        accessor: "fecha_reincorporacion",
      },
      {
        Header: "Año",
        accessor: "año",
      },
      {
        Header: "Días a Disfrutar",
        accessor: "dias_disfrutar",
      },
      {
        Header: "Observaciones",
        accessor: "observaciones",
      },
      {
        Header: "Estatus",
        accessor: "estatus",
      },

      {
        Header: "Aprobado por",
        accessor: "usuarioAprobador.nombre_usuario",
        Cell: ({ row }: { row: { original: Vacacion } }) => (
          <div>
            {row.original.estatus === "APROBADA" ||
            row.original.estatus === "DISFRUTADA" ? (
              <Tooltip
                label={
                  row.original.usuarioAprobador ? (
                    <div>
                      <p>
                        <strong>Nombre:</strong>{" "}
                        {`${row.original.usuarioAprobador.funcionarioDetails?.primer_nombre} ${row.original.usuarioAprobador.funcionarioDetails?.segundo_nombre} ${row.original.usuarioAprobador.funcionarioDetails?.primer_apellido} ${row.original.usuarioAprobador.funcionarioDetails?.segundo_apellido}`}
                      </p>
                      <p>
                        <strong>Cédula:</strong>{" "}
                        {
                          row.original.usuarioAprobador.funcionarioDetails
                            ?.cedula
                        }
                      </p>
                      <p>
                        <strong>Fecha de Ingreso:</strong>{" "}
                        {
                          row.original.usuarioAprobador.funcionarioDetails
                            ?.fecha_ingreso
                        }
                      </p>
                    </div>
                  ) : (
                    "Pendiente"
                  )
                }
              >
                <span className="cursor-pointer">
                  {row.original.usuarioAprobador?.nombre_usuario.toUpperCase()}
                </span>
              </Tooltip>
            ) : (
              "Pendiente"
            )}
          </div>
        ),
      },
      {
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }: { row: { original: Vacacion } }) => (
          <div className="flex space-x-2">
            {row.original.estatus === "SOLICITADA" && (
              <button
                onClick={() => handleUpdateVacation(row.original, "APROBADA")}
                className="px-4 py-2 rounded bg-green-500 text-white"
              >
                Aprobar
              </button>
            )}
            {row.original.estatus !== "SOLICITADA" && (
              <button
                onClick={() => downloadVacationApprovalReport(row.original.id)}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                Generar Planilla
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(() => vacaciones || [], [vacaciones]);

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

  useEffect(() => {
    if (vacaciones) {
      const years = vacaciones.map((vacacion) => vacacion.año);
      setExistingYears(years);
    }
  }, [vacaciones]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewVacacion((prev) => ({ ...prev, [name]: value }));

    if (name === "cedula") {
      const selectedEmployee = employees?.find(
        (emp) => emp.cedula.toString() === value
      );
      if (selectedEmployee) {
        calculateValidYears(new Date(selectedEmployee.fecha_ingreso));
      }
    }
  };

  const handleDateChange = (date: Date | null, name: string) => {
    if (date) {
      setNewVacacion((prev) => ({ ...prev, [name]: date }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const formattedVacacion = {
      ...newVacacion,
      fecha_salida: newVacacion.fecha_salida.toISOString().split("T")[0],
      cedula: parseInt(newVacacion.cedula, 10),
    };
    mutation.mutate(formattedVacacion);
  };

  const handleUpdateVacation = (vacacion: Vacacion, nuevoEstatus: string) => {
    updateMutation.mutate({ ...vacacion, estatus: nuevoEstatus });
  };

  const calculateValidYears = (fechaIngreso: Date) => {
    const currentYear = new Date().getFullYear();
    const validYears = [];
    for (
      let year = fechaIngreso.getFullYear() + 1;
      year <= currentYear;
      year++
    ) {
      const nextAnniversary = addYears(
        fechaIngreso,
        year - fechaIngreso.getFullYear()
      );
      const monthsUntilAnniversary = differenceInMonths(
        nextAnniversary,
        new Date()
      );
      if (monthsUntilAnniversary <= 1) {
        validYears.push(year);
      }
    }
    setValidYears(validYears);
  };

  useEffect(() => {
    const isValid =
      newVacacion.cedula && newVacacion.fecha_salida && newVacacion.año;
    setIsFormValid(isValid);
  }, [newVacacion]);

  const handleSelectEmployee = (employee: Employee) => {
    setNewVacacion((prev) => ({
      ...prev,
      cedula: employee.cedula.toString(),
    }));
    calculateValidYears(new Date(employee.fecha_ingreso));
  };

  const selectedEmployee = employees?.find(
    (emp) => emp.cedula.toString() === newVacacion.cedula
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
  if (error) return <div>Error al cargar las vacaciones</div>;

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
          Agregar Vacación
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
        contentLabel="Agregar Vacación"
        className="bg-white p-8 rounded shadow-lg max-w-xl mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Agregar Vacación</h2>
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
            <label className="block text-gray-700">Fecha de Inicio</label>
            <DatePicker
              selected={newVacacion.fecha_salida}
              onChange={(date) => handleDateChange(date, "fecha_salida")}
              className="border p-2 w-full"
              dateFormat="yyyy-MM-dd"
              filterDate={filterDate}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Año</label>
            <select
              name="año"
              value={newVacacion.año}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            >
              <option value="">Seleccione un año</option>
              {validYears.map((year) => (
                <option
                  key={year}
                  value={year}
                  disabled={existingYears.includes(year)}
                  style={{
                    color: existingYears.includes(year) ? "red" : "black",
                  }}
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Observaciones</label>
            <textarea
              name="observaciones"
              value={newVacacion.observaciones}
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

export default Vacaciones;
