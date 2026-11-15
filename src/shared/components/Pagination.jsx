import PaginationButton from "./PaginationButton";

function buildPages(currentPage, lastPage) {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const pages = [1, lastPage, currentPage - 1, currentPage, currentPage + 1]
    .filter((page, index, list) => page >= 1 && page <= lastPage && list.indexOf(page) === index)
    .sort((a, b) => a - b);

  const visiblePages = [];
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      visiblePages.push(`ellipsis-${page}`);
    }
    visiblePages.push(page);
  });

  return visiblePages;
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
  isLoading = false,
}) {
  if (!total || lastPage < 1) return null;

  const pages = buildPages(currentPage, lastPage);

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-primary/70">
        Mostrando {from || 0}–{to || 0} de {total}
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <PaginationButton
          ariaLabel="Página anterior"
          disabled={isLoading || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </PaginationButton>

        {pages.map((page) =>
          typeof page === "string" ? (
            <span key={page} className="px-2 text-sm text-text-primary/60">
              ...
            </span>
          ) : (
            <PaginationButton
              key={page}
              active={page === currentPage}
              disabled={isLoading}
              ariaLabel={`Página ${page}`}
              onClick={() => {
                if (page !== currentPage) onPageChange(page);
              }}
            >
              {page}
            </PaginationButton>
          )
        )}

        <PaginationButton
          ariaLabel="Próxima página"
          disabled={isLoading || currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </PaginationButton>
      </div>
    </div>
  );
}
