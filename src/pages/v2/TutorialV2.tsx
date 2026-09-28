import { useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { css } from './css/TutorialRef';
import { TUTORIALS, type Tutorial } from '@/lib/tutorials';
import { openExternalUrl } from '@/lib/nativeBridge';

export default function TutorialV2() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Tutorial | null>(null);
  return <div className="tutorial-app">
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <header className="tutorial-header"><button className="tutorial-back" onClick={() => navigate(-1)} aria-label="Back"><svg viewBox="0 0 24 24" fill="none"><path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></button><div className="tutorial-header-title">Tutorial</div></header>
    <main className="tutorial-content"><section className="tutorial-list">
      {TUTORIALS.map((item) => <button key={item.url + item.title} className="tutorial-item" onClick={() => setSelected(item)}><span className="tutorial-thumb"><img src={item.cover} alt="" fetchPriority="high" decoding="async" /></span><span className="tutorial-copy"><span className="tutorial-name">{item.title}</span><span className="tutorial-date">{item.date}</span><span className="tutorial-check">Check</span></span></button>)}
    </section></main>
    {selected && <div className="tutorial-modal" onClick={() => setSelected(null)}><div className="tutorial-modal-box" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><h2>Open in Browser</h2><p>This tutorial will be opened in your browser. Do you want to continue?</p><div className="tutorial-actions"><button className="tutorial-cancel" onClick={() => setSelected(null)}>Cancel</button><button className="tutorial-confirm" onClick={() => { openExternalUrl(selected.url); setSelected(null); }}>Confirm</button></div></div></div>}
  </div>;
}
