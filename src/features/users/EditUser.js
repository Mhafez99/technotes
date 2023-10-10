
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectUserById, useGetUsersQuery} from './userApiSlice';
import EditUserForm from './EditUserForm';
import {PulseLoader} from 'react-spinners';

const EditUser = () => {
    const {id} = useParams();

    // const user = useSelector(state => selectUserById(state, id));

    const {user} = useGetUsersQuery("usersList", {
        selectFromResult: ({data}) => ({
            user: data?.entities[id]
        })
    });

    if (!user) return <PulseLoader color={"#fff"} />;

    const content = <EditUserForm user={user} />;

    return content;
};

export default EditUser;