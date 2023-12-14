import axios from "axios";
import { serverURL } from "./temp";

//#region :  USERS DATATABLE SOURCE

export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "User",
    width: 230,
  },
  {
    field: "profile_picture",
    headerName: "Picture",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img src={params.value} alt="Profile" className="cellImg" />
        </div>
      );
    },
  },
  {
    field: "email_id",
    headerName: "Email Id",
    width: 230,
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 230,
  },
  {
    field: "mobile_number",
    headerName: "Contact",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const fetchUserRows = async (qValue) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (qValue === "ALL") {
      const apiUrl = `${serverURL}/api/admin/registeredstudents`;
      const response = await fetch(apiUrl, config);
      console.log("Response", response);
      const data = await response.json();
      console.log("data", data);
      if (data.code === 401 || data.code === 498) {
        window.location.href = "/notFound";
      }
      return data;
    }
    console.log("qValue", qValue)
    const response = await axios.post(`${serverURL}/api/admin/userByType`,
      {
        type: qValue,
      },
      config
    );
    const data = response.data;
    console.log("data", data);
    if (data.code === 401 || data.code === 498) {
      window.location.href = "/notFound";
    }
    return data;
  } catch (error) {
    console.error(error);
    if (error.response && (error.response.status === 401 || error.response.status === 498)) {
      console.error("Unauthorized: Please log in");
      window.location.href = "/notFound";
    }
  }
};

export const userRows = [];

//#endregion

//#region :  CATEGORIES DATATABLE SOURCE

export const categoryColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "category_name",
    headerName: "Category",
    width: 230,
  },
  {
    field: "category_picture",
    headerName: "Picture",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img src={params.value} alt="Profile" className="cellImg" />
        </div>
      );
    },
  },

  {
    field: "no_of_quiz",
    headerName: "Number of Quiz",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const fetchCategoryRows = async (qValue) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (qValue === "ALL") {
      const apiUrl = `${serverURL}/api/admin/getcategory`;
      const response = await fetch(apiUrl, config);
      const data = await response.json();
      console.log("data", data);
      if (data.code === 401 || data.code === 498) {
        window.location.href = "/notFound";
      }
      return data;
    }
    console.log("qValue", qValue)
    const response = await axios.post(`${serverURL}/api/admin/categoryByType`,
      {
        type: qValue,
      },
      config
    );
    const data = response.data;
    console.log("data", data);
    if (data.code === 401 | data.code === 498) {
      window.location.href = "/notFound";
    }
    return data;

  } catch (error) {
    console.error(error);
    if (error.response && (error.response.status === 401 || error.response.status === 498)) {
      console.error("Unauthorized: Please log in");
      window.location.href = "/notFound";
    }
  }
};

export const categoryRows = [];

//#endregion

//#region :  QUIZ DATATABLE SOURCE

export const quizColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "quiz_no",
    headerName: "Quiz Number",
    width: 230,
  },
  {
    field: "category_name",
    headerName: "Category",
    width: 230,
  },
  {
    field: "quiz_name",
    headerName: "Quiz Name",
    width: 230,
  },
  {
    field: "picture",
    headerName: "Picture",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img src={params.value} alt="Profile" className="cellImg" />
        </div>
      );
    },
  },
  {
    field: "no_of_questions",
    headerName: "Number of Questions",
    width: 230,
  },
  {
    field: "description",
    headerName: "Description",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const fetchQuizRows = async (qValue) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (qValue === "ALL") {
      const apiUrl = `${serverURL}/api/admin/getquiz`;
      const response = await fetch(apiUrl, config);
      const data = await response.json();
      if (data.code === 401 || data.code === 498) {
        window.location.href = "/notFound";
      }
      return data;
    }
    console.log("qValue", qValue)
    const response = await axios.post(`${serverURL}/api/admin/quizByType`,
      {
        type: qValue,
      },
      config
    );
    const data = response.data;
    console.log("data", data);
    console.log("category_name", data.category_name);
    if (data.code === 401 || data.code === 498) {
      window.location.href = "/notFound";
    }
    return data;

  } catch (error) {
    console.error(error);
    if (error.response && (error.response.status === 401 || error.response.status === 498)) {
      console.error("Unauthorized: Please log in");
      window.location.href = "/notFound";
    }
  }
};

export const quizRows = [];

//#endregion

//#region :  QUESTIONS DATATABLE SOURCE

export const questionColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "quiz_name",
    headerName: "Quiz",
    width: 230,
  },
  {
    field: "question",
    headerName: "Question",
    width: 230,
  },
  {
    field: "option_1",
    headerName: "Option 1",
    width: 230,
  },
  {
    field: "option_2",
    headerName: "Option 2",
    width: 230,
  },
  {
    field: "option_3",
    headerName: "Option 3",
    width: 230,
  },
  {
    field: "option_4",
    headerName: "Option 4",
    width: 230,
  },
  {
    field: "correct_option",
    headerName: "Correct Option",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const fetchQuestionRows = async (qValue) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (qValue === "ALL") {
      const apiUrl = `${serverURL}/api/admin/getquestion`;
      const response = await fetch(apiUrl, config);
      const data = await response.json();
      if (data.code === 401 || data.code === 498) {
        window.location.href = "/notFound";
      }
      return data;
    }
    console.log("qValue", qValue)
    const response = await axios.post(`${serverURL}/api/admin/questionByType`,
      {
        type: qValue,
      },
      config
    );
    const data = response.data;
    console.log("data", data);
    if (data.code === 401 || data.code === 498) {
      window.location.href = "/notFound";
    }
    return data;

  } catch (error) {
    console.error(error);
    if (error.response && (error.response.status === 401 || error.response.status === 498)) {
      console.error("Unauthorized: Please log in");
      window.location.href = "/notFound";
    }
  }
};

export const questionRows = [];

//#endregion

//#region :  REVIEW QUESTIONS DATATABLE SOURCE

export const reviewColumns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "question",
    headerName: "Question",
    width: 1060,
  },
];

export const fetchReviewRows = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    };
    const attemptCode = localStorage.getItem("attemptCode");
    const quizId = localStorage.getItem("quizId");
    const userId = localStorage.getItem("userId");
    const body = {
      user_id: userId,
      quiz_id: quizId,
      attemptCode
    };

    const apiUrl = `${serverURL}/api/users/getreviewquestionlist`;
    const response = await axios.post(apiUrl,
      body,
      config
    );
    const responseData = response.data;

    // Check if 'data' property is defined and is an array
    if (Array.isArray(responseData.data)) {
      let data = responseData.data;

      // Fetch additional data for each item in the 'data' array
      const questionPromises = data.map(async (item) => {
        const questionId = item.question_id;
        const questionUrl = `${serverURL}/api/users/questionbyid/${questionId}`;
        const response = await axios.get(questionUrl, config);
        const questionData = response.data;

        // Assign the 'questionDetails' object directly to the item
        item = questionData.data;

        // Return the modified item
        return item;
      });

      const resolvedQuestions = await Promise.all(questionPromises);
      console.log("resolvedQuestions", resolvedQuestions)

      // Build a JSON object with the required structure
      const jsonData = {
        code: responseData.code,
        status: responseData.status,
        message: responseData.message,
        data: resolvedQuestions
      };
      console.log("jsonData", jsonData)
      return jsonData;
    } else {
      throw new Error("Invalid response data");
    }

  } catch (error) {
    console.error(error);
    if (error.response && (error.response.status === 401 || error.response.status === 498)) {
      console.error("Unauthorized: Please log in");
      window.location.href = "/notFound";
    }
    window.location.href = "/notFound";
  }
};

export const reviewRows = [];

//#endregion