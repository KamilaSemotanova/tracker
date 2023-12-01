import { useRouter } from 'next/router';
import classnames from 'classnames';

import { Row } from '../Row/Row';
import { trpc } from '../../utils/trpc';
import style from './Detail.module.scss';

export const DetailOfActivity = () => {
  const router = useRouter();
  const { id } = router.query;

  const utils = trpc.useContext();

  const activityData = trpc.activities.read.useQuery({ id: Number(id) }).data;

  const deleteActivity = trpc.activities.delete.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleDelete = () => {
    if (activityData) {
      deleteActivity.mutate({ id: activityData.id });
    }

    router.push('/');
  };

  const updateDoneCounter = trpc.activities.updateDoneCounter.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleActivityClick = ({
    activityId,
    timesDone,
  }: {
    activityId: number;
    timesDone: number;
  }) => {
    updateDoneCounter.mutate({ id: activityId, timesDone: timesDone + 1 });
  };

  return (
    activityData && (
      <Row flexCol fullWidth justifyCenter itemsCenter>
        <nav className={style.navigation}>
          <button onClick={() => router.push('/')} className={style.back} />
          <h1
            className={classnames(style.activity, {
              [style.zero]: activityData.timesDone === 0,
            })}
          >
            {activityData.name}
          </h1>
          <button onClick={handleDelete} className={style.delete} />
        </nav>
        <button
          className={style.done}
          aria-label={`Dokončena aktivita ${activityData.name}.`}
          type="button"
          onClick={() => {
            handleActivityClick({
              activityId: activityData.id,
              timesDone: activityData.timesDone,
            });
          }}
        />
        <div className={style.container}>
          <div className={style.counter}>
            <p className={style.number}>{activityData.timesDone}</p>
          </div>
          <p className={style.streekDays}>dní</p>
        </div>
        {/* <div>calendar</div> */}
      </Row>
    )
  );
};
