import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import { getPublicUrl } from '../lib/storage';
import { resolveCachedImage } from '../lib/imageCache';

interface SmartImageProps {
  path: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export default function SmartImage({ path, alt, className = '', imgClassName = '' }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    let alive = true;
    setLoaded(false);
    setError(false);
    setUrl('');
    if (!path) return;
    const publicUrl = getPublicUrl(path);
    resolveCachedImage(publicUrl, path)
      .then((resolved) => { if (alive) setUrl(resolved); })
      .catch(() => { if (alive) setUrl(publicUrl); });
    return () => { alive = false; };
  }, [path]);

  if (!path || error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 ${className} ${imgClassName}`}>
        <ImageOff size={24} className="text-slate-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {(!loaded || !url) && (
        <div className={`absolute inset-0 hk-img-skeleton ${imgClassName}`} />
      )}
      {url && (
        <img
          src={url}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`${imgClassName} ${loaded ? '' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}
