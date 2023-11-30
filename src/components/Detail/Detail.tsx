import { Row } from '../Row/Row';
import style from './Detail.module.scss';

export const Detail = ({ params }: { params: { id: number } }) => (
  <Row flexCol fullWidth justifyCenter itemsCenter>
    <div className={style.box}>
      <h1 className={style.title}>{params.id}</h1>
      <div>strike counter</div>
      <div>calendar</div>
    </div>
  </Row>
);
