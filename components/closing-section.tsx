'use client';

import React, { forwardRef } from 'react';

export const ClosingSection = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="min-h-screen flex flex-col justify-center items-center text-center px-6" />
));

ClosingSection.displayName = 'ClosingSection';
