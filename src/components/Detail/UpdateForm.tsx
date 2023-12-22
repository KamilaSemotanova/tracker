import { trpc } from '../../utils/trpc';
import style from './UpdateForm.module.scss';

type UpdateFormProps = {
  activity: {
    name: string;
    amount: number;
    unit: string;
    timesDone: number;
    id: number;
  };
};

export const UpdateForm: React.FC<UpdateFormProps> = ({ activity }) => {
  const utils = trpc.useContext();
  const updateDoneCounter = trpc.activities.updateDoneCounter.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleActivityClick = ({
    activityId,
    times,
  }: {
    activityId: number;
    times: number;
  }) => {
    updateDoneCounter.mutate({ id: activityId, timesDone: times + 1 });
  };

  return (
    <section className={style.updateBox}>
      Cíl
      <div className={style.amountBox}>
        <p>{activity.amount}</p>
        <span>{activity.unit}</span>
      </div>
      <button
        className={style.done}
        aria-label={`Dokončit aktivitu ${activity.name}.`}
        onClick={() => {
          handleActivityClick({
            activityId: activity.id,
            times: activity.timesDone,
          });
        }}
      />
    </section>
  );
};
