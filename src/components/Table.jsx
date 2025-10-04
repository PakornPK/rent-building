import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DocumentMagnifyingGlassIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/16/solid';
import { IconButton } from '@mui/material';

const Table = ({ data, columns, onView, onEdit, onDelete, loading }) => {
  const actionColumn = (onView || onEdit || onDelete)
    ? {
      field: "actions",
      headerName: "Action",
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: (params) => (
        <>
          {onView && (
            <IconButton onClick={() => onView(params.row)}>
              <DocumentMagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
            </IconButton>
          )}
          {onEdit && (
            <IconButton onClick={() => onEdit(params.row)}>
              <PencilSquareIcon className="h-5 w-5 text-green-600" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton onClick={() => onDelete(params.row)}>
              <TrashIcon className="h-5 w-5 text-red-600" />
            </IconButton>
          )}
        </>
      ),
    }
    : null;

  const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={Array.isArray(data) ? data : []}
        columns={finalColumns}
        rowCount={data.total_rows || 0}
        pagination
        paginationMode="server"
        disableSelectionOnClick
        loading={loading}
        hideFooter={true}
      />
    </div>
  );
};

export default Table;
