import { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";
import { LoginRoute } from "~/routes/guest/login/login-route";
import { Builder } from "~/routes/authen/builder/builder";
import { isElectron } from "~/utils/utils-platform";
import { initializeApp } from "~/services/initializer";

import { StoreContext } from "~/mobx/store-context";
import { rootStore } from "~/mobx/root-store";

import "react-perfect-scrollbar/dist/css/styles.css";
import "antd/dist/antd.css";
import "./app.scss";

const AppRouter = ({ children }: { children: React.ReactElement }): React.ReactElement =>
  isElectron() ? <HashRouter>{children}</HashRouter> : <BrowserRouter>{children}</BrowserRouter>;

initializeApp();

const App = (): React.ReactElement => (
  <StoreContext.Provider value={rootStore}>
    <AppRouter>
      <Switch>
        <Route exact path="/" component={Builder} />
        <Route exact path="/login" component={LoginRoute} />
      </Switch>
    </AppRouter>
  </StoreContext.Provider>
);

export default App;
