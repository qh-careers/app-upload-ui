import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Apps from './components/Apps';
import Form from './components/Form';
import Table from './components/Table';

function App() {

  return (
    <Router>
     <Routes>
      <Route exact path="/" element={<Table/>} />
      <Route exact path="/form" element={<Form/>} />
    </Routes>
  </Router>
  );
}

export default App;
