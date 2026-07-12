import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import InfiniteSpiralLoop from './InfiniteSpiralLoop';

describe('InfiniteSpiralLoop', () => {
  it('renders a decorative spiral loop shell', () => {
    const html = renderToStaticMarkup(React.createElement(InfiniteSpiralLoop));

    expect(html).toContain('data-testid="spiral-loop"');
    expect(html).toContain('aria-label="Sonsuz spiral loop"');
  });
});
