"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { MyDocument } from "@/components/MyDocument";
import Template3 from "@/features/invoice/components/templates/Template3";

function Dashboard() {
  return (
    <div className=" flex bg-gray-400/5 p-2 ">
      <div className=" w-[40%]"></div>
      <div className="">
        <PDFViewer>
          <MyDocument />
        </PDFViewer>
      </div>
      <div className="">
        <Template3 />
      </div>
    </div>
  );
}

export default Dashboard;
