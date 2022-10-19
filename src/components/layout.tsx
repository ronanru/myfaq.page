import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout: React.FC<{ children: React.ReactNode; center: boolean; onSignIn?: () => void }> = ({
  children,
  center,
  onSignIn
}) => {
  const session = useSession(),
    router = useRouter();

  return (
    <>
      <header className="container flex items-center justify-between p-4">
        <Link href="/">
          <a className="rounded-md text-2xl font-bold"> My FAQ Page</a>
        </Link>
        {router.pathname === '/' ? (
          <>
            {session.status === 'unauthenticated' && <button onClick={onSignIn}>Sign In</button>}
            {session.status === 'authenticated' && (
              <Link href="/dashboard">
                <a className="rounded">Dashboard</a>
              </Link>
            )}
          </>
        ) : (
          <Link href="/">
            <a className="rounded">Home</a>
          </Link>
        )}
      </header>
      <main
        className={`container flex flex-1 flex-col gap-8${
          center ? ' items-center justify-center' : ''
        }`}>
        {children}
      </main>
      <footer className="container flex justify-between p-4">
        <p>© My FAQ Page 2022</p>
        <p>
          Developed by{' '}
          <a
            className="rounded text-black underline"
            href="https://roananru.com"
            target="_blank"
            rel="noopener noreferrer">
            Ronan
          </a>
        </p>
      </footer>
    </>
  );
};

export default Layout;
