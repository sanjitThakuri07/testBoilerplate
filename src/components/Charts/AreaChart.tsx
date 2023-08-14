import React from "react";
import { Box } from "@mui/material";
import Chart from "react-apexcharts";

export default function AreaChart() {
  const [options, setOptions] = React.useState<any>({
    chart: {
      type: "area",
      foreColor: "#515862",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "linear",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 900,
        },
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#00E396"],
    grid: {
      borderColor: "#555",
      show: false, // you can either change hear to disable all grids
      xaxis: {
        lines: {
          show: false, //or just here to disable only x axis grids
        },
      },
      yaxis: {
        lines: {
          show: false, //or just here to disable only y axis
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },

    // markers: {
    //   size: 3,
    //   colors: ["#000524"],
    //   strokeColor: "#00E396",
    //   strokeWidth: 2,
    // },

    xaxis: {
      tooltip: {
        enabled: false,
      },
      type: "message",
      categories: ["", ""],
    },
  });

  const [series, setSeries] = React.useState<any>([
    {
      name: "Message",
      data: [560, 120],
    },
  ]);

  return (
    <>
      <div id="chart" className="charts-alignment cursor-pointer">
        <Chart options={options} series={series} type="area" height={100} width={170} />
      </div>
    </>
  );
}
