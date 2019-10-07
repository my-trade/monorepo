import React from 'react';
import ClayIcon from '@clayui/icon';
import { Link } from 'react-router-dom'

export default () => {
    return (
        <nav className="application-bar application-bar-dark navbar navbar-expand-md">
            <div className="container-fluid container-fluid-max-xl">
                <ul className="navbar-nav"></ul>
                <div className="navbar-title navbar-text-truncate">MyTrade</div>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link nav-link-monospaced" to="/dashboard/configurar/">
                            <ClayIcon symbol="cog" />
                        </Link>
                    </li>
                    <li className="dropdown nav-item">
                        <a aria-expanded="false" aria-haspopup="true" className="dropdown-toggle nav-link nav-link-monospaced"
                            data-toggle="dropdown" href="#1" role="button">
                            <ClayIcon symbol="ellipsis-v" />
                        </a>
                        <ul aria-labelledby="navbarDropdownMenuLink" className="dropdown-menu dropdown-menu-right">
                            <li><a className="dropdown-item" href="#1">Action</a></li>
                            <li><a className="dropdown-item" href="#1">Another action</a></li>
                            <li><a className="dropdown-item" href="#1">Something else here</a></li>
                            <li className="dropdown-divider"></li>
                            <li><a className="dropdown-item" href="#1">Separated link</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}