import { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";
import { LoginRoute } from "~/routes/guest/login/login-route";
import { Builder } from "~/routes/authen/builder/builder";

import "./app.scss";
import { isElectron } from "~/utils/utils-platform";

import "antd/dist/antd.css";

const AppRouter = ({ children }: { children: React.ReactElement }): React.ReactElement =>
  isElectron() ? <HashRouter>{children}</HashRouter> : <BrowserRouter>{children}</BrowserRouter>;

const App = (): React.ReactElement => (
  <AppRouter>
    <Switch>
      <Route exact path="/" component={Builder} />
      <Route exact path="/login" component={LoginRoute} />
    </Switch>
  </AppRouter>
);

export default App;
