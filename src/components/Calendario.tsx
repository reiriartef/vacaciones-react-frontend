import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeriados, addFeriado } from "../services/api";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface Holiday {
  fecha: string;
  titulo: string;
}

Modal.setAppElement("#root");

function Calendario() {
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newHolidayDate, setNewHolidayDate] = useState<Date | null>(null);
  const [newHolidayTitle, setNewHolidayTitle] = useState("");
  const queryClient = useQueryClient();

  const {
    data: holidays,
    isLoading,
    error,
  } = useQuery<Holiday[]>({
    queryKey: ["feriados"],
    queryFn: fetchFeriados,
  });

  const mutation = useMutation({
    mutationFn: addFeriado,
    onSuccess: () => {
      toast.success("Feriado agregado exitosamente");
      queryClient.invalidateQueries(["feriados"]);
    },
  });

  const onChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const holiday = holidays?.find((holiday) => {
        const holidayDate = new Date(holiday.fecha + "T00:00:00"); // Asegúrate de que la fecha se interprete correctamente en la zona horaria local
        return (
          holidayDate.toLocaleDateString("es-ES") ===
          date.toLocaleDateString("es-ES")
        );
      });
      return holiday ? <p className="text-red-500">{holiday.titulo}</p> : null;
    }
  };

  const handleAddHoliday = () => {
    if (newHolidayDate && newHolidayTitle) {
      mutation.mutate({
        fecha: newHolidayDate.toISOString().split("T")[0],
        titulo: newHolidayTitle,
      });
      setModalIsOpen(false);
      setNewHolidayDate(null);
      setNewHolidayTitle("");
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los días feriados</div>;

  return (
    <div className="flex flex-col items-center m-4">
      <Calendar
        onChange={onChange}
        value={date}
        locale="es-ES" // Asegúrate de que el calendario use la cultura española
        tileContent={tileContent}
        className="min-w-full"
      />
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={() => setModalIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          Agregar Feriado
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Agregar Feriado"
        className="bg-white p-8 rounded shadow-lg max-w-md mx-auto mt-20"
      >
        <h2 className="text-xl font-bold mb-4">Agregar Feriado</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Título</label>
            <input
              type="text"
              value={newHolidayTitle}
              onChange={(e) => setNewHolidayTitle(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha</label>
            <DatePicker
              selected={newHolidayDate}
              onChange={(date) => setNewHolidayDate(date)}
              className="border p-2 w-full rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleAddHoliday}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Agregar
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Calendario;
