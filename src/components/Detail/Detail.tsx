import { useRouter } from 'next/router';
import classnames from 'classnames';

import { Row } from '../Row/Row';
import { trpc } from '../../utils/trpc';
import { StreekCounter } from './StrikeCounter';
import style from './Detail.module.scss';

export const DetailOfActivity = () => {
  const router = useRouter();
  const { id } = router.query;

  const activityData = trpc.activities.read.useQuery({ id: Number(id) }).data;

  return (
    activityData && (
      <Row flexCol fullWidth justifyCenter itemsCenter>
        <div className={style.box}>
          <h1
            className={classnames(style.activity, {
              [style.zero]: activityData.timesDone === 0,
            })}
          >
            {activityData?.name}
          </h1>
          <StreekCounter dayStreek={activityData.timesDone} />
          <div>calendar</div>
          <button>delete</button>
          <button onClick={() => router.push('/')}>Dashboard</button>
        </div>
      </Row>
    )
  );
};
