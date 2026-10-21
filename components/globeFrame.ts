// Shared by GlobeAnimation and its loading placeholder so both occupy
// exactly the same box (no layout shift when the canvas mounts).
export const GLOBE_FRAME_CLASS = 'w-full max-w-[260px] md:max-w-[320px] mx-auto'
export const GLOBE_LABEL_MIN_HEIGHT = '2.75rem'
// Globe radius as a share of the canvas; leaves room for the lifted arcs (up to 1.2×)
export const GLOBE_RADIUS_RATIO = 0.4
