import { useState } from 'react';
import { AnimatePresence, Reorder } from 'framer-motion';

// --- Interfaces ---
import { IUnfollower } from '@interfaces/IUnfollower';

// --- Styles ---
import styles from './index.module.scss';
import { FaUsers, FaUsersSlash } from 'react-icons/fa';

// --- Components ---
import UnfollowerComponent from '../Unfollower';

// --- Animations ---
import slideFade from '@animations/slideFade';
import { IView } from '@interfaces/IView';

export default function UnfollowersListComponent({
	unfollowers,
	whitelist,
	handleUnfollowUser,
	handleAddUserToWhitelist,
	handleRemoveUserFromWhitelist,
}: {
	unfollowers: IUnfollower[];
	whitelist: string[];
	handleUnfollowUser: any;
	handleAddUserToWhitelist: any;
	handleRemoveUserFromWhitelist: any;
}): JSX.Element {
	const [view, setView] = useState<IView>(IView.UNFOLLOWERS);
	const [users, setUsers] = useState(unfollowers);

	const handleChangeView = () =>
		setView(view === IView.UNFOLLOWERS ? IView.WHITELIST : IView.UNFOLLOWERS);

	return (
		<div className={styles.container}>
			<header>
				<span className={styles.count_result}>
					<strong>{users.length}</strong> don&apos;t follow you back
				</span>
				<div className={styles.actions}>
					<button
						className={`button ${styles.whitelist}`}
						onClick={() => handleChangeView()}
					>
						<FaUsers />
						{view === IView.UNFOLLOWERS ? 'Whitelist' : 'Unfollowers'}
					</button>
					<button className={`button ${styles.unfollow_all}`}>
						<FaUsersSlash />
						Unfollow All
					</button>
				</div>
			</header>
			<Reorder.Group className={styles.list} values={users} onReorder={setUsers}>
				<AnimatePresence>
					{unfollowers.length ? (
						unfollowers
							.filter(
								({ login }) =>
									(view === IView.WHITELIST && whitelist.includes(login)) ||
									(view === IView.UNFOLLOWERS && !whitelist.includes(login))
							)
							.map((unfollower, index) => (
								<Reorder.Item
									value={unfollower.login}
									key={unfollower.login}
									variants={slideFade(index * 0.1)}
									initial="initial"
									animate="animate"
									exit="exit"
								>
									<UnfollowerComponent
										unfollower={unfollower}
										view={view}
										handleUnfollowUser={handleUnfollowUser}
										handleAddUserToWhitelist={handleAddUserToWhitelist}
										handleRemoveUserFromWhitelist={handleRemoveUserFromWhitelist}
									/>
								</Reorder.Item>
							))
					) : (
						<span className={styles.data_feedback}>Everything is OK 😉</span>
					)}
				</AnimatePresence>
			</Reorder.Group>
		</div>
	);
}
