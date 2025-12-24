import { useState, useMemo, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import 'ag-grid-enterprise';
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey('YOUR_LICENSE_KEY_HERE');
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);
import BoysLogo from '../boys_icon.jpg'
import GirlsLogo from '../girls_icon.jpg'
import { fetchStudents } from "../data/student";

function StudentTable(){
    const gridRef=useRef();
    
    const [rowData, setRowData] = useState([]);
const treeData = rowData.map(student => ({
  ...student,
  orgHierarchy: [student.class, student.gender, student.city, student.name]
}));

  useEffect(() => {
    fetchStudents().then((data) => setRowData(data));
  }, []);

    const columnDefs = useMemo(() => [
  {
    field: "id",
    headerName: "Student ID",
    sortable: true,
    enableRowGroup: true,
    editable: true,
    rowDrag:true,
    filter: "agTextColumnFilter",
    resizable:true
  },
  {
    field: "name",
    headerName: "Name",
    sortable: true,
    editable: true,
    enableRowGroup: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "age",
    headerName: "Age",
    sortable: true,
    enableRowGroup: true,
    filter: "agNumberColumnFilter",
  },
  {
    field: "class",
    headerName: "Class",
    sortable: false,
    editable: true,
    enableRowGroup: true,
    filter: "agTextColumnFilter",
    cellRenderer: (params) => {
      if (!params.data) return null;

      return (
        <p>
          <span
            style={{
              display:
                params.data.class === "10th" || params.data.class === "12th"
                  ? "inline"
                  : "none",
              borderRadius: "100px",
              backgroundColor: "rgba(181, 250, 255, 1)",
              padding: "2px 6px",
              color: "rgba(9, 32, 102, 1)",
              fontFamily: "cursive",
              marginRight: "4px",
            }}
          >
            <b>P</b>
          </span>
          {params.data.class}
        </p>
      );
    },
  },
  {
    field: "gender",
    headerName: "Gender",
    sortable: true,
    enableRowGroup: true,
    filter: "agTextColumnFilter",
    cellRenderer: (params) => {
      if (!params.data) return null;

      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img
            src={params.data.gender === "Male" ? BoysLogo : GirlsLogo}
            alt="gender"
            width={30}
            style={{ marginTop: "-15px" }}
          />
          <p>{params.data.gender}</p>
        </div>
      );
    },
  },
  {
    field: "marks",
    headerName: "Total Marks",
    sortable: true,
    editable: true,
    enableRowGroup: true,
    filter: "agNumberColumnFilter",
    cellRenderer: (params) => {
      if (!params.data) return null;

      return (
        <p
          style={{
            backgroundColor:
              params.data.marks >= 90
                ? "rgba(139, 244, 135, 1)"
                : params.data.marks >= 50
                ? "rgba(255, 248, 177, 1)"
                : "rgba(235, 165, 165, 1)",
            textAlign: "center",
          }}
        >
          <b>{params.data.marks}</b>
        </p>
      );
    },
  },
  {
    field: "Attendance",
    headerName: "Attendance",
    sortable: true,
    enableRowGroup: true,
    editable: true,
    filter: "agNumberColumnFilter",
    cellRenderer: (params) => {
      if (!params.data) return null;

      return (
        <p
          style={{
            backgroundColor:
              params.data.Attendance >= 90
                ? "rgba(139, 244, 135, 1)"
                : params.data.Attendance > 75
                ? "rgba(255, 248, 177, 1)"
                : "rgba(222, 139, 139, 1)",
            textAlign: "center",
          }}
        >
          <b>{params.data.Attendance}</b>
        </p>
      );
    },
  },
  {
    field: "city",
    headerName: "City",
    sortable: true,
    enableRowGroup: true,
    editable: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "phone",
    headerName: "Phone Number",
    sortable: true,
    editable: true,
    filter: "agNumberColumnFilter",
  },
  {
    field: "join_date",
    headerName: "Join Date",
    sortable: true,
    enableRowGroup: true,
    filter: "agDateColumnFilter",
  },
], []);


    const exportCsv=()=>{
        gridRef.current.api.exportDataAsCsv();
        console.log(rowData.length);
    }

    
    let dup_arr=new Set();
    const [value,setValue]=useState(0);
    useEffect(() => {
  const dup_arr = new Set();
  rowData.forEach(student => dup_arr.add(student.class));
  setValue(dup_arr.size);
}, [rowData]);  // <--- watch rowData

    const [Tree,setTree] = useState(false);
    let viewTree = () =>{
      setTree(true);
    }
    return <>
    <div className="container-fluid">
        <div className="row">
            <div className="ag-theme-alpine mt-3 ms-5 col-sm-9 col-md-9 col-lg-9" style={{height:630}} >
                <AgGridReact
                    rowData={treeData}  
                    columnDefs={columnDefs}
                    rowSelection={{mode:"multiRow"}}
                    treeData={Tree}
                    cellSelection={true}
                    rowGroupPanelShow="always"
                    ref={gridRef}
                    animateRows={true}
                    getDataPath={(data) => data.orgHierarchy}
                    autoGroupColumnDef={{
                        headerName: "Hierarchy",
                        cellRendererParams: { suppressCount: true }
                        }}
                    rowDragManaged={true}
                    defaultColDef={{ resizable: true }}
                />
                <br />
                <div style={{display:"flex", gap:"46px"}}>
                    <button class="btn btn-outline-danger" onClick={()=>setTree(true)}>View As Tree</button>
                    <button class="btn btn-outline-danger" onClick={()=>setTree(false)}>View As Table</button>
                </div>
            </div>
            <div className="col-sm-2 col-md-2 mt-4 ms-4 col-lg-2">
                <div style={{border:"2px solid green",backgroundColor:"rgb(217, 255, 216)",borderRadius:"12px",height:"150px"}}>
                    <h3 className="mt-4" style={{textAlign:"center",fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"}}>Total Students</h3>
                    <h3 className="mt-4" style={{textAlign:"center",fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"}}>
                        {rowData.length}
                    </h3>
                   
                </div> 
 <br /> <br /> 
                <div style={{border:"2px solid green",backgroundColor:"rgb(217, 255, 216)",borderRadius:"12px",height:"150px"}}>
                    <h3 className="mt-4" style={{textAlign:"center",fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"}}>Total Classes</h3>
                    <h3 className="mt-4" style={{textAlign:"center",fontFamily:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"}}>
                        {value}
                    </h3>
                    
                </div> 

                <button className="m-5 p-3 btn btn-outline-danger" onClick={exportCsv}>Download as CSV</button> 
            </div>    
        </div>
    </div>
    </>
}
export default StudentTable;