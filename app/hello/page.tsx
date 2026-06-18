import Link from 'next/link';
import HelloNameForm from './HelloNameForm';

export default function HelloPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black px-4 py-10 text-zinc-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <Link
          href="/"
          className="mb-10 inline-flex w-fit items-center rounded-lg border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white"
        >
          Back to Feed
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <HelloNameForm />
        </div>
      </div>
    </main>
  );
}
