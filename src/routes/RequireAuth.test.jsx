import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import RequireAuth from './RequireAuth';
import * as AuthContext from '../auth/AuthContext';

// Helper component to capture the location after render/redirect
function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}

// Mock AppLayout since we only care about routing behavior
vi.mock('../layout/AppLayout', () => ({
  default: () => <div data-testid="app-layout">App Layout</div>,
}));

describe('RequireAuth', () => {
  it('should redirect an unauthorized user to their default home page', () => {
    // Mock user with uploader role, trying to access /analytics which is not allowed for uploaders
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { role: 'uploader' },
    });

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/analytics']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/analytics" element={<div>Analytics</div>} />
          </Route>
          {/* Mock the home route for the uploader */}
          <Route path="/home" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to /home instead of rendering AppLayout
    expect(getByTestId('location-display').textContent).toBe('/home');
  });

  it('should allow an authorized user to access the route', () => {
    // Mock user with platform_admin role, who is allowed to access /customers
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { role: 'platform_admin' },
    });

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/customers']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/customers" element={<div>Customers Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Should render AppLayout
    expect(getByTestId('app-layout')).toBeDefined();
  });
});
