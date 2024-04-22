import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Faq from "./pages/faq";
import GeoModel from "./pages/GeoModel";
import OntologyScheme from "./pages/OntologyScheme"
import GoldenQuestions from "./pages/GoldenQuestions";
import SparqlEndpoint from "./pages/SparqlEndpoint";
import Data from "./pages/Data";
function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq" component={Faq} />
        <Route path="/geo-model" component={GeoModel} />
        <Route path="/ontology-scheme" component={OntologyScheme} />
        <Route path="/sparql-endpoint" component={SparqlEndpoint} />
        <Route path="/data" component={Data} />
        <Route path="/golden-questions" component={GoldenQuestions} />
      </Switch>
    </Router>
  );
}
export default App;
