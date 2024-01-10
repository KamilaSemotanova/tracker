import { useRef, useState } from 'react';
import { Activity } from '@prisma/client';

import { trpc } from '../../utils/trpc';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import style from './UpdateForm.module.scss';

type ActivityRecordFormData = {
  currentAmount: { value: number };
} & HTMLFormElement;

type UpdateFormProps = {
  activity: Activity;
};

export const UpdateForm: React.FC<UpdateFormProps> = ({ activity }) => {
  const [warningMessage, setWarningMessage] = useState('');

  const formRef = useRef<ActivityRecordFormData>(null);
  const utils = trpc.useContext();

  const getActivityStreak = trpc.activityRecord.streakVerification.useQuery({
    activityId: activity.id,
  });

  console.log(getActivityStreak.data);

  const createActivityRecord = trpc.activityRecord.create.useMutation({
    onSuccess: () => {
      utils.activityRecord.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }

    const { value } = formRef.current.currentAmount;

    if (!value) {
      return;
    }

    const currentAmountValue = Number(value);

    if (currentAmountValue < 0) {
      setWarningMessage('Nelze odečíst z cíle');

      return;
    }

    createActivityRecord.mutate({
      activityId: activity.id,
      addedAmount: currentAmountValue,
    });

    formRef.current.reset();
    setWarningMessage('');
  };

  return (
    <section className={style.updateBox}>
      {/* <div className={style.infoBox}>
        Zbývá:
        <p>{activity.amount - 1}</p>
        <p>z</p>
        <p>{activity.amount}</p>
        <p>{activity.unit}</p>
      </div> */}
      <form ref={formRef} onSubmit={handleSubmit} className={style.form}>
        <div className={style.inputField}>
          <TextField name="currentAmount" label="Přidat" type="number" />
          <div className={style.unit}>{activity.unit}</div>
        </div>
        <Button
          type="submit"
          aria-label={`Přidat hotové množství aktivitě ${activity.name}.`}
          className={style.done}
        >
          Přidat
        </Button>
      </form>

      <p className={style.warningBox}>{warningMessage}</p>
    </section>
  );
};
