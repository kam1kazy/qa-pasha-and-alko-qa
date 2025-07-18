import React from 'react';

import styles from './admin.module.scss';

const ProfilePage: React.FC = () => {
  return (
    <div>
      <div className={styles.admin_content}>
        <div className={styles.admin_page}>
          Админ панель <br /> Статистика по актиности стунеднтов что-то типа
          аналитики в dashboard
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
