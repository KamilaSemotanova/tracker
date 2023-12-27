import { FormEvent, useState } from 'react';
import classnames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { Button } from '../Button/Button';
import { Row } from '../Row/Row';
import { TextField } from '../TextField/TextField';
import { UserBox } from './UserBox';
import addActivity from './img/plus.png';
import style from './Dashboard.module.scss';

export const Dashboard = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [newAmount, setNewAmount] = useState(0);
  const [newUnit, setNewUnit] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const { data: activities } = trpc.activities.list.useQuery();
  const utils = trpc.useContext();
  const addNewActivity = trpc.activities.create.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newActivity === '' || newAmount === 0 || newUnit === '') {
      setError('Vyplňte všechna pole');

      return;
    }

    addNewActivity.mutate({
      name: newActivity,
      amount: newAmount,
      unit: newUnit,
    });

    setFormVisible(false);
    setNewActivity('');
    setNewAmount(0);
    setNewUnit('');
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
              <div className={style.nameBox}>
                <li className={style.nameOfActivity}>{name}</li>
              </div>
            </div>
          ))}
        </ul>
        {!formVisible && (
          <button
            className={style.revealForm}
            onClick={() => setFormVisible(true)}
            type="button"
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
            <Row fullWidth justifyStart flexCol>
              <TextField
                type="text"
                label="aktivita"
                placeholder="běhání"
                className={style.input}
                onChange={(e) => setNewActivity(e.target.value)}
                autoFocus
              />
              <div className={style.inputWrapper}>
                <TextField
                  type="number"
                  label="množství"
                  placeholder="30"
                  className={style.input}
                  onChange={(e) => setNewAmount(+e.target.value)}
                />
                <TextField
                  type="text"
                  label="jednotka"
                  placeholder="minut"
                  className={style.input}
                  onChange={(e) => setNewUnit(e.target.value)}
                />
              </div>
            </Row>
            <p className={style.error}>{error}</p>
            <div className={style.buttonBox}>
              <Button type="submit" className={style.button}>
                přidat
              </Button>
              <Button
                type="button"
                className={style.button}
                onClick={() => setFormVisible(false)}
              >
                zrušit
              </Button>
            </div>
          </form>
        )}
      </div>
    </Row>
  );
};
