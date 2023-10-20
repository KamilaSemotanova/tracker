import { Authorization } from '../components/Authorization/Authorization';
import { Layout } from '../components/Layout/Layout';

const Prihlaseni = ({ setIsLogged }) => (
  <Layout>
    <Authorization setIsLogged={setIsLogged} />
  </Layout>
);

export default Prihlaseni;
