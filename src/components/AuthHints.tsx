export function usernameRules(v: string) {
  return [
    { ok: /^[A-Za-z0-9_]*$/.test(v), text: 'Only letters, numbers, and underscores' },
    { ok: v.length >= 5 && v.length <= 12, text: `Length 5–12 (${v.length}/12)` },
  ];
}
export function phoneRules(v: string) {
  return [
    { ok: /^\d*$/.test(v), text: 'Digits only (0–9)' },
    { ok: v.length === 10, text: `Exactly 10 digits (${v.length}/10)` },
  ];
}
export function passwordRules(v: string) {
  return [{ ok: v.length >= 6, text: `At least 6 characters (${v.length})` }];
}
export const isInvalid = (v: string, rules: { ok: boolean }[]) => v.length > 0 && rules.some((r) => !r.ok);

export default function AuthHints({ value, rules }: { value: string; rules: { ok: boolean; text: string }[] }) {
  if (!isInvalid(value, rules)) return null;
  return (
    <ul className="cp-hints">
      {rules.map((r) => <li key={r.text} className={r.ok ? 'ok' : 'bad'}>{r.text}</li>)}
    </ul>
  );
}
