import { useCallback } from 'react';

// Safe haptics wrapper that works in browser and Capacitor
export function useHaptics() {
  const trigger = useCallback(async (style: string) => {
    try {
      // Check if running in Capacitor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cap = (window as any).Capacitor;
      if (cap?.isNativePlatform?.()) {
        const { Haptics } = await import('@capacitor/haptics');
        if (style === 'light') await Haptics.impact({ style: 'light' as never });
        else if (style === 'medium') await Haptics.impact({ style: 'medium' as never });
        else if (style === 'heavy') await Haptics.impact({ style: 'heavy' as never });
        else if (style === 'success') await Haptics.notification({ type: 'success' as never });
        else if (style === 'error') await Haptics.notification({ type: 'error' as never });
      }
    } catch {
      // Haptics not available, silently ignore
    }
  }, []);

  return {
    light: () => trigger('light'),
    medium: () => trigger('medium'),
    heavy: () => trigger('heavy'),
    success: () => trigger('success'),
    soft: () => trigger('light'),
  };
}
