import { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";
import { LoginRoute } from "~/routes/guest/login/login-route";
import { SlideBuilder } from "~/routes/authen/slide-builder/slide-builder";

import "./app.scss";
import { isElectron } from "~/utils/utils-platform";

const AppRouter = ({
  children,
}: {
  children: React.ReactElement
}): React.ReactElement => (isElectron() ? (
  <HashRouter>{children}</HashRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  ));

const App = (): React.ReactElement => (
  <AppRouter>
    <Switch>
      <Route exact path="/" component={SlideBuilder} />
      <Route exact path="/login" component={LoginRoute} />
    </Switch>

  </AppRouter>
);

export default App;
