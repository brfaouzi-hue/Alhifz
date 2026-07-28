// Toutes les <select> natives de l'app utilisaient le style par défaut du
// navigateur (flèche OS, look générique) — ce wrapper garde le vrai <select>
// (comportement clavier, picker natif iOS/Android, accessibilité) mais ajoute
// un chevron custom et un style cohérent avec le reste de l'app, au lieu de
// réinventer un dropdown complet (plus risqué : navigation clavier, focus,
// picker mobile natif à reproduire).
export default function StyledSelect({ style = {}, wrapperStyle = {}, children, ...props }) {
  const { color = 'inherit', width = '100%', ...restStyle } = style;
  return (
    <div style={{ position: 'relative', width, flex: style.flex, ...wrapperStyle }}>
      <select
        {...props}
        style={{
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          color,
          paddingRight: 26,
          ...restStyle,
        }}
      >
        {children}
      </select>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: .65 }}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
