import { ChangeEvent, FormEvent, useState } from 'react';

import { Row } from '../Row/Row';
import { trpc } from '../../utils/trpc';
import style from './Dashboard.module.scss';

export const Dashboard = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');

  const { data: activities } = trpc.activities.list.useQuery();

  const utils = trpc.useContext();
  const addNewActivity = trpc.activities.create.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addNewActivity.mutate({ name: newActivity });

    setFormVisible(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewActivity(e.target.value);
  };

  const updateDoneCounter = trpc.activities.updateDoneCounter.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleActivityClick = ({
    id,
    timesDone,
  }: {
    id: number;
    timesDone: number;
  }) => {
    updateDoneCounter.mutate({ id, timesDone: timesDone + 1 });
  };

  return (
    <Row flexCol fullWidth justifyCenter itemsCenter>
      <div className={style.box}>
        <h1 className={style.title}>Všechny aktivity</h1>
        <ul className={style.activities}>
          {activities?.map(({ timesDone, id, name }) => (
            <div
              className={timesDone === 0 ? style.activityZero : style.activity}
              key={id}
            >
              <span className={style.timesDone}>{timesDone}</span>
              <li>{name}</li>

              <button
                className={style.btnDone}
                type="button"
                onClick={() => {
                  handleActivityClick({ id, timesDone });
                }}
              >
                ✔️
              </button>
            </div>
          ))}
        </ul>
        {!formVisible && (
          <button
            className={style.revealForm}
            onClick={() => setFormVisible(true)}
          >
            +
          </button>
        )}
        {formVisible && (
          <form className={style.form} onSubmit={handleSubmit}>
            <label htmlFor="activity">
              aktivita
              <input
                id="activityName"
                type="text"
                className={style.input}
                onChange={handleChange}
              />
            </label>
            <div className={style.btnBox}>
              <button type="submit" className={style.btn}>
                přidat
              </button>
              <button
                type="button"
                className={style.btn}
                onClick={() => setFormVisible(false)}
              >
                zrušit
              </button>
            </div>
          </form>
        )}
      </div>
    </Row>
  );
};
