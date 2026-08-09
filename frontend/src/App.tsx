import './App.css'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import Pods from './pages/Pods/Pods'
import Settings from './pages/Settings/Settings'
import Deployments from './pages/Deployments/Deployments'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashBoardLayout from './components/Layouts/DashBoardLayout'
import Nodes from "./pages/Nodes/Nodes";


function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    {/* <NavBar />
    <SideBar /> */}
    
      <Routes>
        <Route
      path="/nodes"
      element={
    <DashBoardLayout>
      <Nodes />
    </DashBoardLayout>
  }
/>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" 
        element={
        <DashBoardLayout>
          <Dashboard />
        </DashBoardLayout>}
         />
        <Route path="/pods" 
        element={
        <DashBoardLayout>
          <Pods />
        </DashBoardLayout>}
         />

        <Route path="/settings" 
        element={
        <DashBoardLayout>
          <Settings />
        </DashBoardLayout>}
         />

        <Route path="/deployments"
         element={
        <DashBoardLayout>
          <Deployments />
        </DashBoardLayout>}
         />
      </Routes>
    </BrowserRouter>

    
    </>
  )
}

export default App
