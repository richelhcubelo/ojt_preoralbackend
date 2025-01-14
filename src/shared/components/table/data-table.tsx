import React from "react";
import "./data-table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Ensure you import FontAwesomeIcon
import { faEdit } from "@fortawesome/free-solid-svg-icons"; // Ensure you import the edit icon

interface Column {
  header: string | React.ReactNode; // Allow header to be a string or React node
  key: string;
  render?: (row: any) => React.ReactNode; // Allow custom render function
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  actions?: (row: any) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, actions }) => {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="centered">
                {" "}
                {/* Center all headers */}
                {col.header}
              </th>
            ))}
            {actions && <th className="centered">Actions</th>}{" "}
            {/* Center actions header */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}{" "}
                  {/* Use render function if available */}
                </td>
              ))}
              {actions && (
                <td className="action-icons">
                  {" "}
                  {/* Center align icons in Action column */}
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => actions(row)} // Call action for edit
                    className="edit-icon" // Optional: Add a class for styling
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
