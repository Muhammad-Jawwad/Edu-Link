import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { serverURL } from "../../temp";

const Chart = ({ aspect, title }) => {
  const [token] = useState(localStorage.getItem("token"));
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const qValue = queryParams.get("q");
  const [graphStats, setGraphStats] = useState([]);


  const data = [
    { name: "Jan", Total: 1200 },
    { name: "Feb", Total: 2100 },
    { name: "Mar", Total: 800 },
    { name: "Apr", Total: 1600 },
    { name: "May", Total: 900 },
    { name: "Jun", Total: 1700 },
    { name: "July", Total: 1200 },
    { name: "Aug", Total: 2100 },
    { name: "Sep", Total: 800 },
    { name: "Oct", Total: 1600 },
    { name: "Nov", Total: 900 },
    { name: "Dec", Total: 1700 }
  ];

  const fetchHomeStats = async (qValue) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${serverURL}/api/admin/graphStats`,
        {
          type: qValue,
        },
        config
      );
      const data = response.data;
      setGraphStats(data.data);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchHomeStats(qValue);
    };

    fetchData();
    console.log(graphStats);
  }, [qValue]);

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart data={graphStats} margin={{ top: 20, right: 30, left: 30, bottom: 30 }}>
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" angle={-0} textAnchor="end" interval={0} />
          <YAxis label={{ value: "Attempted Quiz", angle: -90, position: "insideLeft" }} />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip
            contentStyle={{ background: "white", border: "1px solid white" }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="Total"
            name="Months"
            stroke="#8884d8" // Change the color to a more appealing one
            fillOpacity={0.8}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;


// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import "./chart.scss";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis, // Add YAxis for labeling
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend, // Add Legend for explaining the area
// } from "recharts";

// const Chart = ({ aspect, title }) => {
//   const [token] = useState(localStorage.getItem("token"));
//   const { search } = useLocation();
//   const queryParams = new URLSearchParams(search);
//   const qValue = queryParams.get("q");
//   const [graphStats, setGraphStats] = useState([]);

//   const fetchHomeStats = async (qValue) => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response = await axios.post(
//         `${serverURL}/api/admin/graphStats`,
//         {
//           type: qValue,
//         },
//         config
//       );
//       const data = response.data;
//       setGraphStats(data.data);
//     } catch (error) {
//       console.error("Error fetching quiz data:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchHomeStats(qValue);
//     };

//     fetchData();
//     console.log(graphStats);
//   }, [qValue]);

//   return (
//     <div className="chart">
//       <div className="title">{title}</div>
//       <ResponsiveContainer width="100%" aspect={aspect}>
//         <AreaChart data={graphStats} margin={{ top: 20, right: 30, left: 30, bottom: 90 }}>
//           <defs>
//             <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
//               <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <XAxis dataKey="quiz_name" stroke="gray" angle={-45} textAnchor="end" interval={0} />
//           <YAxis label={{ value: "Number of Attempts", angle: -90, position: "insideLeft" }} />
//           <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
//            <Tooltip
//               contentStyle={{ background: "white", border: "1px solid #ccc" }}
//               labelStyle={{ color: "#8884d8" }}
//               itemStyle={{ color: "#8884d8" }}
//             />
//           <Legend />
//           <Area
//             type="monotone"
//             dataKey="number_of_attempts"
//             name="Attempts" // Label for the area in the legend
//             stroke="#8884d8"
//             fillOpacity={0.8}
//             fill="url(#total)"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default Chart;
