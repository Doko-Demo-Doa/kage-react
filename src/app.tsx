import { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { LoginRoute } from "~/routes/guest/login/login-route";
import { Builder } from "~/routes/authen/builder/builder";
import { isElectron } from "~/utils/utils-platform";
import { initializeApp } from "~/services/initializer";

import "antd/dist/antd.css";
import "./app.scss";

const AppRouter = ({ children }: { children: React.ReactElement }): React.ReactElement =>
  isElectron() ? <HashRouter>{children}</HashRouter> : <BrowserRouter>{children}</BrowserRouter>;

initializeApp();

const App = (): React.ReactElement => (
  <RecoilRoot>
    <AppRouter>
      <Switch>
        <Route exact path="/" component={Builder} />
        <Route exact path="/login" component={LoginRoute} />
      </Switch>
    </AppRouter>
  </RecoilRoot>
);

export default App;
