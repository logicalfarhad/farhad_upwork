import React from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(5),
    display: "flex",
  },
  logo: {
    flexGrow: "1",
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: theme.spacing(20),
    borderBottom: "1px solid transparent",
    "&:hover": {
      color: "yellow",
      borderBottom: "1px solid white",
    },
  },
}));

function Navbar() {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="/Logo.png" alt="Logo" style={{ height: '40px' }} />
          </Link>
        </Typography>
        <div className={classes.navlinks}>
          <Link to="/geo-model" style={{ color: 'inherit', textDecoration: 'none', marginRight: '10px' }}>Geo Model</Link>
          <Link to="/ontology-scheme" style={{ color: 'inherit', textDecoration: 'none', marginRight: '10px' }}>Ontology & Scheme</Link>
          <Link to="/sparql-endpoint" style={{ color: 'inherit', textDecoration: 'none', marginRight: '10px' }}>SPARQL Endpoint</Link>
          <Link to="/data" style={{ color: 'inherit', textDecoration: 'none', marginRight: '10px' }}>Data</Link>
          <Link to="/golden-questions" style={{ color: 'inherit', textDecoration: 'none', marginRight: '10px' }}>Golden Questions</Link>
          <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</Link>
        </div>

      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
