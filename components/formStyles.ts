import type React from 'react'
import type { PhoneInput } from 'react-international-phone'

// Shared form styling for the contact and quote forms
export const selectStyles = {
  control: (base: object) => ({
    ...base,
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    borderColor: 'var(--color-border)',
    borderRadius: 'var(--radius-control)',
    minHeight: '46px',
    boxShadow: 'none',
    '&:hover': { borderColor: 'var(--color-primary)' },
  }),
  option: (base: object, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    backgroundColor: state.isSelected ? 'var(--color-primary)' : state.isFocused ? 'var(--color-tint)' : 'white',
    color: state.isSelected ? 'white' : 'var(--color-ink)',
    cursor: 'pointer',
  }),
  placeholder: (base: object) => ({ ...base, color: '#9ca3af' }),
  singleValue: (base: object) => ({ ...base, color: 'var(--color-ink)' }),
  menu: (base: object) => ({ ...base, borderRadius: 'var(--radius-control)', zIndex: 50 }),
  input: (base: object) => ({ ...base, fontFamily: 'var(--font-body)' }),
}

export const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  color: 'var(--color-ink)',
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-control)',
  padding: '0.75rem 1rem',
  outline: 'none',
  boxSizing: 'border-box',
}

export const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'var(--color-ink)',
  display: 'block',
  marginBottom: '0.375rem',
}

// Props for react-international-phone so it matches inputStyle
export const phoneInputProps = {
  style: { width: '100%' },
  inputStyle: {
    width: '100%',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    color: 'var(--color-ink)',
    border: '1px solid var(--color-border)',
    borderRadius: '0 var(--radius-control) var(--radius-control) 0',
    padding: '0.75rem 1rem',
    height: 'auto',
  },
  countrySelectorStyleProps: {
    buttonStyle: {
      border: '1px solid var(--color-border)',
      borderRight: 'none',
      borderRadius: 'var(--radius-control) 0 0 var(--radius-control)',
      padding: '0 0.625rem',
      height: '100%',
      backgroundColor: 'var(--color-white)',
    },
  },
} satisfies Partial<React.ComponentProps<typeof PhoneInput>>
