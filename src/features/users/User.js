import {useSelector} from "react-redux/es/hooks/useSelector";
import {useNavigate} from "react-router-dom";
import {selectUserById} from "./userApiSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";


import {useGetUsersQuery} from "./userApiSlice";
import {memo} from "react";


const User = ({userId}) => {
    // const user = useSelector(state => selectUserById(state, userId));

    const {user} = useGetUsersQuery("usersList", {
        selectFromResult: ({data}) => ({
            user: data?.entities[userId]
        })
    });

    const navigate = useNavigate();

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`);
        const userRolesString = user.roles.toString().replaceAll(',', ', ');
        const cellStatus = user.active ? '' : 'table__cell--inactive';

        return (
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button className="icon-button table__button" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        );
    } else return null;
};

const memorizedUser = memo(User)

export default memorizedUser;