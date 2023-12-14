import "./datatable.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { quizColumns, quizRows, fetchQuizRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { serverURL } from "../../temp";

const QuizDatatable = () => {
    const [data, setData] = useState(quizRows);
    const [loading, setLoading] = useState(false);
    const [resultAlert, setResultAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const rows = await fetchQuizRows(qValue);

            setLoading(false);
            setData(Array.from(rows.data));
        };
        getData();
    }, []);

    const handleDelete = (id) => {
        setResultAlert(false);
        setSuccessAlert(false);
        setData(data.filter((item) => item.id !== id));
    };

    const formatData = (data) => {
        const formattedData = data.map(item => {
            // Convert timestamp to Date object
            const dateObj = new Date(item.date);

            const formattedDate = dateObj.toLocaleDateString(); // Date in a standard format (e.g., 'MM/DD/YYYY')
            const formattedTime = dateObj.toLocaleTimeString(); // Time in a standard format (e.g., 'HH:MM:SS')

            const formattedDuration = `${item.duration} minutes`;

            return {
                ...item,
                date: formattedDate,
                submitted_at: item.time,
                time: formattedTime,
                quiz_duration: formattedDuration,
            };
        });

        return formattedData;
    };

    const downloadExcel = (data) => {
        // Extract the "results" array from the data object
        const results = data;

        if (!Array.isArray(results)) {
            console.error('Invalid data format: "results" is not an array');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(results);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${data[0].quiz_name}(${data[0].category_name})-Results.xlsx`);
        setSuccessAlert(true)
    };

    const handleResult = async (id) => {
        setResultAlert(false);
        setSuccessAlert(false);
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${serverURL}/api/admin/quizResult`,
                {
                    quiz_id: id,
                },
                config
            );
            const data = response.data;
            console.log("quizResult", data);
            if (data.code === 401 || data.code === 498) {
                window.location.href = "/notFound";
            }
            else if (data && data.data.length !== 0) {
                const formatedData = formatData(data.data);
                console.log("formatedData", formatedData);
                downloadExcel(formatedData)
            } else {
                if (data.code === 400) {
                    console.log("Got data", data)
                    setResultAlert(true);
                }
                console.error('Invalid data received from the API.');
            }
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 498)) {
                console.error("Unauthorized: Please log in");
                window.location.href = "/notFound";
            }
        }
    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/quizList/${params.row.id}?q=${qValue}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div style={{ textDecoration: "none", color: "green" }}
                            className="deleteButton"
                            onClick={() => handleResult(params.row.id)}
                        >
                            Result
                        </div>
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
                Add New Quiz
                <Link to={`/quizList/new?q=${qValue}`} className="link">
                    Add New
                </Link>
            </div>
            <>
                {resultAlert === true ? (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="error">Error: This Quiz didn't attempt by any user yet</Alert>
                    </Stack>
                ) : null}
                {successAlert === true ? (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="success">The quiz result exported successfully</Alert>
                    </Stack>
                ) : null}
            </>
            {loading ? <h1 style={{ textAlign: "center", paddingTop: "20%" }}>loading...</h1> :
                <DataGrid
                    className="datagrid"
                    rows={data}
                    columns={quizColumns.concat(actionColumn)}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                    // checkboxSelection
                    components={{
                        Toolbar: GridToolbar, // Include the GridToolbar in the Toolbar slot
                    }}
                />}
        </div>
    );
};

export default QuizDatatable;