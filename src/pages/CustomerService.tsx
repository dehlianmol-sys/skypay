import { useNavigate } from '@/lib/router-compat';
import { useStore } from '@/lib/store';
import SmartImage from '../components/SmartImage';
import { openExternalUrl } from '@/lib/nativeBridge';
import { css } from './v2/css/ServiceRef';

const DEFAULT_SERVICES = [
  { id: 'telegram-official', name: 'Telegram Official Channel', description: 'Telegram Official Channel', iconUrl: '', linkUrl: '' },
  { id: 'whatsapp-official', name: 'Whatsapp Official Channel', description: 'Whatsapp Official Channel', iconUrl: '', linkUrl: '' },
  { id: 'telegram-group', name: 'Telegram Discussion Group', description: 'Teleragm Online Customer Service', iconUrl: '', linkUrl: '' },
  { id: 'online-service', name: '24/7 Online Customer Service', description: 'Online Customer Service', iconUrl: '', linkUrl: '' },
];

/** Open a support link outside the app shell (works inside APK webviews too). */
const openExternal = (rawUrl: string) => { openExternalUrl(rawUrl); };

function FallbackIcon({ name }: { name: string }) {
  const type = /whats/i.test(name) ? 'whatsapp' : /telegram/i.test(name) ? 'telegram' : 'headset';
  return (
    <span className={`service-icon ${type}`}>
      {type === 'headset' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 13v-1a8 8 0 0 1 16 0v7h-3v-6h4M7 19H3v-6h4m12 6v1c0 2-2 3-5 3" /></svg>
      ) : (
        <span aria-hidden="true" className="text-[21px] font-bold">{type === 'whatsapp' ? 'W' : 'T'}</span>
      )}
    </span>
  );
}

export default function CustomerServicePage() {
  const { customerServices } = useStore();
  const navigate = useNavigate();
  const services = customerServices.length ? customerServices : DEFAULT_SERVICES;

  return (
    <div className="service-app">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header className="service-header">
        <button onClick={() => navigate(-1)} className="service-back" aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="service-title">Service</span>
      </header>
      <div className="service-content">
          <div>
            {services.map((cs) => (
              <div key={cs.id} className="service-card">
                <div className="service-left">
                  {cs.iconUrl ? <SmartImage path={cs.iconUrl} alt={cs.name} className="service-icon" imgClassName="w-full h-full object-cover" /> : <FallbackIcon name={cs.name} />}
                  <div className="service-copy">
                    <div className="service-name">{cs.name}</div>
                    <div className="service-description">{cs.description || cs.name}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="service-contact"
                  onClick={() => { if (cs.linkUrl) openExternal(cs.linkUrl); }}
                >
                  Contact
                </button>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}
