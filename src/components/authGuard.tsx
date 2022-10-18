import { useSession } from 'next-auth/react';
import ErrorPage from '../components/error';
import Layout from '../components/layout';
import Loading from '../components/loading';

const Dashboard: React.FC<{ children: React.ReactNode; center: boolean }> = ({
  children,
  center
}) => {
  const session = useSession();

  if (session.status === 'loading')
    return (
      <Layout center={true}>
        <Loading></Loading>
      </Layout>
    );
  if (session.status === 'unauthenticated')
    return (
      <ErrorPage message="You have to be signed in to view this page" status={403}></ErrorPage>
    );

  return <Layout center={center}>{children}</Layout>;
};

export default Dashboard;
