export function useIsMobile() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(max-width: 767px)').matches;
  } else {
    return false;
  }
}
