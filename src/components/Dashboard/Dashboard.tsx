import { FormEvent, useRef, useState } from 'react';
import classnames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { trpc } from '../../utils/trpc';
import { Button } from '../Button/Button';
import { Row } from '../Row/Row';
import { TextField } from '../TextField/TextField';
import { UserBox } from './UserBox';
import addActivity from './img/plus.png';
import { formatDate } from '../../../server/utils/date';
import style from './Dashboard.module.scss';

type ActivityFormData = {
  name: { value: string };
  amount: { value: number };
  unit: { value: string };
} & HTMLFormElement;

export const Dashboard = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState('');
  const [recordFormVisible, setRecordFormVisible] = useState<number>();
  const [record, setRecord] = useState<number>();

  const router = useRouter();
  const formRef = useRef<ActivityFormData>(null);

  const { data: activities } = trpc.activities.list.useQuery();
  const utils = trpc.useContext();
  const addNewActivity = trpc.activities.create.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const { data: countInDay } =
    trpc.activities.streakVerificationInDate.useQuery({
      date: formatDate(new Date()),
    });

  const createActivityRecord = trpc.activityRecord.create.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });

  const handleCreateRecord = (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    e.preventDefault();

    if (!record) {
      return;
    }

    if (record < 0) {
      return;
    }

    createActivityRecord.mutate({
      activityId: id,
      addedAmount: record,
    });

    setRecordFormVisible(undefined);
    setRecord(undefined);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      return;
    }

    const { name, amount, unit } = formRef.current;

    const nameValue = name.value.trim();
    const amountValue = Number(amount.value);
    const unitValue = unit.value.trim();

    if (!nameValue || !amountValue || !unitValue) {
      setError('Vyplňte všechna pole');

      return;
    }

    addNewActivity.mutate({
      name: nameValue,
      amount: amountValue,
      unit: unitValue,
    });

    formRef.current.reset();
    setFormVisible(false);
    setError('');
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
          {activities?.map(({ id, name }) => (
            <div
              className={classnames(style.activity, {
                [style.completed]: countInDay?.[id]?.completed,
              })}
              key={id}
            >
              <div
                className={style.summaryInfo}
                onClick={() => handleDetailClick(id)}
              >
                <div className={style.nameBox}>
                  <li className={style.nameOfActivity}>{name}</li>
                </div>
              </div>
              {recordFormVisible === id && (
                <form
                  className={style.recordForm}
                  onSubmit={(e) => handleCreateRecord(e, id)}
                >
                  <input
                    className={style.recordInput}
                    type="number"
                    onChange={(e) => setRecord(e.target.valueAsNumber)}
                  />
                  <button
                    type="submit"
                    aria-label={`Přidat hotové množství aktivitě ${name}.`}
                    className={style.submitRecordButton}
                  >
                    <div className={style.submitRecord} />
                  </button>
                </form>
              )}
              <button
                className={style.plus}
                onClick={() => {
                  recordFormVisible
                    ? setRecordFormVisible(undefined)
                    : setRecordFormVisible(id);
                }}
                aria-label={`Otevřít formulář pro přidání aktivity ${name}.`}
              >
                <div
                  className={classnames(style.addRecord, {
                    [style.closeForm]: recordFormVisible === id,
                  })}
                />
              </button>
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
          <form ref={formRef} className={style.form} onSubmit={handleSubmit}>
            <Row fullWidth justifyStart flexCol>
              <TextField
                name="name"
                type="text"
                label="aktivita"
                placeholder="běhání, čtení, ..."
                autoFocus
              />
              <div className={style.inputWrapper}>
                <div className={style.textField}>
                  <TextField
                    name="amount"
                    type="number"
                    label="množství"
                    placeholder="30, 50, ..."
                  />
                </div>
                <div className={style.textField}>
                  <TextField
                    name="unit"
                    type="text"
                    label="jednotka"
                    placeholder="minut, stránek, ..."
                  />
                </div>
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
