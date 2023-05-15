import { useState } from 'react';
import './App.css';
import JoinRoom from './pages/JoinRoom';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import MainRoom from './pages/MainRoom';

function App() {

  const[data , setData] = useState()

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={ <JoinRoom setData = {setData}/> }/>
          <Route path="/meet" element={ <MainRoom data={data}/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
