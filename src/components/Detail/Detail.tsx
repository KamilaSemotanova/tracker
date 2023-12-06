import { useRouter } from 'next/router';
import classnames from 'classnames';

import { Row } from '../Row/Row';
import { trpc } from '../../utils/trpc';
import style from './Detail.module.scss';

export const DetailOfActivity = () => {
  const router = useRouter();
  const { id } = router.query;

  const utils = trpc.useContext();

  const { data: activityData } = trpc.activities.read.useQuery({
    id: Number(id),
  });

  const deleteActivity = trpc.activities.delete.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleDelete = (activityId: number) => {
    deleteActivity.mutate({ id: activityId });

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

  const days = (timesDone: number) => {
    if (timesDone === 1) {
      return 'den';
    }
    if (timesDone > 1 && timesDone < 5) {
      return 'dny';
    }

    return 'dní';
  };

  return (
    activityData && (
      <Row flexCol fullWidth justifyCenter itemsCenter>
        <nav className={style.navigation}>
          <button
            onClick={() => router.push('/')}
            className={style.back}
            aria-label="Zpět na hlavní stránku."
          />
          <h1
            className={classnames(style.activity, {
              [style.zero]: activityData.timesDone === 0,
            })}
          >
            {activityData.name}
          </h1>
          <button
            onClick={() => handleDelete(activityData.id)}
            className={style.delete}
            aria-label={`Smazat aktivitu ${activityData.name}.`}
          />
        </nav>
        <button
          className={style.done}
          aria-label={`Dokončit aktivitu ${activityData.name}.`}
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
          <p className={style.streekDays}>{days(activityData.timesDone)}</p>
        </div>
        {/* <div>calendar</div> */}
      </Row>
    )
  );
};
