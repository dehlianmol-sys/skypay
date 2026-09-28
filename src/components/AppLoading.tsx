type AppLoadingProps = {
  label?: string;
  success?: boolean;
};

const css = `
.skypay-loading-layer{position:fixed;inset:0;z-index:120;display:grid;place-items:center;pointer-events:none;background:transparent;font-family:Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}
.skypay-loading-box{width:128px;height:128px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border-radius:12px;background:rgb(64 64 64 / 95%);color:#fff;font-size:16px;font-weight:400;line-height:1}
.skypay-loading-spinner{width:36px;height:36px;border:2px solid rgb(255 255 255 / 25%);border-top-color:#fff;border-radius:50%;animation:skypay-loader-spin .8s linear infinite}
.skypay-loading-check{width:44px;height:34px;fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}
@keyframes skypay-loader-spin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.skypay-loading-spinner{animation-duration:1.6s}}
`;

/** One loading/status treatment shared by user, authentication, and admin screens. */
export default function AppLoading({ label = 'Loading', success = false }: AppLoadingProps) {
  return (
    <div className="skypay-loading-layer" role="status" aria-live="polite" aria-label={label}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="skypay-loading-box">
        {success ? (
          <svg className="skypay-loading-check" viewBox="0 0 96 72" aria-hidden="true"><path d="M10 36 37 62 86 10" /></svg>
        ) : (
          <span className="skypay-loading-spinner" aria-hidden="true" />
        )}
        <span>{label}</span>
      </div>
    </div>
  );
}