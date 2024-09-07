// src/components/Breadcrumbs.tsx
import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const mediaTitle = location.state as string;

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" className="p-4">
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography color="textPrimary" key={to}>
            {mediaTitle || value.charAt(0).toUpperCase() + value.slice(1)}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            to={to}
            underline="hover"
            color="inherit"
            key={to}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
