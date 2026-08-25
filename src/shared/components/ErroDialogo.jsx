import React from "react";

export default function ErroDialogo({
  showPopUp,
  titulo,
  mensagem,
  confirmarDialogo,
  fecharDialogo,
}) {
  if (!showPopUp) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-gray-500/50 transition-opacity"
        onClick={fecharDialogo}
      />

      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        {/* Conteúdo */}
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            {/* Ícone Redondo */}
            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
              <svg
                className="size-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>

            {/* Texto */}
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-base font-semibold text-gray-900">
                {titulo}
              </h3>
              <div className="mt-2">
                <p class="text-sm text-gray-500">{mensagem}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
          <button
            type="button"
            onClick={confirmarDialogo}
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:w-auto"
          >
            Confirmar
          </button>
          <button
            type="button"
            onClick={fecharDialogo}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
