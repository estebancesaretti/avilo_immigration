import type { ComponentPropsWithoutRef } from 'react'

// Shared page container: max-width, centering and horizontal gutter live in
// .site-container (globals.css) so the header and every section line up.
export default function Container({ className = '', ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={`site-container ${className}`.trim()} {...props} />
}
