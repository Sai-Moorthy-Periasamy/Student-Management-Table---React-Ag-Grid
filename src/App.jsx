import 'bootstrap/dist/css/bootstrap.min.css'
import StudentTable from './components/StudentTable'
import '../src/App.css'
function App(){
return <>
<h1 style={{color:"blue",fontFamily:"'Times New Roman', Times, serif",textAlign:"center"}} className="m-3">Student Dashboard</h1>
<StudentTable />
</>
}
export default App;

