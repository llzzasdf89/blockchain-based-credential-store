import ReactDOM from 'react-dom/client';
import Router from './router'
import {ContractsProvider} from './neo-one-compiled/'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContractsProvider>
  {Router}
  </ContractsProvider>
);