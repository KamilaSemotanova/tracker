import { useState } from 'react';
import { Activity } from '@prisma/client';

import { trpc } from '../../utils/trpc';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import style from './UpdateForm.module.scss';

type UpdateFormProps = {
  activity: Activity;
};

export const UpdateForm: React.FC<UpdateFormProps> = ({ activity }) => {
  const [currentAmount, setCurrentAmount] = useState(0);

  const utils = trpc.useContext();

  const createActivityRecord = trpc.activityRecord.create.useMutation({
    onSuccess: () => {
      utils.activityRecord.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createActivityRecord.mutate({
      activityId: activity.id,
      addedAmount: currentAmount,
    });

    setCurrentAmount(0);
  };

  return (
    <section className={style.updateBox}>
      <div>
        CÍL
        <div className={style.amountBox}>
          <p>{activity.amount}</p>
          <span>{activity.unit}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="HOTOVO"
            name="timesDone"
            type="number"
            className="light"
            onChange={(e) => setCurrentAmount(Number(e.target.value))}
          />
          <p>{activity.unit}</p>
        </div>
        <Button
          type="submit"
          aria-label={`Dokončit aktivitu ${activity.name}.`}
          className={style.done}
        >
          Přidat
        </Button>
      </form>
      <div>
        ZBÝVÁ
        <div className={style.amountBox}>
          <p>{activity.amount - currentAmount}</p>
          <span>{activity.unit}</span>
        </div>
      </div>
    </section>
  );
};
