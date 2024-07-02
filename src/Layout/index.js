import React from "react";
import Header from "./Header";

import { Link, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Define a mapping from path segments to display names
    const breadcrumbNameMap = {
        decks: 'Decks',
    };
    const generateBreadcrumbItems = () => {
        return pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
                <li key={to} className={isLast ? 'breadcrumb-item active' : 'breadcrumb-item'}>
                    {isLast ? (
                        breadcrumbNameMap[value] || value
                    ) : (
                        <Link to={to}>{breadcrumbNameMap[value] || value}</Link>
                    )}
                </li>
            );
        });
    };

    return (
        <>
        <Header />
            <div className="container">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    {generateBreadcrumbItems()}
                </ol>
            </nav>
            </div>
        </>
    );
}

export default Layout;
