import { NextPage } from 'next';

import { Authorization } from '../components/Authorization/Authorization';
import { Layout } from '../components/Layout/Layout';

const Prihlaseni: NextPage = () => (
  <Layout>
    <Authorization />
  </Layout>
);

export default Prihlaseni;
