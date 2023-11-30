import { ChangeEvent, FormEvent, useState } from 'react';
import classnames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Row } from '../Row/Row';
import { trpc } from '../../utils/trpc';
import addActivity from './img/plus.png';
import { UserBox } from './UserBox';
import style from './Dashboard.module.scss';

export const Dashboard = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');

  const { data: activities } = trpc.activities.list.useQuery();

  const router = useRouter();

  const utils = trpc.useContext();
  const addNewActivity = trpc.activities.create.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    newActivity !== '' && addNewActivity.mutate({ name: newActivity });

    setFormVisible(false);
    setNewActivity('');
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

  const handleDetailClick = (id: number) => {
    router.push(`/detail/${id}`);
  };

  return (
    <Row flexCol fullWidth justifyCenter itemsCenter>
      <UserBox />
      <div className={style.box}>
        <h1 className={style.title}>Všechny aktivity</h1>
        <ul className={style.activities}>
          {activities?.map(({ timesDone, id, name }) => (
            <div
              onClick={() => handleDetailClick(id)}
              className={classnames(style.activity, {
                [style.zero]: timesDone === 0,
                [style.more]: timesDone > 0,
              })}
              key={id}
            >
              <span
                className={style.timesDone}
                aria-description={`Aktivita ${name} byla dokončena ${timesDone}x.`}
              >
                {timesDone}
              </span>
              <li className={style.nameOfActivity}>{name}</li>
              <button
                className={classnames(style.buttonDone, {
                  [style.zero]: timesDone === 0,
                  [style.more]: timesDone > 0,
                })}
                aria-label={`Dokončena aktivita ${name}.`}
                type="button"
                onClick={() => {
                  handleActivityClick({ id, timesDone });
                }}
              />
            </div>
          ))}
        </ul>
        {!formVisible && (
          <button
            className={style.revealForm}
            onClick={() => setFormVisible(true)}
          >
            <Image
              src={addActivity}
              alt="Přidat novou aktivitu"
              className={style.addActivity}
            />
          </button>
        )}
        {formVisible && (
          <form className={style.form} onSubmit={handleSubmit}>
            <Row fullWidth justifyStart>
              <label htmlFor="activity">
                aktivita:
                <input
                  id="activity"
                  type="text"
                  placeholder="běhání"
                  className={style.input}
                  onChange={handleChange}
                  autoFocus
                />
              </label>
            </Row>
            <div className={style.buttonBox}>
              <button type="submit" className={style.button}>
                přidat
              </button>
              <button
                type="button"
                className={style.button}
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
