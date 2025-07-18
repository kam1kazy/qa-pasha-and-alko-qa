import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import styles from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.icon} title="Главная">
          <Image
            src="./images/icons/menu/home.svg"
            alt="icon"
            width={32}
            height={32}
          />
        </Link>
        <Link href="/study" className={styles.icon} title="Задачи">
          <Image
            src="./images/icons/menu/graduation.svg"
            alt="icon"
            width={40}
            height={40}
          />
        </Link>
        <Link href="/profile" className={styles.icon} title="Профиль">
          <Image
            src="./images/icons/menu/profile-circle.svg"
            alt="icon"
            width={36}
            height={36}
          />
        </Link>
        <Link href="/admin" className={styles.icon} title="Админка">
          <Image
            src="./images/icons/menu/code-tag.svg"
            alt="icon"
            width={34}
            height={34}
          />
        </Link>
        <nav className={styles.nav}>
          <Link href="/admin/courses" className={styles.icon} title="Курсы">
            <Image
              src="./images/icons/menu/kanban.svg"
              alt="icon"
              width={29}
              height={29}
            />
          </Link>
          <Link href="/admin/students" className={styles.icon} title="Студенты">
            <Image
              src="./images/icons/menu/members.svg"
              alt="icon"
              width={45}
              height={45}
            />
          </Link>
        </nav>
      </nav>
    </aside>
  );
};

export default Sidebar;
