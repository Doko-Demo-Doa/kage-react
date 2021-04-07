import { createBrowserHistory } from 'history';
import { Router, Route } from 'react-router-dom';
import { LoginRoute } from '~/routes/guest/login/login-route';
import { SlideBuilder } from './routes/authen/slide-builder/slide-builder';

import './app.scss';

export const customHistory = createBrowserHistory();

const App = (): React.ReactElement => (
  <Router history={customHistory}>
    <Route exact path="/" component={SlideBuilder} />
    <Route exact path="/login" component={LoginRoute} />
  </Router>

  );

export default App;
