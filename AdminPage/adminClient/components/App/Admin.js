import { Route, Switch } from 'react-router-dom';

import AdminLogin from '../AdminLogin/AdminLogin';
import AdminPage from '../AdminPage/AdminPage';
import NotFoundPage from '../404/404';

import './Admin.sass';

class App extends React.Component {
    render() {
        return (
            <div className="container ui" style={{ paddingTop: '10%' }}>
                <Switch>
                    <Route exact path="/admin" component={AdminPage}/>
                    <Route exact path="/admin/login" component={AdminLogin}/>


                    <Route component={NotFoundPage}/>
                </Switch>
            </div>
        );
    }
}

export default App;

// cookies: { sid: 's:SfHu609WabhMwSp-L-pyEEEwBM2Gf9cq.1phieJf1Cdx5E7szRepd0duLxdYdQIMScx1u8/N2nw8' },
