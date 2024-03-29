import classnames from 'classnames';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { Row } from '../Row/Row';
import { UpdateForm } from './UpdateForm';
import style from './Detail.module.scss';

export const DetailOfActivity = () => {
  const router = useRouter();
  const { id } = router.query;

  const utils = trpc.useContext();

  const { data: activityData } = trpc.activities.read.useQuery(
    {
      id: Number(id),
    },
    {
      enabled: id != null,
    },
  );

  const { data: countInDay } = trpc.activities.streakVerification.useQuery(
    {
      id: Number(id),
    },
    {
      enabled: id != null,
    },
  );

  const deleteActivity = trpc.activities.delete.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleDelete = (activityId: number) => {
    deleteActivity.mutate({ id: activityId });

    router.push('/');
  };

  const days = (timesDone?: number) => {
    if (!timesDone) {
      return 'dní';
    }

    if (timesDone === 1) {
      return 'den';
    }
    if (timesDone > 1 && timesDone < 5) {
      return 'dny';
    }

    return 'dní';
  };

  if (!activityData) {
    return null;
  }

  return (
    <Row flexCol fullWidth justifyCenter itemsCenter>
      <div className={style.detailBox}>
        <nav className={style.navigation}>
          <button
            onClick={() => router.push('/')}
            className={style.back}
            aria-label="Zpět na hlavní stránku."
          />
          <div
            className={classnames(style.headingBox, {
              [style.zero]: countInDay === 0,
            })}
          >
            <h1 className={style.activity}>{activityData.name}</h1>
            <UpdateForm activity={activityData} />
          </div>
          <button
            onClick={() => handleDelete(activityData.id)}
            className={style.delete}
            aria-label={`Smazat aktivitu ${activityData.name}.`}
          />
        </nav>
        <div className={style.container}>
          <div className={style.counter}>
            <p className={style.number}>{countInDay}</p>
          </div>
          <p className={style.streekDays}>{days(countInDay)}</p>
        </div>
      </div>
    </Row>
  );
};
