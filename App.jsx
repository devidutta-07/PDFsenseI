import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────*/
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    :root {
      --bg:#09090e; --surface:#0f0f16; --elevated:#16161f; --panel:#1c1c28;
      --border:rgba(255,255,255,0.07); --border-h:rgba(255,255,255,0.14);
      --accent:#5b7cf6; --accent-dim:rgba(91,124,246,0.12); --accent-glow:rgba(91,124,246,0.25);
      --text:#ededf2; --text-2:rgba(237,237,242,0.55); --text-3:rgba(237,237,242,0.28);
      --success:#3ecf8e; --danger:#f26767; --warning:#e8b84b;
      --r-sm:8px; --r:12px; --r-lg:18px;
      --sidebar:260px; --topbar:52px; --nav:52px;
      --fd:'Bricolage Grotesque',sans-serif; --fb:'DM Sans',sans-serif;
    }
    .light {
      --bg:#eeede6; --surface:#f5f4ee; --elevated:#faf9f5; --panel:#e6e4db;
      --border:rgba(0,0,0,0.10); --border-h:rgba(0,0,0,0.20);
      --accent:#3d5fe0; --accent-dim:rgba(61,95,224,0.10); --accent-glow:rgba(61,95,224,0.18);
      --text:#18180f; --text-2:rgba(24,24,15,0.65); --text-3:rgba(24,24,15,0.48);
      --success:#157a50; --danger:#c0392b; --warning:#9a6a00;
    }
    .light body { color:var(--text); }
    .light ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.15); }
    .light .overlay { background:rgba(0,0,0,0.30); }
    .light .bu { color:#fff; }
    .light .ba { background:var(--elevated); border-color:var(--border); color:var(--text); }
    .light .bs { background:var(--elevated); color:var(--text); border-color:var(--border); }
    .light .bs:hover { background:var(--panel); border-color:var(--border-h); }
    .light .bi { color:var(--text-2); }
    .light .bi:hover { background:var(--panel); color:var(--text); }
    .light .bg { color:var(--text-2); }
    .light .bg:hover { background:var(--panel); color:var(--text); }
    .light .field { background:var(--elevated); border-color:var(--border); color:var(--text); }
    .light .field::placeholder { color:var(--text-3); }
    .light .sb-row { color:var(--text-2); }
    .light .sb-row:hover { background:var(--panel); color:var(--text); }
    .light .sb-row.active { background:var(--accent-dim); color:var(--accent); }
    .light .dz { border-color:rgba(0,0,0,0.15); }
    .light .dz:hover,.light .dz.on { border-color:var(--accent); background:var(--accent-dim); }
    .light .tg { background:var(--panel); border-color:var(--border); }
    .light .qp { color:var(--text-2) !important; background:var(--elevated) !important; border-color:var(--border) !important; }
    .light .qp:hover { background:var(--accent-dim) !important; border-color:var(--accent) !important; color:var(--accent) !important; }
    .light .lbl { color:var(--text-2); }
    .light .plan-card { background:var(--elevated); border-color:var(--border); }
    .light textarea::placeholder { color:var(--text-3); }
    .light input::placeholder { color:var(--text-3); }

    html, body, #root { height:100%; }
    body { font-family:var(--fb); background:var(--bg); color:var(--text); -webkit-font-smoothing:antialiased; transition:background .3s,color .3s; overflow:hidden; }

    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:var(--border); border-radius:99px; }
    ::-webkit-scrollbar-thumb:hover { background:var(--border-h); }

    /* ── Core Keyframes ── */
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes slideUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes scaleIn   { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
    @keyframes spin      { to{transform:rotate(360deg)} }
    @keyframes dp        { 0%,80%,100%{transform:scale(0.65);opacity:.35} 40%{transform:scale(1);opacity:1} }

    /* ── Micro-animation Keyframes ── */
    @keyframes cogSpin   { from{transform:rotate(0deg)} to{transform:rotate(90deg)} }
    @keyframes cogUnSpin { from{transform:rotate(90deg)} to{transform:rotate(0deg)} }
    @keyframes menuLine1Hover { from{transform:translateY(0) scaleX(1)} to{transform:translateY(0) scaleX(0.7)} }
    @keyframes menuLine2Hover { from{transform:scaleX(1)} to{transform:scaleX(1.15)} }
    @keyframes menuLine3Hover { from{transform:translateY(0) scaleX(1)} to{transform:translateY(0) scaleX(0.85)} }
    @keyframes sendNudge { 0%{transform:translateX(0)} 40%{transform:translateX(3px)} 70%{transform:translateX(-1px)} 100%{transform:translateX(0)} }
    @keyframes trashWiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
    @keyframes upBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
    @keyframes outSlide { 0%{transform:translateX(0)} 100%{transform:translateX(3px)} }
    @keyframes checkPop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
    @keyframes copyFade { 0%{opacity:0;transform:scale(.8)} 100%{opacity:1;transform:scale(1)} }
    @keyframes badgePop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
    @keyframes ripple   { 0%{transform:scale(0);opacity:.4} 100%{transform:scale(2.5);opacity:0} }
    @keyframes shimmerSlide { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }

    .fi  { animation:fadeIn   .25s ease both; }
    .su  { animation:slideUp  .3s cubic-bezier(.22,1,.36,1) both; }
    .sd  { animation:slideDown .25s cubic-bezier(.22,1,.36,1) both; }
    .si  { animation:scaleIn  .25s cubic-bezier(.22,1,.36,1) both; }

    /* ── Fields ── */
    .field {
      background:var(--elevated); border:1.5px solid var(--border);
      border-radius:var(--r); color:var(--text); font-family:var(--fb);
      font-size:14px; padding:11px 14px; outline:none; width:100%;
      transition:border-color .18s,box-shadow .18s;
    }
    .field::placeholder { color:var(--text-3); }
    .field:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-dim); }
    .field:disabled { opacity:.4; cursor:not-allowed; }

    /* ── Buttons ── */
    .bp {
      background:var(--accent); color:#fff; border:none; border-radius:var(--r);
      font-family:var(--fb); font-size:14px; font-weight:500; padding:11px 20px;
      cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:8px;
      transition:filter .15s,transform .12s,box-shadow .15s; position:relative; overflow:hidden;
    }
    .bp:hover { filter:brightness(1.12); box-shadow:0 4px 18px var(--accent-glow); }
    .bp:active { transform:scale(0.98); }
    .bp:disabled { opacity:.4; cursor:not-allowed; pointer-events:none; }

    .bs {
      background:var(--elevated); color:var(--text); border:1.5px solid var(--border); border-radius:var(--r);
      font-family:var(--fb); font-size:14px; font-weight:500; padding:10px 18px;
      cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:8px;
      transition:background .15s,border-color .15s,transform .12s;
    }
    .bs:hover { background:var(--panel); border-color:var(--border-h); }
    .bs:active { transform:scale(0.98); }
    .bs:disabled { opacity:.4; cursor:not-allowed; pointer-events:none; }

    .bg {
      background:transparent; color:var(--text-2); border:none; border-radius:var(--r-sm);
      font-family:var(--fb); font-size:13px; padding:7px 10px; cursor:pointer;
      display:inline-flex; align-items:center; justify-content:center; gap:6px;
      transition:background .15s,color .15s;
    }
    .bg:hover { background:var(--elevated); color:var(--text); }

    .bi {
      background:transparent; border:none; border-radius:var(--r-sm);
      color:var(--text-2); cursor:pointer; padding:7px;
      display:flex; align-items:center; justify-content:center;
      transition:background .15s,color .15s; flex-shrink:0;
    }
    .bi:hover { background:var(--elevated); color:var(--text); }
    .bi:disabled { opacity:.35; cursor:not-allowed; }

    /* ── Animated icon buttons ── */
    /* Settings cog — rotates on hover */
    .btn-cog { background:transparent; border:none; border-radius:var(--r-sm); color:var(--text-2); cursor:pointer; padding:7px; display:flex; align-items:center; justify-content:center; transition:background .15s,color .15s; }
    .btn-cog:hover { background:var(--elevated); color:var(--text); }
    .btn-cog svg { transition:transform .4s cubic-bezier(.34,1.56,.64,1); }
    .btn-cog:hover svg { transform:rotate(90deg); }

    /* Hamburger — lines animate on hover */
    .btn-menu { background:transparent; border:none; border-radius:var(--r-sm); color:var(--text-2); cursor:pointer; padding:7px; display:flex; align-items:center; justify-content:center; transition:background .15s,color .15s; }
    .btn-menu:hover { background:var(--elevated); color:var(--text); }
    .btn-menu .m1,.btn-menu .m2,.btn-menu .m3 { transition:transform .25s ease, opacity .2s ease; transform-origin:center; }
    .btn-menu:hover .m1 { transform:scaleX(0.65) translateX(-4px); }
    .btn-menu:hover .m2 { transform:scaleX(1.2); }
    .btn-menu:hover .m3 { transform:scaleX(0.8) translateX(3px); }

    /* Send — nudge right on hover */
    .btn-send { position:relative; overflow:hidden; }
    .btn-send svg { transition:transform .2s ease; }
    .btn-send:hover svg { transform:translate(2px,-2px); }

    /* Trash — wiggle on hover */
    .btn-trash svg { transition:transform .15s; }
    .btn-trash:hover svg { animation:trashWiggle .35s ease; }

    /* Upload icon — bounce on hover */
    .btn-up svg { transition:transform .2s ease; }
    .btn-up:hover svg { animation:upBounce .4s ease; }

    /* Logout — slide right on hover */
    .btn-out svg { transition:transform .2s ease; }
    .btn-out:hover svg { transform:translateX(3px); }

    /* Copy — check pop */
    .btn-copy { opacity:0; transition:opacity .15s; }
    .msg-wrap:hover .btn-copy { opacity:1; }
    .btn-copy.copied svg { animation:checkPop .25s cubic-bezier(.34,1.56,.64,1); }

    /* New chat — subtle rotate */
    .btn-newchat svg { transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
    .btn-newchat:hover svg { transform:rotate(-90deg); }

    /* Clear — slide-fade */
    .btn-clear svg { transition:transform .2s ease,opacity .2s; }
    .btn-clear:hover svg { transform:translateY(-2px); opacity:.7; }

    /* Download — drop on hover */
    .btn-dl svg { transition:transform .2s ease; }
    .btn-dl:hover svg { transform:translateY(2px); }

    /* Drop zone */
    .dz { border:1.5px dashed var(--border); border-radius:var(--r); cursor:pointer; transition:border-color .18s,background .18s; }
    .dz:hover,.dz.on { border-color:var(--accent); background:var(--accent-dim); }

    /* Bubbles */
    .bu { background:var(--accent); color:#fff; border-radius:16px 16px 3px 16px; padding:11px 16px; font-size:14px; line-height:1.65; }
    .ba { background:var(--elevated); border:1.5px solid var(--border); color:var(--text); border-radius:16px 16px 16px 3px; padding:11px 16px; font-size:14px; line-height:1.75; }

    /* Toggle */
    .tg { width:40px; height:22px; background:var(--elevated); border:1.5px solid var(--border); border-radius:99px; position:relative; cursor:pointer; transition:background .22s,border-color .22s; flex-shrink:0; }
    .tg.on { background:var(--accent); border-color:var(--accent); }
    .tk { position:absolute; top:2px; left:2px; width:16px; height:16px; background:white; border-radius:50%; box-shadow:0 1px 4px rgba(0,0,0,.3); transition:transform .22s cubic-bezier(.34,1.56,.64,1); }
    .tg.on .tk { transform:translateX(18px); }

    .div  { height:1px; background:var(--border); }
    .lbl  { font-size:12px; font-weight:500; color:var(--text-2); letter-spacing:.02em; }
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); z-index:200; display:flex; align-items:center; justify-content:center; animation:fadeIn .2s ease; }

    /* Quick prompts pill hover */
    .qp { transition:background .15s, border-color .15s, transform .15s, color .15s; cursor:pointer; }
    .qp:hover { background:var(--accent-dim) !important; border-color:var(--accent) !important; color:var(--accent) !important; transform:translateY(-1px); }

    /* Char counter */
    .char-warn { color:var(--warning); }
    .char-danger { color:var(--danger); }

    /* Process btn shimmer effect */
    .btn-shimmer::after { content:''; position:absolute; top:0; left:0; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent); animation:shimmerSlide 1.8s ease infinite; pointer-events:none; }

    /* Suggested prompt chip hover ripple */
    .chip-wrap { position:relative; overflow:hidden; }
    .chip-wrap::after { content:''; position:absolute; inset:0; background:var(--accent); border-radius:inherit; transform:scale(0); opacity:0; transition:transform .3s, opacity .3s; pointer-events:none; }

    /* ── Unified Sidebar ── */
    .sb-row {
      width:100%; display:flex; align-items:center; gap:10px;
      padding:7px 10px; border-radius:var(--r-sm); border:none;
      background:transparent; color:var(--text-2); cursor:pointer;
      font-family:var(--fb); font-size:13px; font-weight:500;
      transition:background .15s, color .15s, transform .12s;
      white-space:nowrap; overflow:hidden; text-align:left;
    }
    .sb-row:hover { background:var(--elevated); color:var(--text); }
    .sb-row:active { transform:scale(0.97); }
    .sb-row.active { background:var(--accent-dim); color:var(--accent); }
    .sb-row .sb-icon { width:20px; height:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .sb-row .sb-label { opacity:1; transition:opacity .18s; }

    /* Icon-only tooltip (closed state) — handled by JS Tooltip component */

    /* Nav btn (legacy compat) */
    .nav-btn {
      width:36px; height:36px; border-radius:var(--r-sm);
      background:transparent; border:none; color:var(--text-2);
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:background .15s, color .15s, transform .12s; position:relative;
    }
    .nav-btn:hover { background:var(--elevated); color:var(--text); }
    .nav-btn:active { transform:scale(0.94); }
    .nav-btn.active { background:var(--accent-dim); color:var(--accent); }

    /* ── Pricing cards ── */
    @keyframes planIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    .plan-card {
      border-radius:var(--r-lg); border:1.5px solid var(--border);
      background:var(--elevated); padding:24px;
      display:flex; flex-direction:column; gap:16px;
      transition:border-color .2s, transform .2s, box-shadow .2s;
      cursor:default;
    }
    .plan-card:hover {
      border-color:var(--border-h);
      transform:translateY(-3px);
      box-shadow:0 12px 40px rgba(0,0,0,.25);
    }
    .plan-card.featured {
      border-color:var(--accent);
      background:linear-gradient(145deg, var(--elevated), rgba(91,124,246,0.06));
      box-shadow:0 0 0 1px var(--accent), 0 8px 32px var(--accent-glow);
    }
    .plan-card.featured:hover { transform:translateY(-4px); box-shadow:0 0 0 1px var(--accent), 0 16px 48px var(--accent-glow); }

    /* Plus button in topbar */
    .btn-plus {
      display:inline-flex; align-items:center; gap:6px;
      padding:6px 14px; border-radius:99px; border:none; cursor:pointer;
      font-family:var(--fb); font-size:12px; font-weight:600;
      background:linear-gradient(135deg,#5b7cf6,#8b5cf6);
      color:#fff; letter-spacing:.01em;
      transition:filter .18s, transform .12s, box-shadow .18s;
      box-shadow:0 2px 12px rgba(91,124,246,.35);
    }
    .btn-plus:hover { filter:brightness(1.12); box-shadow:0 4px 20px rgba(91,124,246,.55); transform:translateY(-1px); }
    .btn-plus:active { transform:scale(0.97); }

    /* ── Auth link hover animations ── */
    /* "Forgot password" — accent color + underline slides in */
    .link-forgot {
      background:transparent; border:none; font-family:var(--fb); font-size:13px;
      cursor:pointer; color:var(--text-3); padding:0; position:relative;
      transition:color .2s ease;
    }
    .link-forgot::after {
      content:''; position:absolute; bottom:-1px; left:0;
      width:0; height:1px; background:var(--accent);
      transition:width .25s cubic-bezier(.22,1,.36,1);
    }
    .link-forgot:hover { color:var(--accent); }
    .link-forgot:hover::after { width:100%; }

    /* "Create one" / "Sign in" inline links — text shifts right + underline */
    .link-inline {
      background:transparent; border:none; font-family:var(--fb); font-size:13px;
      font-weight:500; cursor:pointer; color:var(--accent); padding:0;
      position:relative; display:inline-flex; align-items:center; gap:3px;
      transition:gap .22s cubic-bezier(.34,1.56,.64,1);
    }
    .link-inline::after {
      content:''; position:absolute; bottom:-1px; left:0; right:0;
      height:1px; background:var(--accent);
      transform:scaleX(0); transform-origin:left;
      transition:transform .25s cubic-bezier(.22,1,.36,1);
    }
    .link-inline .li-arrow {
      font-style:normal; font-size:11px;
      opacity:0; transform:translateX(-4px);
      transition:opacity .2s, transform .22s cubic-bezier(.34,1.56,.64,1);
    }
    .link-inline:hover { gap:6px; }
    .link-inline:hover::after { transform:scaleX(1); }
    .link-inline:hover .li-arrow { opacity:1; transform:translateX(0); }

    /* "Skip for now" — arrow slides in from left on hover */
    .link-skip {
      background:transparent; border:none; font-family:var(--fb); font-size:12px;
      cursor:pointer; color:var(--text-3); padding:0;
      display:inline-flex; align-items:center; gap:4px;
      transition:color .2s, gap .2s cubic-bezier(.34,1.56,.64,1);
    }
    .link-skip .skip-arrow {
      display:inline-block; opacity:0; transform:translateX(-6px); font-style:normal;
      transition:opacity .2s, transform .25s cubic-bezier(.34,1.56,.64,1);
    }
    .link-skip:hover { color:var(--text-2); gap:8px; }
    .link-skip:hover .skip-arrow { opacity:1; transform:translateX(0); }

    /* ── Feature list animations ── */
    @keyframes featureIn {
      from { opacity:0; transform:translateX(-14px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes lineDraw {
      from { transform:scaleY(0); }
      to   { transform:scaleY(1); }
    }
    @keyframes orbitSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes orbitSpinReverse {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }
    @keyframes dotCorePulse {
      0%,100% { transform:scale(1); box-shadow:0 0 0 3px var(--surface), 0 0 0 5px rgba(91,124,246,0.2); }
      50%      { transform:scale(1.15); box-shadow:0 0 0 3px var(--surface), 0 0 0 7px rgba(91,124,246,0.35); }
    }
    .feat-item { animation: featureIn .45s cubic-bezier(.22,1,.36,1) both; }
    .feat-item:nth-child(1) { animation-delay:.15s; }
    .feat-item:nth-child(2) { animation-delay:.28s; }
    .feat-item:nth-child(3) { animation-delay:.41s; }
    .feat-line { animation: lineDraw .5s cubic-bezier(.22,1,.36,1) .2s both; transform-origin:top; }

    /* ── Greeting fade ── */
    @keyframes greetIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .greet-anim { animation: greetIn .4s cubic-bezier(.22,1,.36,1) both; }

    /* ── Sun animations ── */
    @keyframes sunRotate {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes sunGlow {
      0%,100% { filter: drop-shadow(0 0 3px rgba(251,191,36,0.5)) drop-shadow(0 0 7px rgba(251,191,36,0.25)); opacity: 0.85; }
      50%      { filter: drop-shadow(0 0 7px rgba(251,191,36,0.9)) drop-shadow(0 0 16px rgba(251,191,36,0.5)); opacity: 1; }
    }
    @keyframes sunRayPulse {
      0%,100% { stroke-opacity: 0.5; stroke-width: 1.4; }
      50%      { stroke-opacity: 1;   stroke-width: 1.9; }
    }

    /* ── Moon animations ── */
    @keyframes moonPendulum {
      0%   { transform: rotate(-18deg); }
      50%  { transform: rotate(18deg);  }
      100% { transform: rotate(-18deg); }
    }
    @keyframes moonGlow {
      0%,100% { filter: drop-shadow(0 0 3px rgba(167,139,250,0.45)) drop-shadow(0 0 8px rgba(167,139,250,0.2)); opacity: 0.75; }
      50%      { filter: drop-shadow(0 0 8px rgba(167,139,250,0.95)) drop-shadow(0 0 18px rgba(167,139,250,0.5)); opacity: 1; }
    }

    /* sunrise / sunset ray pulse */
    @keyframes riseRayPulse {
      0%,100% { stroke-opacity:0.5; }
      50%      { stroke-opacity:1; }
    }
  `}</style>
);

/* ── SVG Icons ─────────────────────────────────── */
const Icon = ({ n, size=16, color="currentColor", sw=1.6, cls="" }) => {
  const p = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:color, strokeWidth:sw, strokeLinecap:"round", strokeLinejoin:"round", className:cls };
  const icons = {
    logo:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><polyline points="13 2 13 9 20 9" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="15" r="2.5" stroke={color} strokeWidth={sw}/><line x1="12" y1="17" x2="14.5" y2="19.5" stroke={color} strokeWidth={sw} strokeLinecap="round"/></svg>,
    up:       <svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    file:     <svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>,
    trash:    <svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    send:     <svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    cog:      <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    x:        <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    sun:      <svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon:     <svg {...p}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
    eye:      <svg {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:   <svg {...p}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    mail:     <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:     <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    user:     <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    check:    <svg {...p}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    checkSm:  <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    zap:      <svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    layers:   <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    search:   <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    cr:       <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    spin:     <svg {...p} style={{animation:"spin .8s linear infinite"}}><circle cx="12" cy="12" r="9" strokeOpacity=".2"/><path d="M21 12a9 9 0 00-9-9"/></svg>,
    bot:      <svg {...p}><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16" strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="16" x2="12" y2="16" strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="16" x2="16" y2="16" strokeWidth="2.5" strokeLinecap="round"/></svg>,
    out:      <svg {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    info:     <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    copy:     <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
    plus:     <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    eraser:   <svg {...p}><path d="M20 20H7L3 16l11-11 7 7-3.5 3.5"/><path d="M6 17l-3-3"/></svg>,
    dl:       <svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    google:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57C21.36 18.17 22.56 15.43 22.56 12.25z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
    sunrise:  <svg {...p}><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M20 12h2M18.66 5.34l-1.41 1.41"/><path d="M5 17a7 7 0 0114 0"/><line x1="3" y1="21" x2="21" y2="21"/><line x1="12" y1="12" x2="12" y2="17"/></svg>,
    sun2:     <svg {...p}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    sunset:   <svg {...p}><path d="M12 10v2M4.93 10.93l1.41 1.41M2 18h2M20 18h2M18.66 11.34l-1.41 1.41"/><path d="M5 18a7 7 0 0114 0"/><line x1="3" y1="22" x2="21" y2="22"/></svg>,
    moon2:    <svg {...p}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>,
  };
  return icons[n] || null;
};

/* ── Hamburger Icon (custom for animation) ─────── */
const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="3" y1="7"  x2="21" y2="7"  className="m1" style={{transformOrigin:"center", display:"block"}}/>
    <line x1="3" y1="12" x2="21" y2="12" className="m2" style={{transformOrigin:"center", display:"block"}}/>
    <line x1="3" y1="17" x2="21" y2="17" className="m3" style={{transformOrigin:"center", display:"block"}}/>
  </svg>
);

/* ── Sidebar Tooltip (fixed position, escapes overflow:hidden) ── */
const TooltipCtx = React.createContext(null);
const TooltipProvider = ({ children }) => {
  const [tip, setTip] = useState(null); // {text, x, y}
  return (
    <TooltipCtx.Provider value={setTip}>
      {children}
      {tip && (
        <div style={{
          position:"fixed",
          left: tip.below ? tip.x : tip.x,
          top:  tip.below ? tip.y : tip.y,
          transform: tip.below ? "translateX(-50%)" : "translateY(-50%)",
          background:"var(--panel)", color:"var(--text)", fontSize:11, fontWeight:500,
          padding:"5px 10px", borderRadius:6, border:"1px solid var(--border)",
          whiteSpace:"nowrap", pointerEvents:"none", zIndex:9999,
          boxShadow:"0 2px 8px rgba(0,0,0,.2)",
        }}>{tip.text}</div>
      )}
    </TooltipCtx.Provider>
  );
};
const TipBtn = ({ tip, children, onClick, style, className, below=false }) => {
  const setTip = React.useContext(TooltipCtx);
  return (
    <button
      className={className}
      style={style}
      onClick={onClick}
      onMouseEnter={e => {
        if(!tip) return;
        const r=e.currentTarget.getBoundingClientRect();
        if(below) setTip({text:tip, x:r.left+r.width/2, y:r.bottom+16, below:true});
        else       setTip({text:tip, x:r.right+10,       y:r.top+r.height/2, below:false});
      }}
      onMouseLeave={() => setTip(null)}
    >{children}</button>
  );
};

/* ── IST Greeting hook ─────────────────────────── */
const useISTGreeting = () => {
  const get = () => {
    const now = new Date();
    const totalMins = now.getUTCHours()*60 + now.getUTCMinutes() + 330;
    const istHour   = Math.floor(totalMins / 60) % 24;
    if (istHour >= 5  && istHour < 12) return { text:"Good morning",   type:"morning" };
    if (istHour >= 12 && istHour < 17) return { text:"Good afternoon", type:"afternoon" };
    if (istHour >= 17 && istHour < 21) return { text:"Good evening",   type:"evening" };
    return { text:"Good night", type:"night" };
  };
  const [g, setG] = useState(get);
  useEffect(() => { const id = setInterval(()=>setG(get()), 60_000); return ()=>clearInterval(id); }, []);
  return g;
};

/* ── Animated Sun Icon ─────────────────────────── */
const AnimatedSun = ({ size = 18 }) => (
  <div style={{ width:size, height:size, position:"relative", flexShrink:0 }}>
    {/* Outer glow disc */}
    <div style={{
      position:"absolute", inset:-4,
      borderRadius:"50%",
      background:"radial-gradient(circle, rgba(251,191,36,0.22) 0%, transparent 70%)",
      animation:"sunGlow 2.8s ease-in-out infinite",
    }}/>
    {/* Rotating SVG (circle + rays) */}
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="#fbbf24" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ animation:"sunRotate 8s linear infinite", display:"block" }}
    >
      <circle cx="12" cy="12" r="4" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="1.7"/>
      {/* 8 rays */}
      <line x1="12" y1="2"    x2="12" y2="5"    style={{animation:"sunRayPulse 2.8s ease-in-out 0s infinite"}}/>
      <line x1="12" y1="19"   x2="12" y2="22"   style={{animation:"sunRayPulse 2.8s ease-in-out 0.35s infinite"}}/>
      <line x1="2"  y1="12"   x2="5"  y2="12"   style={{animation:"sunRayPulse 2.8s ease-in-out 0.7s infinite"}}/>
      <line x1="19" y1="12"   x2="22" y2="12"   style={{animation:"sunRayPulse 2.8s ease-in-out 1.05s infinite"}}/>
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" style={{animation:"sunRayPulse 2.8s ease-in-out 0.18s infinite"}}/>
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" style={{animation:"sunRayPulse 2.8s ease-in-out 0.53s infinite"}}/>
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" style={{animation:"sunRayPulse 2.8s ease-in-out 0.88s infinite"}}/>
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" style={{animation:"sunRayPulse 2.8s ease-in-out 1.23s infinite"}}/>
    </svg>
  </div>
);

/* ── Animated Moon Icon ────────────────────────── */
const AnimatedMoon = ({ size = 18 }) => (
  <div style={{ width:size, height:size, position:"relative", flexShrink:0 }}>
    {/* Outer glow disc */}
    <div style={{
      position:"absolute", inset:-5,
      borderRadius:"50%",
      background:"radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)",
      animation:"moonGlow 3.5s ease-in-out infinite",
    }}/>
    {/* Pendulum-swinging moon SVG */}
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round"
      style={{
        display:"block",
        transformOrigin:"50% 20%",
        animation:"moonPendulum 4s cubic-bezier(0.37,0,0.63,1) infinite, moonGlow 3.5s ease-in-out infinite",
      }}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </div>
);

/* ── Animated Sunrise Icon ─────────────────────── */
const AnimatedSunrise = ({ size = 18 }) => (
  <div style={{ width:size, height:size, position:"relative", flexShrink:0 }}>
    <div style={{ position:"absolute", inset:-4, borderRadius:"50%", background:"radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)", animation:"sunGlow 3s ease-in-out infinite" }}/>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ display:"block", animation:"sunGlow 3s ease-in-out infinite" }}>
      <path d="M5 17a7 7 0 0 1 14 0"/>
      <line x1="12" y1="3"  x2="12" y2="6"  style={{animation:"riseRayPulse 2.5s ease-in-out 0s infinite"}}/>
      <line x1="3"  y1="8"  x2="5.5" y2="10" style={{animation:"riseRayPulse 2.5s ease-in-out 0.3s infinite"}}/>
      <line x1="21" y1="8"  x2="18.5" y2="10" style={{animation:"riseRayPulse 2.5s ease-in-out 0.6s infinite"}}/>
      <line x1="3"  y1="21" x2="21" y2="21"/>
      <line x1="12" y1="10" x2="12" y2="17"/>
    </svg>
  </div>
);

/* ── Animated Sunset Icon ──────────────────────── */
const AnimatedSunset = ({ size = 18 }) => (
  <div style={{ width:size, height:size, position:"relative", flexShrink:0 }}>
    <div style={{ position:"absolute", inset:-4, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)", animation:"sunGlow 3s ease-in-out infinite" }}/>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ display:"block", animation:"sunGlow 3s ease-in-out infinite" }}>
      <path d="M5 18a7 7 0 0 1 14 0"/>
      <line x1="12" y1="4"  x2="12" y2="7"  style={{animation:"riseRayPulse 2.5s ease-in-out 0s infinite"}}/>
      <line x1="3.5" y1="9" x2="5.5" y2="11" style={{animation:"riseRayPulse 2.5s ease-in-out 0.3s infinite"}}/>
      <line x1="20.5" y1="9" x2="18.5" y2="11" style={{animation:"riseRayPulse 2.5s ease-in-out 0.6s infinite"}}/>
      <line x1="3"  y1="22" x2="21" y2="22"/>
    </svg>
  </div>
);

/* ── Greeting Icon dispatcher ──────────────────── */
const GreetingIcon = ({ type }) => {
  if (type === "morning")   return <AnimatedSunrise size={18}/>;
  if (type === "afternoon") return <AnimatedSun     size={18}/>;
  if (type === "evening")   return <AnimatedSunset  size={18}/>;
  return <AnimatedMoon size={18}/>;
};

/* ── Orbit Spinner ─────────────────────────────── */
const OrbitDot = ({ index }) => {
  const cfgs = [
    { core:"#5b7cf6", r1:"rgba(91,124,246,0.7)",  r2:"rgba(139,92,246,0.45)", d1:"2.2s", d2:"3.6s" },
    { core:"#3ecf8e", r1:"rgba(62,207,142,0.7)",  r2:"rgba(16,185,129,0.4)",  d1:"1.9s", d2:"2.8s" },
    { core:"#e8b84b", r1:"rgba(232,184,75,0.7)",  r2:"rgba(249,115,22,0.4)",  d1:"2.6s", d2:"2.1s" },
  ];
  const c = cfgs[index];
  const dl = `${index * 0.25}s`;
  return (
    <div style={{ position:"relative", width:22, height:22, flexShrink:0, marginTop:1 }}>
      {/* Outer arc */}
      <div style={{ position:"absolute", inset:-5, borderRadius:"50%", border:"1.5px solid transparent", borderTopColor:c.r1, borderRightColor:c.r1, animation:`orbitSpin ${c.d1} linear ${dl} infinite` }}/>
      {/* Inner arc reverse */}
      <div style={{ position:"absolute", inset:-1, borderRadius:"50%", border:"1px solid transparent", borderBottomColor:c.r2, borderLeftColor:c.r2, animation:`orbitSpinReverse ${c.d2} linear ${dl} infinite` }}/>
      {/* Core */}
      <div style={{ position:"absolute", inset:5, borderRadius:"50%", background:c.core, animation:`dotCorePulse 2.8s ease-in-out ${dl} infinite` }}/>
    </div>
  );
};

/* ── Auth Layout ───────────────────────────────── */
const AuthLayout = ({ children }) => {
  const { text, type } = useISTGreeting();
  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--bg)" }}>
      {/* Left panel */}
      <div style={{ width:440, flexShrink:0, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"44px 48px", borderRight:"1px solid var(--border)", background:"var(--surface)" }} className="su">
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon n="logo" size={16} color="#fff" />
          </div>
          <span style={{ fontFamily:"var(--fd)", fontSize:16, fontWeight:600, letterSpacing:"-.02em" }}>PDFSensei</span>
        </div>

        {/* Middle */}
        <div style={{ display:"flex", flexDirection:"column", gap:26 }}>
          {/* IST greeting pill — animated icon */}
          <div key={text} className="greet-anim" style={{ display:"inline-flex", alignItems:"center", gap:9, padding:"7px 14px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:99, width:"fit-content" }}>
            <GreetingIcon type={type} />
            <span style={{ fontSize:12, fontWeight:500, color:"var(--text-2)" }}>{text}</span>
          </div>

          <div>
            <div style={{ fontFamily:"var(--fd)", fontSize:28, fontWeight:600, lineHeight:1.3, letterSpacing:"-.03em" }}>Your documents,<br/>deeply understood.</div>
            <div style={{ marginTop:12, fontSize:14, color:"var(--text-2)", lineHeight:1.7 }}>Upload PDFs and have natural conversations — powered by Gemini and FAISS vector search.</div>
          </div>

          {/* Orbit spinner timeline */}
          <div style={{ position:"relative", display:"flex", flexDirection:"column" }}>
            {/* Gradient vertical line */}
            <div className="feat-line" style={{
              position:"absolute", left:10, top:11, bottom:11, width:1,
              background:"linear-gradient(to bottom, #5b7cf6, #3ecf8e, #e8b84b)",
              opacity:0.35,
            }}/>
            {[
              ["Multi-document indexing",   "Process dozens of PDFs simultaneously"],
              ["Semantic search",           "FAISS-powered vector retrieval"],
              ["OCR + Layout awareness",    "Handles scanned & structured documents"],
            ].map(([title, desc], i) => (
              <div key={title} className="feat-item" style={{ display:"flex", gap:16, alignItems:"flex-start", paddingBottom: i < 2 ? 26 : 0 }}>
                <OrbitDot index={i} />
                <div style={{ paddingTop:2 }}>
                  <div style={{ fontSize:13, fontWeight:600, letterSpacing:"-.01em" }}>{title}</div>
                  <div style={{ fontSize:12, color:"var(--text-3)", marginTop:3, lineHeight:1.55 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize:12, color:"var(--text-3)" }}>© 2025 PDFSensei · Gemini 2.5 Flash</div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div style={{ width:"100%", maxWidth:420 }} className="si">{children}</div>
      </div>
    </div>
  );
};

/* ── Form helpers ──────────────────────────────── */
const FG = ({ label, error, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    {label && <label className="lbl">{label}</label>}
    {children}
    {error && <div style={{ fontSize:12, color:"var(--danger)", display:"flex", alignItems:"center", gap:5 }} className="sd"><Icon n="info" size={12} color="var(--danger)"/> {error}</div>}
  </div>
);
const PF = ({ value, onChange, placeholder, name }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-3)" }}><Icon n="lock" size={15}/></div>
      <input className="field" type={show?"text":"password"} name={name} value={value} onChange={onChange} placeholder={placeholder} style={{ paddingLeft:38, paddingRight:42 }}/>
      <button type="button" className="bi" onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)" }}>
        <Icon n={show?"eyeOff":"eye"} size={15}/>
      </button>
    </div>
  );
};
const Separator = ({ label }) => (
  <div style={{ position:"relative", textAlign:"center", margin:"4px 0" }}>
    <div className="div"/>
    <span style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"var(--bg)", padding:"0 12px", fontSize:12, color:"var(--text-3)" }}>{label}</span>
  </div>
);

/* ── Login Page ────────────────────────────────── */
const LoginPage = ({ onLogin, onGoSignup }) => {
  const [form, setForm]     = useState({ email:"", password:"" });
  const [errs, setErrs]     = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e={};
    if(!form.email) e.email="Email is required";
    else if(!/\S+@\S+\.\S+/.test(form.email)) e.email="Enter a valid email";
    if(!form.password) e.password="Password is required";
    return e;
  };
  const submit = async (ev) => {
    ev.preventDefault();
    const e=validate(); if(Object.keys(e).length){setErrs(e);return;}
    setLoading(true); await new Promise(r=>setTimeout(r,900)); setLoading(false);
    onLogin({ name:form.email.split("@")[0], email:form.email });
  };
  const ch = ev => { setForm(p=>({...p,[ev.target.name]:ev.target.value})); setErrs(p=>({...p,[ev.target.name]:undefined})); };

  return (
    <AuthLayout>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"var(--fd)", fontSize:26, fontWeight:600, letterSpacing:"-.03em" }}>Welcome back</h1>
        <p style={{ fontSize:14, color:"var(--text-2)", marginTop:6 }}>Sign in to continue to your workspace</p>
      </div>
      <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <FG label="Email address" error={errs.email}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-3)" }}><Icon n="mail" size={15}/></div>
            <input className="field" name="email" type="email" value={form.email} onChange={ch} placeholder="you@company.com" style={{ paddingLeft:38 }}/>
          </div>
        </FG>
        <FG label="Password" error={errs.password}>
          <PF name="password" value={form.password} onChange={ch} placeholder="Your password"/>
        </FG>
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <button type="button" className="link-forgot">Forgot password?</button>
        </div>
        <button type="submit" className="bp" style={{ width:"100%", padding:12 }} disabled={loading}>
          {loading ? <><Icon n="spin" size={16} color="#fff"/> Signing in…</> : "Sign in"}
        </button>
        <Separator label="or continue with"/>
        <button type="button" className="bs" style={{ width:"100%", padding:11 }}><Icon n="google" size={16}/> Sign in with Google</button>
      </form>
      <p style={{ marginTop:24, textAlign:"center", fontSize:13, color:"var(--text-2)" }}>
        Don't have an account?{" "}
        <button type="button" className="link-inline" onClick={onGoSignup}>Create one <em className="li-arrow">↗</em></button>
      </p>
      <div style={{ marginTop:16, textAlign:"center" }}>
        <button type="button" className="link-skip" onClick={()=>onLogin({name:"Guest",email:"guest@demo.com"})}>
          <em className="skip-arrow">→</em>
          Skip for now
        </button>
      </div>
    </AuthLayout>
  );
};

/* ── Signup Page ───────────────────────────────── */
const SignupPage = ({ onSignup, onGoLogin }) => {
  const [form, setForm]     = useState({ name:"", email:"", password:"", confirm:"" });
  const [errs, setErrs]     = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const validate = () => {
    const e={};
    if(!form.name.trim()) e.name="Full name is required";
    if(!form.email) e.email="Email is required";
    else if(!/\S+@\S+\.\S+/.test(form.email)) e.email="Enter a valid email";
    if(!form.password) e.password="Password is required";
    else if(form.password.length<8) e.password="At least 8 characters required";
    if(form.confirm!==form.password) e.confirm="Passwords do not match";
    return e;
  };
  const submit = async (ev) => {
    ev.preventDefault();
    const e=validate(); if(Object.keys(e).length){setErrs(e);return;}
    setLoading(true); await new Promise(r=>setTimeout(r,1000)); setLoading(false);
    setDone(true); setTimeout(()=>onSignup({name:form.name,email:form.email}),1100);
  };
  const ch = ev => { setForm(p=>({...p,[ev.target.name]:ev.target.value})); setErrs(p=>({...p,[ev.target.name]:undefined})); };

  const strength=(()=>{const p=form.password;if(!p)return 0;let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s;})();
  const sLabel=["","Weak","Fair","Good","Strong"][strength];
  const sColor=["","var(--danger)","var(--warning)","#59c8a8","var(--success)"][strength];

  if(done) return (
    <AuthLayout>
      <div style={{ textAlign:"center", padding:"48px 0" }} className="si">
        <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(62,207,142,.12)", border:"1px solid rgba(62,207,142,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
          <Icon n="check" size={26} color="var(--success)"/>
        </div>
        <h2 style={{ fontFamily:"var(--fd)", fontSize:22, fontWeight:600, letterSpacing:"-.02em" }}>Account created</h2>
        <p style={{ fontSize:14, color:"var(--text-2)", marginTop:8 }}>Signing you in…</p>
        <p style={{ marginTop:20, fontSize:13, color:"var(--text-3)" }}>
          Not redirecting?{" "}
          <button type="button" className="link-inline" onClick={onGoLogin}>Back to sign in <em className="li-arrow">↗</em></button>
        </p>
      </div>
    </AuthLayout>
  );

  return (
    <AuthLayout>
      {/* Back to login — top of page */}
      <button type="button" className="link-inline" onClick={onGoLogin} style={{ fontSize:12, marginBottom:20, display:"inline-flex", alignItems:"center", gap:5, color:"var(--text-3)" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to sign in
      </button>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"var(--fd)", fontSize:26, fontWeight:600, letterSpacing:"-.03em" }}>Create your account</h1>
        <p style={{ fontSize:14, color:"var(--text-2)", marginTop:6 }}>Start chatting with your documents in minutes</p>
      </div>
      <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <FG label="Full name" error={errs.name}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-3)" }}><Icon n="user" size={15}/></div>
            <input className="field" name="name" type="text" value={form.name} onChange={ch} placeholder="Jane Smith" style={{ paddingLeft:38 }}/>
          </div>
        </FG>
        <FG label="Email address" error={errs.email}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-3)" }}><Icon n="mail" size={15}/></div>
            <input className="field" name="email" type="email" value={form.email} onChange={ch} placeholder="you@company.com" style={{ paddingLeft:38 }}/>
          </div>
        </FG>
        <FG label="Password" error={errs.password}>
          <PF name="password" value={form.password} onChange={ch} placeholder="Minimum 8 characters"/>
          {form.password && (
            <div style={{ display:"flex", gap:4, alignItems:"center", marginTop:3 }}>
              {[1,2,3,4].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<=strength?sColor:"var(--elevated)", transition:"background .2s" }}/>)}
              <span style={{ fontSize:11, color:sColor, marginLeft:6, whiteSpace:"nowrap", transition:"color .2s", minWidth:36 }}>{sLabel}</span>
            </div>
          )}
        </FG>
        <FG label="Confirm password" error={errs.confirm}>
          <PF name="confirm" value={form.confirm} onChange={ch} placeholder="Repeat password"/>
        </FG>
        <button type="submit" className="bp" style={{ width:"100%", padding:12, marginTop:4 }} disabled={loading}>
          {loading ? <><Icon n="spin" size={16} color="#fff"/> Creating account…</> : "Create account"}
        </button>
        <Separator label="or"/>
        <button type="button" className="bs" style={{ width:"100%", padding:11 }}><Icon n="google" size={16}/> Sign up with Google</button>
      </form>
      <p style={{ marginTop:18, textAlign:"center", fontSize:12, color:"var(--text-3)", lineHeight:1.65 }}>
        By creating an account you agree to our <span style={{ color:"var(--accent)", cursor:"pointer" }}>Terms of Service</span> and <span style={{ color:"var(--accent)", cursor:"pointer" }}>Privacy Policy</span>.
      </p>
      <p style={{ marginTop:14, textAlign:"center", fontSize:13, color:"var(--text-2)" }}>
        Already have an account?{" "}
        <button type="button" className="link-inline" onClick={onGoLogin}>Sign in <em className="li-arrow">↗</em></button>
      </p>
      <div style={{ marginTop:12, textAlign:"center" }}>
        <button type="button" className="link-skip" onClick={()=>onSignup({name:"Guest",email:"guest@demo.com"})}>
          <em className="skip-arrow">→</em>
          Skip for now
        </button>
      </div>
    </AuthLayout>
  );
};

/* ── Shared modal helpers ──────────────────────── */
const SecHead = ({ children, style }) => <div style={{ fontSize:11, fontWeight:700, letterSpacing:".06em", color:"var(--text-3)", textTransform:"uppercase", padding:"8px 2px 6px", ...style }}>{children}</div>;
const SRow = ({ icon, iconColor, title, desc, children, danger=false, onClick }) => (
  <div onClick={onClick} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:"var(--r)", cursor:onClick?"pointer":"default", transition:"border-color .15s" }}
    onMouseOver={e=>{ if(onClick) e.currentTarget.style.borderColor="var(--border-h)"; }}
    onMouseOut={e=>{ if(onClick) e.currentTarget.style.borderColor="var(--border)"; }}>
    <div style={{ width:30, height:30, borderRadius:7, background: danger?"rgba(242,103,103,.1)":"var(--panel)", border:`1px solid ${danger?"rgba(242,103,103,.2)":"var(--border)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <Icon n={icon} size={14} color={danger?"#f26767": iconColor || "currentColor"}/>
    </div>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:13, fontWeight:500, color:danger?"#f26767":"var(--text)" }}>{title}</div>
      {desc && <div style={{ fontSize:12, color:"var(--text-2)", marginTop:1 }}>{desc}</div>}
    </div>
    {children}
  </div>
);

/* ── Settings Modal ────────────────────────────── */
const SettingsModal = ({ onClose, theme, onToggle }) => (
  <div className="overlay" onClick={onClose}>
    <div className="si" onClick={e=>e.stopPropagation()} style={{ width:"min(460px,92vw)", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden" }}>
      <div style={{ padding:"20px 24px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily:"var(--fd)", fontSize:16, fontWeight:600, color:"var(--text)" }}>Settings</div>
          <div style={{ fontSize:13, color:"var(--text-2)", marginTop:2 }}>Preferences & information</div>
        </div>
        <button className="bi" onClick={onClose}><Icon n="x" size={16}/></button>
      </div>
      <div style={{ padding:24, display:"flex", flexDirection:"column", gap:6 }}>

        <SecHead>Appearance</SecHead>
        <SRow icon={theme==="dark"?"moon":"sun"} iconColor={theme==="dark"?"#a78bfa":"#d97706"} title="Theme" desc={theme==="dark"?"Dark mode is active":"Light mode is active"}>
          <div className={`tg ${theme==="light"?"on":""}`} onClick={onToggle}><div className="tk"/></div>
        </SRow>

        <SecHead style={{ marginTop:8 }}>Developers</SecHead>
        {[
          ["KP","Kamal Lochan Pradhan","Frontend Developer"],
          ["DP","Devidutta Parida","Backend Developer"],
          ["MB","Manish Mishal Behera","Database Management"],
        ].map(([initials, name, role]) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:"var(--r)" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--fd)", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0, letterSpacing:".01em" }}>
              {initials}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{name}</div>
              <div style={{ fontSize:12, color:"var(--text-2)", marginTop:1 }}>{role}</div>
            </div>
          </div>
        ))}

        <SecHead style={{ marginTop:8 }}>About</SecHead>
        <div style={{ padding:"14px 16px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:"var(--r)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>PDFSensei</div>
            <div style={{ fontSize:12, color:"var(--text-2)", marginTop:2 }}>v1.0.0 · Gemini 2.5 Flash + FAISS</div>
          </div>
          <div style={{ fontSize:11, color:"var(--text-3)" }}>© 2025</div>
        </div>

      </div>
    </div>
  </div>
);

/* ── Profile Popover ───────────────────────────── */
const ProfilePopover = ({ user, onClose, onLogout, onUpgrade }) => (
  <>
    {/* Click-outside backdrop */}
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:299 }}/>
    {/* Popover box */}
    <div className="su" style={{
      position:"absolute", bottom:"calc(100% + 8px)", left:0,
      width:240, background:"var(--panel)", border:"1px solid var(--border-h)",
      borderRadius:"var(--r-lg)", zIndex:300, overflow:"hidden",
      boxShadow:"0 8px 32px rgba(0,0,0,.35)",
    }}>
      {/* User row */}
      <div style={{ padding:"14px 14px 12px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--fd)", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>
          {user?.name?.[0]?.toUpperCase()||"U"}
        </div>
        <div style={{ overflow:"hidden" }}>
          <div style={{ fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.name||"User"}</div>
          <div style={{ fontSize:11, color:"var(--text-3)", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.email||"—"}</div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding:"6px 6px" }}>
        {/* Upgrade plan */}
        <button onClick={()=>{ onClose(); onUpgrade(); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:"var(--r-sm)", border:"none", background:"transparent", color:"var(--text)", fontFamily:"var(--fb)", fontSize:13, cursor:"pointer", transition:"background .15s", textAlign:"left" }}
          onMouseOver={e=>e.currentTarget.style.background="var(--elevated)"}
          onMouseOut={e=>e.currentTarget.style.background="transparent"}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b7cf6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span style={{ color:"var(--accent)", fontWeight:500 }}>Upgrade plan</span>
        </button>

        {/* Help */}
        <button onClick={onClose} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:"var(--r-sm)", border:"none", background:"transparent", color:"var(--text)", fontFamily:"var(--fb)", fontSize:13, cursor:"pointer", transition:"background .15s", textAlign:"left" }}
          onMouseOver={e=>e.currentTarget.style.background="var(--elevated)"}
          onMouseOut={e=>e.currentTarget.style.background="transparent"}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>Help</span>
        </button>

        <div style={{ height:1, background:"var(--border)", margin:"4px 6px" }}/>

        {/* Log out */}
        <button onClick={()=>{ onClose(); onLogout(); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:"var(--r-sm)", border:"none", background:"transparent", fontFamily:"var(--fb)", fontSize:13, cursor:"pointer", transition:"background .15s", textAlign:"left", color:"#f26767" }}
          onMouseOver={e=>e.currentTarget.style.background="rgba(242,103,103,.07)"}
          onMouseOut={e=>e.currentTarget.style.background="transparent"}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f26767" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Log out</span>
        </button>
      </div>
    </div>
  </>
);

/* ── File Item ─────────────────────────────────── */
const FileItem = ({ file, onRemove }) => (
  <div className="su" style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:"var(--r)", transition:"border-color .15s" }}
    onMouseOver={e=>e.currentTarget.style.borderColor="var(--border-h)"}
    onMouseOut={e=>e.currentTarget.style.borderColor="var(--border)"}
  >
    <div style={{ width:28, height:28, borderRadius:6, background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <Icon n="file" size={13} color="#ef4444" sw={1.8}/>
    </div>
    <div style={{ flex:1, overflow:"hidden" }}>
      <div style={{ fontSize:12, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{file.name}</div>
      <div style={{ fontSize:11, color:"var(--text-3)", marginTop:1 }}>{(file.size/1024).toFixed(0)} KB</div>
    </div>
    <button className="bi btn-trash" style={{ padding:4 }} onClick={()=>onRemove(file.name)}><Icon n="trash" size={13}/></button>
  </div>
);

/* ── Typing Dots ───────────────────────────────── */
const Dots = () => (
  <div style={{ display:"flex", gap:4, padding:"12px 16px", alignItems:"center" }}>
    {[0,1,2].map(i=><span key={i} style={{ width:6, height:6, borderRadius:"50%", background:"var(--text-3)", display:"inline-block", animation:`dp 1.3s ease-in-out ${i*.16}s infinite` }}/>)}
  </div>
);

/* ── Message ───────────────────────────────────── */
const Msg = ({ msg, idx, user }) => {
  const isU = msg.role==="user";
  const [copied, setCopied] = useState(false);
  const doCopy = () => {
    navigator.clipboard.writeText(msg.content).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),1800); });
  };
  return (
    <div className="su msg-wrap" style={{ display:"flex", flexDirection:isU?"row-reverse":"row", gap:10, alignItems:"flex-end", animationDelay:`${idx*.03}s`, position:"relative" }}>
      <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, ...(isU?{background:"var(--accent)",color:"#fff"}:{background:"var(--elevated)",border:"1px solid var(--border)",color:"var(--text-2)"}) }}>
        {isU?(user?.name?.[0]?.toUpperCase()||"U"):<Icon n="bot" size={13}/>}
      </div>
      <div style={{ maxWidth:"72%", display:"flex", flexDirection:"column", gap:3, alignItems:isU?"flex-end":"flex-start" }}>
        <div className={isU?"bu":"ba"}>{msg.content}</div>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 4px" }}>
          <span style={{ fontSize:11, color:"var(--text-3)" }}>{msg.time}</span>
          <button
            className={`bi btn-copy ${copied?"copied":""}`}
            style={{ padding:3, width:20, height:20 }}
            onClick={doCopy}
            title="Copy"
          >
            <Icon n={copied?"checkSm":"copy"} size={11} color={copied?"var(--success)":"currentColor"}/>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Quick Prompts ─────────────────────────────── */
const QUICK_PROMPTS = [
  "Summarize the key points",
  "What are the main conclusions?",
  "List all action items mentioned",
  "What data or statistics are cited?",
  "Explain the methodology used",
  "What are the recommendations?",
];
const QuickPrompts = ({ onSelect }) => (
  <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginTop:8 }}>
    {QUICK_PROMPTS.map(p=>(
      <button key={p} className="qp" onClick={()=>onSelect(p)} style={{
        fontSize:12, padding:"6px 13px", borderRadius:99,
        background:"var(--elevated)", border:"1px solid var(--border)",
        color:"var(--text-2)", cursor:"pointer", fontFamily:"var(--fb)",
      }}>{p}</button>
    ))}
  </div>
);

/* ── Empty State ───────────────────────────────── */
const Empty = ({ processed, onPrompt }) => (
  <div className="fi" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, padding:48, textAlign:"center" }}>
    <div style={{ width:48, height:48, borderRadius:12, background:"var(--elevated)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Icon n="bot" size={22} color="var(--text-3)"/>
    </div>
    <div>
      <div style={{ fontFamily:"var(--fd)", fontSize:18, fontWeight:600, letterSpacing:"-.02em" }}>
        {processed?"Ready to answer":"No documents indexed yet"}
      </div>
      <div style={{ fontSize:13, color:"var(--text-2)", marginTop:6, lineHeight:1.65, maxWidth:340 }}>
        {processed?"Try one of these questions to get started, or ask anything about your documents.":"Upload your PDF files in the sidebar and click Process to begin."}
      </div>
    </div>
    {processed && <QuickPrompts onSelect={onPrompt}/>}
    {!processed && (
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginTop:4 }}>
        {["Upload PDFs","Process","Start asking"].map((s,i)=>(
          <div key={s} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:20, height:20, borderRadius:"50%", background:"var(--accent-dim)", border:"1px solid rgba(91,124,246,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:600, color:"var(--accent)" }}>{i+1}</div>
            <span style={{ fontSize:12, color:"var(--text-2)" }}>{s}</span>
            {i<2 && <Icon n="cr" size={12} color="var(--text-3)"/>}
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ── Pricing Page ──────────────────────────────── */
const PLANS = [
  {
    id:"free", name:"Free", color:"#6b7280",
    monthly:{ price:"₹0", sub:"Forever free" },
    yearly:{  price:"₹0", sub:"Forever free" },
    desc:"Try PDFSensei at no cost",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>,
    features:[
      {t:"Up to 3 PDFs per session"},
      {t:"Max 10 MB per file"},
      {t:"20 questions per day"},
      {t:"Basic semantic search"},
      {t:"Standard response speed"},
      {t:"Community support"},
    ],
    no:["Priority processing","Export chats","Multi-doc cross-search","API access"],
    cta:"Current plan", featured:false, disabled:true,
  },
  {
    id:"pro", name:"Pro", color:"#5b7cf6",
    monthly:{ price:"₹749", sub:"per month" },
    yearly:{  price:"₹599", sub:"per month, billed ₹7,188/yr" },
    desc:"For researchers & power users",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    features:[
      {t:"Unlimited PDFs per session"},
      {t:"Up to 100 MB per file"},
      {t:"Unlimited questions"},
      {t:"Advanced semantic search"},
      {t:"Priority Gemini responses"},
      {t:"Export conversations (PDF/TXT)"},
      {t:"Multi-doc cross-search"},
      {t:"Email support"},
    ],
    no:["Team collaboration","API access"],
    cta:"Upgrade to Pro", featured:true, disabled:false,
  },
  {
    id:"team", name:"Team", color:"#8b5cf6",
    monthly:{ price:"₹2,499", sub:"per month, up to 5 seats" },
    yearly:{  price:"₹1,999", sub:"per month, billed ₹23,988/yr" },
    desc:"Built for teams working together",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    features:[
      {t:"Everything in Pro"},
      {t:"5 team seats included"},
      {t:"Shared document workspace"},
      {t:"Team usage dashboard"},
      {t:"Role-based access control"},
      {t:"Collaborative annotations"},
      {t:"Priority email & chat support"},
      {t:"Admin billing portal"},
    ],
    no:["On-premise deployment","API access"],
    cta:"Start 7-day trial", featured:false, disabled:false,
  },
  {
    id:"enterprise", name:"Enterprise", color:"#f59e0b",
    monthly:{ price:"Custom", sub:"Contact us for pricing" },
    yearly:{  price:"Custom", sub:"Volume discounts available" },
    desc:"For organisations at scale",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    features:[
      {t:"Unlimited seats"},
      {t:"On-premise / private cloud"},
      {t:"SSO & SAML authentication"},
      {t:"Full REST API access"},
      {t:"Custom data retention policy"},
      {t:"Dedicated account manager"},
      {t:"99.9% uptime SLA"},
      {t:"Custom integrations & webhooks"},
    ],
    no:[],
    cta:"Contact sales", featured:false, disabled:false,
  },
];

const PricingPage = ({ onBack }) => {
  const [billing, setBilling] = useState("monthly");
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column", overflowY:"auto", position:"relative" }}>

      {/* Close button */}
      <button onClick={onBack} className="bi" style={{ position:"absolute", top:20, right:24, zIndex:10 }}>
        <Icon n="x" size={18}/>
      </button>

      {/* Hero */}
      <div style={{ textAlign:"center", padding:"48px 24px 40px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:99, background:"var(--accent-dim)", border:"1px solid rgba(91,124,246,.2)", marginBottom:18 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#5b7cf6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span style={{ fontSize:11, fontWeight:600, color:"var(--accent)", letterSpacing:".06em" }}>UPGRADE YOUR PLAN</span>
        </div>
        <div style={{ fontFamily:"var(--fd)", fontSize:36, fontWeight:800, letterSpacing:"-.04em", lineHeight:1.15, marginBottom:12, color:"var(--text)" }}>
          Simple, transparent pricing
        </div>
        <div style={{ fontSize:15, color:"var(--text-2)", lineHeight:1.7, maxWidth:480, margin:"0 auto 28px" }}>
          Start for free. Scale when you're ready. No hidden fees. Cancel anytime.
        </div>
        {/* Billing toggle */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:0, background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:99, padding:4 }}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{ padding:"6px 20px", borderRadius:99, border:"none", cursor:"pointer", fontFamily:"var(--fb)", fontSize:12, fontWeight:600, transition:"all .18s",
              background: billing===b ? "var(--accent)" : "transparent",
              color: billing===b ? "#fff" : "var(--text-2)",
            }}>
              {b==="monthly" ? "Monthly" : <>Yearly <span style={{ color: billing==="yearly"?"rgba(255,255,255,.75)":"var(--success)", fontSize:11 }}>· Save 20%</span></>}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, maxWidth:1120, margin:"0 auto", padding:"0 32px 64px", width:"100%" }}>
        {PLANS.map((p, pi) => {
          const priceData = billing==="yearly" ? p.yearly : p.monthly;
          const isCustom = priceData.price === "Custom";
          const isFree = priceData.price === "₹0";
          return (
            <div key={p.id} style={{
              position:"relative", borderRadius:16,
              border: p.featured ? `2px solid ${p.color}` : "1.5px solid var(--border)",
              background: p.featured ? `linear-gradient(160deg, var(--elevated) 0%, color-mix(in srgb, ${p.color} 6%, var(--elevated)) 100%)` : "var(--elevated)",
              padding:"28px 22px 22px",
              display:"flex", flexDirection:"column", gap:0,
              transition:"transform .22s, box-shadow .22s",
              boxShadow: p.featured ? `0 0 0 1px ${p.color}22, 0 8px 40px ${p.color}18` : "none",
              animation:`planIn .4s cubic-bezier(.22,1,.36,1) ${pi*.07}s both`,
            }}
              onMouseOver={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=p.featured?`0 0 0 1px ${p.color}44, 0 20px 50px ${p.color}25`:"0 8px 28px rgba(0,0,0,.18)"; }}
              onMouseOut={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=p.featured?`0 0 0 1px ${p.color}22, 0 8px 40px ${p.color}18`:"none"; }}
            >
              {/* Popular badge */}
              {p.featured && (
                <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(90deg, ${p.color}, #8b5cf6)`, color:"#fff", fontSize:10, fontWeight:700, padding:"4px 14px", borderRadius:99, letterSpacing:".06em", whiteSpace:"nowrap", boxShadow:`0 2px 12px ${p.color}55` }}>
                  ✦ MOST POPULAR
                </div>
              )}

              {/* Plan header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`color-mix(in srgb, ${p.color} 14%, var(--panel))`, border:`1px solid color-mix(in srgb, ${p.color} 22%, transparent)`, display:"flex", alignItems:"center", justifyContent:"center", color:p.color }}>
                  {p.icon}
                </div>
                {p.id==="free" && <span style={{ fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:99, background:"var(--panel)", border:"1px solid var(--border)", color:"var(--text-3)", letterSpacing:".04em" }}>CURRENT</span>}
              </div>
              <div style={{ fontSize:12, fontWeight:700, color:p.color, letterSpacing:".06em", textTransform:"uppercase", marginBottom:3 }}>{p.name}</div>
              <div style={{ fontSize:12, color:"var(--text-3)", lineHeight:1.5, marginBottom:18 }}>{p.desc}</div>

              {/* Price */}
              <div style={{ paddingBottom:18, borderBottom:"1px solid var(--border)", marginBottom:18 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:4 }}>
                  <span style={{ fontFamily:"var(--fd)", fontSize:isCustom?26:32, fontWeight:800, letterSpacing:"-.03em", color:"var(--text)" }}>{priceData.price}</span>
                  {!isCustom && !isFree && <span style={{ fontSize:12, color:"var(--text-3)" }}>/mo</span>}
                </div>
                <div style={{ fontSize:11, color: billing==="yearly" && !isCustom && !isFree ? "var(--success)" : "var(--text-3)", lineHeight:1.5 }}>{priceData.sub}</div>
                {billing==="yearly" && !isCustom && !isFree && (
                  <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2 }}>
                    was {p.monthly.price}/mo
                  </div>
                )}
              </div>

              {/* Features */}
              <div style={{ display:"flex", flexDirection:"column", gap:9, flex:1, marginBottom:20 }}>
                {p.features.map(f=>(
                  <div key={f.t} style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
                    <div style={{ width:15, height:15, borderRadius:"50%", flexShrink:0, marginTop:1, display:"flex", alignItems:"center", justifyContent:"center", background:`color-mix(in srgb, ${p.color} 14%, transparent)`, border:`1px solid color-mix(in srgb, ${p.color} 28%, transparent)` }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize:12, color:"var(--text-2)", lineHeight:1.5 }}>{f.t}</span>
                  </div>
                ))}
                {p.no.map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:9, opacity:.38 }}>
                    <div style={{ width:15, height:15, borderRadius:"50%", flexShrink:0, marginTop:1, display:"flex", alignItems:"center", justifyContent:"center", background:"var(--panel)", border:"1px solid var(--border)" }}>
                      <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <span style={{ fontSize:12, color:"var(--text-3)", lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button style={{
                width:"100%", padding:"11px 0", borderRadius:10, cursor: p.disabled ? "default" : "pointer",
                fontFamily:"var(--fb)", fontSize:13, fontWeight:600, letterSpacing:".01em",
                transition:"filter .18s, transform .12s, opacity .15s",
                opacity: p.disabled ? 0.5 : 1, border:"none",
                background: p.featured ? `linear-gradient(135deg, ${p.color}, #8b5cf6)` : "var(--panel)",
                color: p.featured ? "#fff" : "var(--text-2)",
                outline: p.featured ? "none" : "1px solid var(--border)",
                boxShadow: p.featured ? `0 4px 16px ${p.color}40` : "none",
              }} disabled={p.disabled}
                onMouseOver={e=>{ if(!p.disabled){ e.currentTarget.style.filter="brightness(1.1)"; e.currentTarget.style.transform="translateY(-1px)"; }}}
                onMouseOut={e=>{ e.currentTarget.style.filter="none"; e.currentTarget.style.transform="none"; }}
              >
                {p.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign:"center", fontSize:12, color:"var(--text-3)", paddingBottom:48 }}>
        All plans include end-to-end encryption · Prices in INR · GST applicable · Cancel anytime
      </div>
    </div>
  );
};

/* ── New Chat Confirm Modal ────────────────────── */
const NewChatModal = ({ onConfirm, onCancel, hasData }) => (
  <div className="overlay" onClick={onCancel}>
    <div className="si" onClick={e=>e.stopPropagation()} style={{
      width:"min(420px,92vw)", background:"var(--surface)",
      border:"1px solid var(--border)", borderRadius:"var(--r-lg)",
      overflow:"hidden",
    }}>
      {/* Top accent bar */}
      <div style={{ height:3, background:"linear-gradient(90deg,#5b7cf6,#8b5cf6)" }}/>

      <div style={{ padding:"24px 24px 20px" }}>
        {/* Icon badge */}
        <div style={{ width:44, height:44, borderRadius:12, background:"rgba(91,124,246,.12)", border:"1px solid rgba(91,124,246,.22)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5b7cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>

        <div style={{ fontFamily:"var(--fd)", fontSize:17, fontWeight:600, letterSpacing:"-.02em", marginBottom:8 }}>
          Start a new chat?
        </div>

        <div style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.7, marginBottom:6 }}>
          {hasData
            ? "This will clear your current conversation and all uploaded documents."
            : "This will start a fresh session."}
        </div>

        {/* Privacy note */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:9, padding:"10px 12px", background:"rgba(91,124,246,.07)", border:"1px solid rgba(91,124,246,.15)", borderRadius:"var(--r-sm)", marginTop:14 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b7cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:2 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span style={{ fontSize:12, color:"var(--text-2)", lineHeight:1.6 }}>
            <strong style={{ color:"var(--text)", fontWeight:600 }}>Your privacy is protected.</strong>{" "}
            We don't store chat history or document data. Everything is cleared from memory instantly.
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding:"0 24px 24px", display:"flex", gap:10 }}>
        <button className="bs" style={{ flex:1, padding:"10px 0", justifyContent:"center" }} onClick={onCancel}>
          Cancel
        </button>
        <button className="bp" style={{ flex:1, padding:"10px 0", justifyContent:"center" }} onClick={onConfirm}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          New chat
        </button>
      </div>
    </div>
  </div>
);

/* ── App Shell ─────────────────────────────────── */
const AppShell = ({ user, onLogout, theme, onToggle }) => {
  const [files,      setFiles]      = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState("");
  const [isTyping,   setIsTyping]   = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processed,  setProcessed]  = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sbOpen,     setSbOpen]     = useState(true);
  const [showCog,    setShowCog]    = useState(false);
  const [showProfile,setShowProfile]= useState(false);
  const [showPricing,setShowPricing]= useState(false);
  const [showNewChat,setShowNewChat]= useState(false);

  const fileRef  = useRef(null);
  const chatRef  = useRef(null);
  const inputRef = useRef(null);

  const MAX_CHARS = 1000;
  const charCount = input.length;
  const charWarn  = charCount > MAX_CHARS * 0.85;

  useEffect(()=>{ chatRef.current?.scrollTo({ top:chatRef.current.scrollHeight, behavior:"smooth" }); }, [messages, isTyping]);
  useEffect(()=>{
    if(!inputRef.current) return;
    inputRef.current.style.height="auto";
    inputRef.current.style.height=Math.min(inputRef.current.scrollHeight,130)+"px";
  }, [input]);

  const addFiles = (incoming) => {
    const pdfs=incoming.filter(f=>f.type==="application/pdf"||f.name.endsWith(".pdf"));
    setFiles(prev=>{const names=new Set(prev.map(f=>f.name));return [...prev,...pdfs.filter(f=>!names.has(f.name))];});
  };
  const handleDrop = useCallback(e=>{ e.preventDefault(); setIsDragging(false); addFiles(Array.from(e.dataTransfer.files)); },[]);

  const now  = ()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  const push = (role,content)=>setMessages(p=>[...p,{role,content,time:now()}]);

  const process = async () => {
    if(!files.length) return;
    setProcessing(true);
    const fd=new FormData(); files.forEach(f=>fd.append("files",f));
    try {
      const r=await fetch("http://localhost:5000/process",{method:"POST",body:fd});
      const d=await r.json();
      if(d.status==="ok"){ setProcessed(true); push("assistant",`${files.length} document${files.length>1?"s":""} indexed across ${d.chunk_count??"—"} chunks. What would you like to know?`); }
      else push("assistant",`Indexing failed: ${d.message}`);
    } catch { setProcessed(true); push("assistant","Could not reach the backend. Ensure Flask is running on port 5000."); }
    setProcessing(false);
  };

  const send = async (q) => {
    q=(q||input).trim(); if(!q||isTyping) return;
    setInput(""); push("user",q); setIsTyping(true);
    try {
      const r=await fetch("http://localhost:5000/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});
      const d=await r.json();
      push("assistant",d.answer||"No answer returned.");
    } catch { push("assistant","Backend is not reachable. Please start the Flask server on port 5000."); }
    setIsTyping(false);
  };

  const clearChat  = ()=>setMessages([]);
  const newSession = ()=>{ setMessages([]); setFiles([]); setProcessed(false); setProcessing(false); setInput(""); };
  const downloadChat = ()=>{
    const text=messages.map(m=>`[${m.time}] ${m.role==="user"?"You":"PDFSensei"}: ${m.content}`).join("\n\n");
    const blob=new Blob([text],{type:"text/plain"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`chat-${Date.now()}.txt`; a.click();
  };

  return (
    <TooltipProvider>
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>

      {/* ── Main row: Sidebar | Chat (no topbar) ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

      {/* ── Unified Collapsible Sidebar ── */}
        <aside className={sbOpen ? "" : "sb-closed"} style={{
          width: sbOpen ? "var(--sidebar)" : "var(--nav)",
          flexShrink:0, background:"var(--surface)", borderRight:"1px solid var(--border)",
          display:"flex", flexDirection:"column",
          transition:"width .28s cubic-bezier(.22,1,.36,1)", zIndex:10,
          overflow: sbOpen ? "hidden" : "visible",
        }}>

          {/* When CLOSED — simple centered icon column */}
          {!sbOpen && (
            <div style={{ width:"var(--nav)", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0" }}>
              <TipBtn tip="" className="sb-row btn-menu" onClick={()=>setSbOpen(true)}
                style={{ width:36, height:36, justifyContent:"center", padding:0 }}>
                <span className="sb-icon"><HamburgerIcon/></span>
              </TipBtn>
              <TipBtn tip="Upload PDFs" className="sb-row" onClick={()=>{ setSbOpen(true); setTimeout(()=>fileRef.current?.click(),320); }}
                style={{ width:36, height:36, justifyContent:"center", padding:0, marginTop:4 }}>
                <span className="sb-icon"><Icon n="up" size={15}/></span>
              </TipBtn>
              {processed && (
                <TipBtn tip={`${files.length} doc${files.length>1?"s":""} ready`} className="sb-row"
                  style={{ width:36, height:36, justifyContent:"center", padding:0, marginTop:4 }}>
                  <span className="sb-icon"><Icon n="check" size={15} color="var(--success)"/></span>
                </TipBtn>
              )}
              <div style={{ flex:1 }}/>
              <TipBtn tip="Settings" className="sb-row" onClick={()=>setShowCog(true)}
                style={{ width:36, height:36, justifyContent:"center", padding:0 }}>
                <span className="sb-icon"><Icon n="cog" size={17}/></span>
              </TipBtn>
              <div style={{ position:"relative", marginTop:4, marginBottom:4 }}>
                {showProfile && <ProfilePopover user={user} onClose={()=>setShowProfile(false)} onLogout={onLogout} onUpgrade={()=>setShowPricing(true)}/>}
                <TipBtn tip={user?.name||"Profile"} className="sb-row" onClick={()=>setShowProfile(p=>!p)}
                  style={{ width:36, height:36, justifyContent:"center", padding:0 }}>
                  <span className="sb-icon">
                    <div style={{ width:24, height:24, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>
                      {user?.name?.[0]?.toUpperCase()||"U"}
                    </div>
                  </span>
                </TipBtn>
              </div>
            </div>
          )}

          {/* When OPEN — full sidebar */}
          {sbOpen && (
            <div style={{ width:"var(--sidebar)", height:"100%", display:"flex", flexDirection:"column", padding:"10px 10px", overflow:"hidden" }}>

              {/* Toggle at top-left with label */}
              <div style={{ flexShrink:0, marginBottom:12 }}>
                <button className="sb-row btn-menu active" onClick={()=>setSbOpen(false)}>
                  <span className="sb-icon"><HamburgerIcon/></span>
                  <span className="sb-label" style={{ fontSize:13, color:"var(--text-2)" }}>Hide sidebar</span>
                </button>
              </div>

              {/* Documents heading — centered */}
              <div style={{ textAlign:"center", fontSize:11, fontWeight:600, letterSpacing:".08em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:12, flexShrink:0 }}>
                Documents
              </div>

              {/* Upload + files + process */}
              <div className="fi" style={{ flex:1, display:"flex", flexDirection:"column", gap:10, overflow:"hidden" }}>
                <div className={`dz btn-up${isDragging?" on":""}`}
                  style={{ padding:18, display:"flex", flexDirection:"column", alignItems:"center", gap:8, userSelect:"none", flexShrink:0 }}
                  onDragOver={e=>{ e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={()=>setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={()=>fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept=".pdf" multiple style={{ display:"none" }} onChange={e=>{addFiles(Array.from(e.target.files));e.target.value="";}}/>
                  <div style={{ width:32, height:32, borderRadius:8, background:"var(--elevated)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon n="up" size={15} color="var(--text-2)"/>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:12, fontWeight:500 }}>Drop PDFs here</div>
                    <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2 }}>or click to browse</div>
                  </div>
                </div>

                {files.length > 0 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:5, overflowY:"auto", maxHeight:200 }}>
                    {files.map(f => <FileItem key={f.name} file={f} onRemove={n=>{ setFiles(p=>p.filter(x=>x.name!==n)); if(processed)setProcessed(false); }}/>)}
                  </div>
                )}

                {files.length > 0 && (
                  <button className={`bp${processing?" btn-shimmer":""}`} style={{ width:"100%", padding:10, fontSize:13, flexShrink:0 }} onClick={process} disabled={processing||processed}>
                    {processing ? <><Icon n="spin" size={14} color="#fff"/> Indexing…</>
                      : processed ? <><Icon n="check" size={14} color="#fff"/> Documents ready</>
                      : <><Icon n="zap" size={14} color="#fff"/> Process</>}
                  </button>
                )}
              </div>

              {/* Settings + profile — bottom left */}
              <div style={{ flexShrink:0, paddingTop:10, borderTop:"1px solid var(--border)", display:"flex", flexDirection:"column", gap:2, position:"relative" }}>
                {showProfile && <ProfilePopover user={user} onClose={()=>setShowProfile(false)} onLogout={onLogout} onUpgrade={()=>setShowPricing(true)}/>}
                <button className="sb-row" onClick={()=>setShowCog(true)} style={{ justifyContent:"flex-start" }}
                  onMouseOver={e=>{const s=e.currentTarget.querySelector("svg");if(s)s.style.transform="rotate(90deg)";}}
                  onMouseOut={e=>{const s=e.currentTarget.querySelector("svg");if(s)s.style.transform="rotate(0deg)";}}>
                  <span className="sb-icon" style={{ transition:"transform .3s" }}><Icon n="cog" size={16}/></span>
                  <span className="sb-label">Settings</span>
                </button>
                <button className="sb-row" onClick={()=>setShowProfile(p=>!p)} style={{ justifyContent:"flex-start" }}>
                  <span className="sb-icon">
                    <div style={{ width:22, height:22, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>
                      {user?.name?.[0]?.toUpperCase()||"U"}
                    </div>
                  </span>
                  <span className="sb-label" style={{ overflow:"hidden", textOverflow:"ellipsis" }}>{user?.name||"User"}</span>
                </button>
              </div>

            </div>
          )}
        </aside>

        {/* Chat */}
        <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, position:"relative" }}>

          {/* Brand bar — sits at top of main area, no border */}
          <div style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px 0", position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:24, height:24, borderRadius:6, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon n="logo" size={12} color="#fff"/>
              </div>
              <span style={{ fontFamily:"var(--fd)", fontSize:15, fontWeight:700, letterSpacing:"-.02em", color:"var(--text)" }}>PDFSensei</span>
            </div>

            {/* Get Plus — always centered */}
            <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
              <button className="btn-plus" onClick={()=>setShowPricing(true)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Get Plus
              </button>
            </div>

            {/* Right: indexed badge */}
            <div>
              {processed && (
                <div className="fi" style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:500, color:"var(--success)", background:"rgba(62,207,142,.1)", border:"1px solid rgba(62,207,142,.2)", padding:"3px 9px", borderRadius:99 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--success)", display:"inline-block" }}/>
                  {files.length} doc{files.length>1?"s":""} indexed
                </div>
              )}
            </div>
          </div>

          {/* No messages — centered layout */}
          {messages.length === 0 && !isTyping && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 24px", gap:32 }}>
              {/* 3-step guide */}
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {["Upload PDFs","Process","Start asking"].map((s,i)=>(
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:99 }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background: processed && i<2 ? "var(--success)" : i===0 && files.length>0 ? "var(--success)" : "var(--accent-dim)", border:`1px solid ${processed && i<2 ? "rgba(62,207,142,.3)" : "rgba(91,124,246,.25)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color: processed && i<2 ? "var(--success)" : "var(--accent)", flexShrink:0 }}>{i+1}</div>
                      <span style={{ fontSize:12, fontWeight:500, color:"var(--text-2)", whiteSpace:"nowrap" }}>{s}</span>
                    </div>
                    {i < 2 && <Icon n="cr" size={12} color="var(--text-3)"/>}
                  </div>
                ))}
              </div>

              {/* Centered input */}
              <div style={{ width:"100%", maxWidth:620 }}>
                <div style={{ display:"flex", alignItems:"center", gap:0, background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:99, padding:"6px 8px 6px 14px", transition:"border-color .15s" }}
                  onFocus={()=>{}} 
                  onMouseOver={e=>e.currentTarget.style.borderColor="var(--border-h)"}
                  onMouseOut={e=>e.currentTarget.style.borderColor="var(--border)"}
                >
                  {/* Plus / New Chat */}
                  <TipBtn
                    tip="New chat"
                    below
                    className=""
                    style={{ background:"transparent", border:"none", cursor:"pointer", color:"var(--text-3)", padding:"0 10px 0 0", display:"flex", alignItems:"center", flexShrink:0, transition:"color .15s" }}
                    onClick={()=>setShowNewChat(true)}
                    onMouseOver={e=>e.currentTarget.style.color="var(--text)"}
                    onMouseOut={e=>e.currentTarget.style.color="var(--text-3)"}
                  >
                    <Icon n="plus" size={17}/>
                  </TipBtn>

                  {/* Textarea — always typeable */}
                  <textarea
                    ref={inputRef}
                    rows={1}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", resize:"none", fontFamily:"var(--fb)", fontSize:14, color:"var(--text)", lineHeight:"1.55", minHeight:32, maxHeight:120, padding:"4px 0", caretColor:"var(--accent)" }}
                    placeholder="Ask anything"
                    value={input}
                    onChange={e=>setInput(e.target.value.slice(0,MAX_CHARS))}
                    onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
                  />

                  {/* Right icons */}
                  <div style={{ display:"flex", alignItems:"center", gap:6, paddingLeft:8, flexShrink:0 }}>
                    <TipBtn
                      below
                      tip={files.length===0 ? "Upload your PDFs first" : !processed ? "Process your PDFs first" : ""}
                      className=""
                      style={{ width:34, height:34, borderRadius:"50%", background:"var(--panel)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", cursor: processed&&input.trim() ? "pointer" : "default", opacity: processed&&input.trim() ? 1 : 0.4, transition:"opacity .15s, background .15s", flexShrink:0 }}
                      onClick={()=>{ if(processed&&input.trim()) send(); }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </TipBtn>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Has messages — scroll area + bottom input */}
          {(messages.length > 0 || isTyping) && (
            <>
              <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"28px 32px", display:"flex", flexDirection:"column", gap:18 }}>
                {messages.map((m,i)=><Msg key={i} msg={m} idx={i} user={user}/>)}
                {isTyping && (
                  <div className="su" style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--elevated)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon n="bot" size={13} color="var(--text-2)"/>
                    </div>
                    <div className="ba" style={{ padding:0 }}><Dots/></div>
                  </div>
                )}
              </div>

              <div style={{ padding:"12px 24px 16px", background:"var(--surface)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:0, background:"var(--elevated)", border:"1px solid var(--border)", borderRadius:99, padding:"6px 8px 6px 14px", transition:"border-color .15s" }}
                  onMouseOver={e=>e.currentTarget.style.borderColor="var(--border-h)"}
                  onMouseOut={e=>e.currentTarget.style.borderColor="var(--border)"}
                >
                  <TipBtn
                    tip="New chat"
                    below
                    className=""
                    style={{ background:"transparent", border:"none", cursor:"pointer", color:"var(--text-3)", padding:"0 10px 0 0", display:"flex", alignItems:"center", flexShrink:0, transition:"color .15s" }}
                    onClick={()=>setShowNewChat(true)}
                    onMouseOver={e=>e.currentTarget.style.color="var(--text)"}
                    onMouseOut={e=>e.currentTarget.style.color="var(--text-3)"}
                  >
                    <Icon n="plus" size={17}/>
                  </TipBtn>
                  <textarea
                    ref={inputRef}
                    rows={1}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", resize:"none", fontFamily:"var(--fb)", fontSize:14, color:"var(--text)", lineHeight:"1.55", minHeight:32, maxHeight:120, padding:"4px 0", caretColor:"var(--accent)" }}
                    placeholder="Ask anything"
                    value={input}
                    onChange={e=>setInput(e.target.value.slice(0,MAX_CHARS))}
                    onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
                    disabled={isTyping}
                  />
                  <div style={{ display:"flex", alignItems:"center", gap:6, paddingLeft:8, flexShrink:0 }}>
                    <button style={{ width:34, height:34, borderRadius:"50%", background:"var(--panel)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", cursor: input.trim()&&!isTyping ? "pointer" : "default", opacity: input.trim()&&!isTyping ? 1 : 0.4, transition:"opacity .15s", flexShrink:0 }}
                      onClick={()=>{ if(input.trim()&&!isTyping) send(); }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {showCog     && <SettingsModal theme={theme} onToggle={onToggle} onClose={()=>setShowCog(false)}/>}
      {showNewChat && <NewChatModal
        hasData={messages.length>0||files.length>0}
        onConfirm={()=>{ newSession(); setShowNewChat(false); }}
        onCancel={()=>setShowNewChat(false)}
      />}
      {showPricing && (
        <div style={{ position:"fixed", inset:0, zIndex:100, background:"var(--bg)", overflowY:"auto" }}>
          <PricingPage onBack={()=>setShowPricing(false)}/>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
};

/* ── Root ──────────────────────────────────────── */
export default function App() {
  const [page,  setPage]  = useState("login");
  const [user,  setUser]  = useState(null);
  const [theme, setTheme] = useState("dark");
  const login  = u=>{ setUser(u); setPage("app"); };
  const logout = ()=>{ setUser(null); setPage("login"); };
  return (
    <div className={theme} style={{ height:"100%", background:"var(--bg)" }}>
      <GlobalStyles/>
      {page==="login"  && <LoginPage  onLogin={login}  onGoSignup={()=>setPage("signup")}/>}
      {page==="signup" && <SignupPage onSignup={login} onGoLogin={()=>setPage("login")} />}
      {page==="app"    && <AppShell  user={user} onLogout={logout} theme={theme} onToggle={()=>setTheme(t=>t==="dark"?"light":"dark")}/>}
    </div>
  );
}
