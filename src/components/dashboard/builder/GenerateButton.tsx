'use client';

import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

const GOLD = '#c8a97e';

export function GenerateButton({
  onClick,
  disabled,
  loading,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 22px',
        borderRadius: '100px',
        border: 'none',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        fontSize: '13px',
        fontWeight: 600,
        background: disabled
          ? 'rgba(200,169,126,0.05)'
          : `linear-gradient(135deg, ${GOLD}, #8b7355)`,
        color: disabled ? '#4a3f32' : '#0c0a09',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {loading ? (
        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <Sparkles size={14} />
      )}
      {loading ? 'Generating...' : 'Generate'}
    </motion.button>
  );
}
