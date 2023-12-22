import { useState } from 'react';

import { trpc } from '../../utils/trpc';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
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
  const [currentAmount, setCurrentAmount] = useState(0);
  const utils = trpc.useContext();
  const updateDoneCounter = trpc.activities.updateDoneCounter.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateDoneCounter.mutate({
      id: activity.id,
      timesDone: activity.timesDone,
    });
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
            onChange={(e) => setCurrentAmount(+Number(e.target.value))}
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
