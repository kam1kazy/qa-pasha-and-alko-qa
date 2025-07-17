import Image from 'next/image';
import React from 'react';

import styles from './profile.module.scss';

const ProfilePage: React.FC = () => {
  return (
    <div className={styles.profile_page}>
      <div className={styles.top_block}>
        <div className={styles.avatar_section}>
          <div className={styles.avatar_placeholder}>
            <span
              role="img"
              aria-label="avatar"
              className={styles.avatar_emoji}
            >
              <Image
                src="./images/alien.svg"
                alt="avatar"
                width={100}
                height={100}
              />
            </span>
          </div>
          <button className={styles.avatar_btn}>Добавить/Изменить</button>
        </div>
        <div className={styles.stats_section}>
          <div className={styles.progress_card}>
            <div className={styles.progress_header}>
              <span>Project Progress</span>
            </div>
            <div className={styles.progress_circle}>
              <span className={styles.progress_percent}>80%</span>
              <span className={styles.progress_label}>Project Completed</span>
            </div>
            <div className={styles.progress_stats}>
              <div>
                <span className={styles.stat_num}>32</span>
                <span className={styles.stat_label}>Tasks done</span>
              </div>
              <div>
                <span className={styles.stat_num}>12</span>
                <span className={styles.stat_label}>Tasks done</span>
              </div>
              <div>
                <span className={styles.stat_num}>16</span>
                <span className={styles.stat_label}>Tasks done</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form className={styles.profile_form}>
        <div className={styles.form_row}>
          <label>Имя</label>
          <input
            type="text"
            placeholder="Введите имя"
            className={styles.profile_input}
          />
        </div>
        <div className={styles.form_row}>
          <label>Почта</label>
          <input
            type="email"
            placeholder="Введите почту"
            className={styles.profile_input}
          />
        </div>
        <div className={styles.form_row}>
          <label>Дата рождения</label>
          <input type="date" className={styles.profile_input} />
        </div>
        <div className={styles.form_row}>
          <label>Пол</label>
          <select className={styles.profile_input}>
            <option>Мужской</option>
            <option>Женский</option>
          </select>
        </div>
        <div className={styles.form_row}>
          <label>Род деятельности</label>
          <select className={styles.profile_input}>
            <option>Работаю в IT</option>
            <option>Работаю не в IT</option>
            <option>Не работаю</option>
          </select>
        </div>
        <div className={styles.form_row}>
          <label>На сколько силен в IT?</label>
          <select className={styles.profile_input}>
            <option>Много понимаю и знаю</option>
            <option>Средний уровень</option>
            <option>Новичок</option>
          </select>
        </div>
        <div className={styles.form_row}>
          <button type="button" className={styles.password_btn}>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
