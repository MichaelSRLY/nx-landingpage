'use client';

import { useActionState } from 'react';
import { signup, type SignupState } from './actions';

const initial: SignupState = {};

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, initial);

  if (state.ok) {
    return (
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.55,
          color: 'var(--foreground)',
          fontFamily: 'var(--font-sans)',
          margin: 0,
        }}
      >
        Notiert. Sie bekommen den Link, sobald der Förderrechner live ist — eine
        einzige Mail, kein Newsletter.
      </p>
    );
  }

  return (
    <form
      action={action}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxWidth: 520 }}
    >
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="ihre@email.de"
        style={{
          flex: '1 1 220px',
          padding: '14px 18px',
          fontSize: 15,
          fontFamily: 'var(--font-sans)',
          color: 'var(--foreground)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 4,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '14px 24px',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '0.02em',
          fontFamily: 'var(--font-sans)',
          color: '#1a1410',
          background: '#c8a97e',
          border: 'none',
          borderRadius: 4,
          cursor: pending ? 'wait' : 'pointer',
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? 'Sende …' : 'Für Launch vormerken'}
      </button>
      {state.error && (
        <p
          role="alert"
          style={{
            width: '100%',
            margin: 0,
            fontSize: 13,
            color: '#b85a4a',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
