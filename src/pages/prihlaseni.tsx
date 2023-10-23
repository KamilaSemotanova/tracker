import { Authorization } from '../components/Authorization/Authorization';
import { Layout } from '../components/Layout/Layout';

const Prihlaseni = ({
  setIsLogged,
}: {
  setIsLogged: (value: boolean) => void;
}) => (
  <Layout>
    <Authorization setIsLogged={setIsLogged} />
  </Layout>
);

export default Prihlaseni;
