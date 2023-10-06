import { ChangeEvent, FormEvent, useState } from 'react';

import { Row } from '../Row/Row';
import style from './Dashboard.module.scss';

type ActivityType = {
  activity: string;
  id: number;
  timesDone: number;
};

const activities: ActivityType[] = [
  { activity: 'running', id: 1, timesDone: 3 },
  { activity: 'swimming', id: 2, timesDone: 2 },
  { activity: 'not smoking', id: 3, timesDone: 21 },
];

export const Dashboard = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [currentActivities, setCurrentActivities] = useState([...activities]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewActivity(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newObj = { activity: newActivity, id: 4, timesDone: 0 };
    const newArray = activities.concat([newObj]);

    setCurrentActivities(newArray);
    setFormVisible(false);
  };

  const handleActivityClick = (updatedActivity: string) => {
    const addToCounter = currentActivities.map((currentActivity) => {
      if (currentActivity.activity === updatedActivity) {
        return { ...currentActivity, timesDone: currentActivity.timesDone + 1 };
      }

      return currentActivity;
    });

    setCurrentActivities(addToCounter);
  };

  return (
    <Row flexCol fullWidth justifyCenter itemsCenter>
      <div className={style.box}>
        <h1 className={style.title}>Všechny aktivity</h1>
        <ul className={style.activities}>
          {currentActivities.map(({ timesDone, id, activity }) => (
            <div
              className={timesDone === 0 ? style.activityZero : style.activity}
              key={id}
            >
              <span className={style.timesDone}>{timesDone}</span>
              <li>{activity}</li>

              <button
                className={style.btnDone}
                type="button"
                onClick={() => {
                  handleActivityClick(activity);
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
