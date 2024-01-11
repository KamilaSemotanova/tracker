import { useRef, useState } from 'react';
import { Activity } from '@prisma/client';
import classnames from 'classnames';

import { trpc } from '../../utils/trpc';
import style from './UpdateForm.module.scss';

type ActivityRecordFormData = {
  currentAmount: { value: number };
} & HTMLFormElement;

type UpdateFormProps = {
  activity: Activity;
};

export const UpdateForm: React.FC<UpdateFormProps> = ({ activity }) => {
  const [warningMessage, setWarningMessage] = useState('');
  const [currentAmount, setCurrentAmount] = useState(0);

  const formRef = useRef<ActivityRecordFormData>(null);
  const utils = trpc.useContext();

  const createActivityRecord = trpc.activityRecord.create.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentAmount) {
      return;
    }

    if (currentAmount < 0) {
      setWarningMessage('Nelze odečíst z cíle');

      return;
    }

    createActivityRecord.mutate({
      activityId: activity.id,
      addedAmount: currentAmount,
    });

    setCurrentAmount(0);
    setWarningMessage('');
  };

  return (
    <section className={style.updateBox}>
      <form ref={formRef} onSubmit={handleSubmit} className={style.form}>
        <input
          className={style.input}
          type="number"
          aria-label={`Vložit počet ${activity.unit} k ${activity.name}`}
          onChange={(e) => setCurrentAmount(Number(e.target.value))}
        />
        <div className={style.infoBox}>
          <p className={style.text}>
            z {activity.amount} {activity.unit}
          </p>
        </div>
        <button
          type="submit"
          aria-label={`Přidat hotové množství aktivitě ${activity.name}.`}
          className={style.done}
        >
          <div className={style.submitRecord} />
        </button>
      </form>
      <p
        className={classnames(style.warningBox, {
          [style.hidden]: warningMessage === '',
        })}
      >
        {warningMessage}
      </p>
    </section>
  );
};
