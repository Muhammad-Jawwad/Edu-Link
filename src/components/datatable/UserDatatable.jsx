import "./datatable.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { userColumns, userRows, fetchUserRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { idID } from "@mui/material/locale";
import axios from "axios";
import * as XLSX from 'xlsx';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { serverURL } from "../../temp";

const UserDatatable = () => {
    const [data, setData] = useState(userRows);
    const [loading, setLoading] = useState(false);
    const [resultAlert, setResultAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const qValue = queryParams.get("q");

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const rows = await fetchUserRows(qValue);

            setLoading(false);
            setData(Array.from(rows.data));
        };
        getData();
    }, [qValue]);

    const handleDelete = (id) => {
        setResultAlert(false);
        setSuccessAlert(false);
        setData(data.filter((item) => item.id !== id));
    };

    const formatData = (data) => {
        const formattedData = {};
        formattedData.code = data.code;
        formattedData.status = data.status;
        formattedData.message = data.message;
        formattedData.data = [];

        const userMap = new Map();

        data.data.forEach((item) => {
            const userKey = `${item.user_name}-${item.email}-${item.type}`;

            if (!userMap.has(userKey)) {
                userMap.set(userKey, {
                    user_name: item.user_name,
                    email: item.email,
                    type: item.type,
                    results: [],
                });
            }

            // Convert timestamp to Date object
            const dateObj = new Date(item.date);

            const formattedDate = dateObj.toLocaleDateString(); // Date in a standard format (e.g., 'MM/DD/YYYY')
            const formattedTime = dateObj.toLocaleTimeString(); // Time in a standard format (e.g., 'HH:MM:SS')

            userMap.get(userKey).results.push({
                quiz_name: item.quiz_name,
                category_name: item.category_name,
                no_of_questions: item.no_of_questions,
                score: item.score,
                submitted_at: item.time,
                quiz_duration: `${item.duration} minutes`,
                date: formattedDate,
                time: formattedTime,
            });
        });

        userMap.forEach((user) => {
            formattedData.data.push(user);
        });

        return formattedData;
    };

    const downloadExcel = (data) => {
        // Extract the "results" array from the data object
        const results = data.results;

        if (!Array.isArray(results)) {
            console.error('Invalid data format: "results" is not an array');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(results);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${data.email}-Results.xlsx`);
        setSuccessAlert(true)
    };

    const handleResult = async (id) => {
        try{
            setResultAlert(false);
            setSuccessAlert(false);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${serverURL}/api/admin/userResult`,
                {
                    user_id: id,
                },
                config
            );
            const data = response.data;
            console.log("userResult", data);
            if (data.code === 401 || data.code === 498) {
                window.location.href = "/notFound";
            }
            else if (data && data.data.length !== 0) {
                const formatedData = formatData(data);
                console.log("formatedData", formatedData);
                downloadExcel(formatedData.data[0])
            } else {
                console.log("Got data",data);
                if(data.code === 400){
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
                        <Link to={`/user/${params.row.id}?q=${qValue}`} style={{ textDecoration: "none" }}>
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
                Add New User
                <Link to={`/user/new?q=${qValue}`} className="link">
                    Add New
                </Link>
            </div>
            <>
                {resultAlert === true ? (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="error">Error: This User didn't attempt a quiz yet</Alert>
                    </Stack>
                ) : null}
                {successAlert === true ? (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="success">The user result exported successfully</Alert>
                    </Stack>
                ) : null}
            </>
            {loading ? <h1 style={{ textAlign: "center", paddingTop: "20%" }}>loading...</h1> :
                <DataGrid
                    className="datagrid"
                    rows={data}
                    columns={userColumns.concat(actionColumn)}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                    components={{
                        Toolbar: GridToolbar, // Include the GridToolbar in the Toolbar slot
                    }}

                />}
        </div>
    );
};

export default UserDatatable;