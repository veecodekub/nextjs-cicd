'use client';

import { FormEvent, useMemo, useState } from 'react';

export default function HelloNameForm() {
  const [name, setName] = useState('');
  const displayName = useMemo(() => name.trim(), [name]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-2xl shadow-black/20">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Hello page
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Hello{displayName ? `, ${displayName}` : ''}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Type your name and the greeting will update instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-200">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="rounded-lg border border-zinc-800 bg-black/25 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
            Preview
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-100">
            {displayName ? `Hello, ${displayName}!` : 'Hello!'}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-300">
            CI/CD release note
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-50/90">
            This page is ready for the GitOps promotion flow.
          </p>
        </div>
      </form>
    </section>
  );
}
