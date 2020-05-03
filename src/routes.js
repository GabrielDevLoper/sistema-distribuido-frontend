import React from 'react';
import {BrowserRouter, Switch , Route} from 'react-router-dom';

import Rekognition from './views/Rekognition/VideoInput';
import FormsUsers from './views/Forms/Users/form';

import Dashboard from './views/Dashboard/dashboard';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/face" component={Rekognition} />
                <Route path="/form" component={FormsUsers} />
               
            </Switch>
        </BrowserRouter>


    );
}