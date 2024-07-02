import React from "react";
import Header from "./Header";

import {Link, useLocation, useParams} from "react-router-dom";

function Layout() {
    const breadcrumbsList = [
        { name: 'Home', path: '/'},
        { name: 'Study', path: '/decks/:deckId/study'},
        { name: 'Create Deck', path: '/decks/new'},
        { name: 'Deck', path: '/decks/:deckId'},
        { name: 'Edit Deck', path: '/decks/:deckId/edit'},
    ]
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Utility function to replace :params with actual values
    const replaceParams = (path, params) => {
        return path.replace(/:([^/]+)/g, (_, key) => params[key]);
    };

    // Generate breadcrumbs based on the current path and predefined list
    const generateBreadcrumbItems = () => {
        const breadcrumbs = [];

        pathnames.forEach((_, index) => {
            const fullPath = `/${pathnames.slice(0, index + 1).join('/')}`;

            const match = breadcrumbsList.find((breadcrumb) => {
                const regex = new RegExp(`^${breadcrumb.path.replace(/:[^\s/]+/g, '([^/]+)')}$`);
                return regex.test(fullPath);
            });

            if (match) {
                const breadcrumbPath = match.path.split('/').map((segment) => {
                    if (segment.startsWith(':')) {
                        const paramName = segment.slice(1);
                        const paramValue = pathnames[index];
                        return paramValue;
                    }
                    return segment;
                }).join('/');

                breadcrumbs.push({
                    name: match.name,
                    path: breadcrumbPath,
                });
            }
        });

        return breadcrumbs;
    };

    const breadcrumbItems = generateBreadcrumbItems();

    return (
        <div className="container">
        <Header />
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                </li>
                {breadcrumbItems.map((breadcrumb, index) => (

                    <li key={breadcrumb.path} className="breadcrumb-item">
                        {index === breadcrumbItems.length - 1 ? (
                            breadcrumb.name
                        ) : (
                            <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
        </div>
    );
}

export default Layout;