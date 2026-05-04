import React from 'react';

export function useCompactMode() {
  const [isCompact, setIsCompact] = React.useState(() => window.innerWidth < 500);

  React.useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 500);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isCompact;
}
