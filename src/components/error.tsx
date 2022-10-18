import Head from 'next/head';
import Layout from './layout';

const ErrorPage: React.FC<{ status: number; message: string }> = ({ status, message }) => {
  return (
    <Layout center={true}>
      <Head>
        <title>{`${status} | My FAQ Page`}</title>
        <meta name="description" content="Page not found" />
      </Head>
      <h1 className="text-9xl font-bold text-black">{status}</h1>
      <p>{message}</p>
    </Layout>
  );
};

export default ErrorPage;
