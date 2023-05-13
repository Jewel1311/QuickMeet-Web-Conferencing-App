import './App.css';
import JoinRoom from './pages/JoinRoom';
import { BrowserRouter, Route, Routes, useParams} from 'react-router-dom';

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route exact path="/" Component={JoinRoom} />
          <Route exact path="meet/:room" Component={JoinRoom} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
