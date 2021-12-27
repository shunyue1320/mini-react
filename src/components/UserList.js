import React from 'react';
import { UserAPI } from '../utils';
import { Link } from '../react-router-dom';

function UserList(props) {
    const [users, setUsers] = React.useState([]);
    React.useEffect(() => {
        let users = UserAPI.list();
        setUsers(users);
    }, []);
    return (
        <ul>
            {
                users.map(user => (
                    <li key={user.id}>
                        <Link to={{ pathname: `/user/detail/${user.id}`, state: user }}>{user.username}</Link>
                    </li>
                ))
            }
        </ul>
    )
}
export default UserList;