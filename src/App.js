import { useState } from 'react';
import './App.css';
import JoinRoom from './pages/JoinRoom';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import MainRoom from './pages/MainRoom';

function App() {

  const [data , setData] = useState(null)
  const [err, setErr] = useState(null);

  const ProtectedMainRoom = ({data})=>{

    if(data === null){
      return <Navigate to="/" />
    }
    return <MainRoom data={data} setErr={setErr}/>
  }

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={ <JoinRoom setData = {setData} error={err} /> }/>
          <Route path="/meet" element={<ProtectedMainRoom data={data}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
