import { Table as TableComponent } from "../sub/Table";

type DataGridProps<T> = {
  columns: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
};

const DataGrid = <T,>({ columns, data, renderRow }: DataGridProps<T>) => {
  return (
    <TableComponent>
      <TableComponent.HeaderRow>
        {columns.map((column, index) => (
          <TableComponent.HeaderCell key={index}>
            {column}
          </TableComponent.HeaderCell>
        ))}
      </TableComponent.HeaderRow>
      {data.map((item, index) => renderRow(item, index))}
    </TableComponent>
  );
};

export default DataGrid;
