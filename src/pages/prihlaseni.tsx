import { NextPage } from 'next';

import { Authorization } from '../components/Authorization/Authorization';
import { Layout } from '../components/Layout/Layout';

type PrihlaseniProps = {
  setIsLogged: (value: boolean) => void;
};

const Prihlaseni: NextPage<PrihlaseniProps> = ({ setIsLogged }) => (
  <Layout>
    <Authorization setIsLogged={setIsLogged} />
  </Layout>
);

export default Prihlaseni;
