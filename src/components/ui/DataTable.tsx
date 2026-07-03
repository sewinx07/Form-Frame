interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onDelete?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onDelete,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border border-charcoal-700/60">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-charcoal-700/60 bg-charcoal-850/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-[9px] font-medium uppercase tracking-[0.15em] text-off-white-muted"
              >
                {col.header}
              </th>
            ))}
            {onDelete && (
              <th className="px-4 py-3 w-14" />
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-700/40">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onDelete ? 1 : 0)}
                className="px-4 py-12 text-center text-sm text-charcoal-400"
              >
                No entries yet.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className="transition-colors duration-200 hover:bg-charcoal-800/60"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-off-white">
                    {col.render(item)}
                  </td>
                ))}
                {onDelete && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(item)}
                      className="text-charcoal-400 hover:text-red-400 transition-colors duration-200 text-[9px] uppercase tracking-[0.15em]"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
