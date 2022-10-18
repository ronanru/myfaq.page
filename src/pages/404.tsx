import type { NextPage } from 'next';
import ErrorPage from '@/components/error';

const PageNotFound: NextPage = () => (
  <ErrorPage status={404} message="Page not found, lol ¯\_(ツ)_/¯"></ErrorPage>
);

export default PageNotFound;
