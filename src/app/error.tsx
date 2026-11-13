'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="section not-found"><h1>A brief<br/>interruption.</h1><p>Something didn’t load correctly. Let’s try again.</p><button className="button" onClick={reset}>Try again ↗</button></section>}
