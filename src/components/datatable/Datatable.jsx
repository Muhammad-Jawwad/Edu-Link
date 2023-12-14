import "./datatable.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { categoryColumns, categoryRows, fetchCategoryRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Datatable = () => {
  const [data, setData] = useState(categoryRows);
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const qValue = queryParams.get("q");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const rows = await fetchCategoryRows(qValue);

      setLoading(false);
      setData(Array.from(rows.data));
    };
    getData();
  }, []);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/categories/${params.row.id}?q=${qValue}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Category
        <Link to={`/categories/new?q=${qValue}`} className="link">
          Add New
        </Link>
      </div>
      {loading ? (
        <h1 style={{ textAlign: "center", paddingTop: "20%" }}>Loading...</h1>
      ) : (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={categoryColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          components={{
            Toolbar: GridToolbar, // Include the GridToolbar in the Toolbar slot
          }}
        />
      )}
    </div>
  );
};

export default Datatable;