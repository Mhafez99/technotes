import {useState, useEffect} from "react";
import {useDeleteUserMutation, useUpdateUserMutation} from "./userApiSlice";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {ROLES} from "../../config/roles";



const USER_REGEX = /^[A-Z]{3,20}$/i;
const PWD_REGEX = /^[A-Z0-9!@#$%]{4,12}$/i;

const EditUserForm = ({user}) => {

    const [updateUser, {
        isSuccess,
        isLoading,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delError
    }] = useDeleteUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);


    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }

    }, [isSuccess, isDelSuccess, navigate]);

    const onUsernameChange = e => setUsername(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);

    const onRolesChange = e => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setRoles(values);
    };

    const onActiveChange = () => setActive(prev => !prev);

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({id: user.id, username, password, roles, active});
        } else {
            await updateUser({id: user.id, username, roles, active});
        }
    };

    const onDeleteUserClicked = async () => {
        await deleteUser({id: user.id});
    };

    let canSave;
    if (password) {
        canSave = [roles.length, validPassword, validUsername].every(Boolean) && !isLoading;
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option key={role} value={role}>
                {role}
            </option>
        );
    });
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? "form__input--incomplete" : "";
    const validPwdClass = (password && !validPassword) ? "form__input--incomplete" : "";
    const validRolesClass = !Boolean(roles.length) ? "form__input--incomplete" : "";

    const errContent = (error?.data?.message || delError?.data?.message) ?? "";

    const content = (
        <>
            <p className={errClass}>{errContent}</p>
            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button className="icon-button" title="Save" onClick={onSaveUserClicked} disabled={!canSave}>
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button className="icon-button" title="Delete" onClick={onDeleteUserClicked}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">Username:<span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChange} />
                <label className="form__label" htmlFor="password">Password:<span className="nowrap">[empty = no change][4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="off"
                    value={password}
                    onChange={onPasswordChange} />
                <label className="form__label form__checkbox-container" htmlFor="user-active">ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChange} />
                </label>
                <label className="form__label" htmlFor="roles">ASSIGNED ROLES:</label>
                <select
                    className={`form__select ${validRolesClass}`}
                    id="roles"
                    name="roles"
                    value={roles}
                    multiple={true}
                    size="3"
                    onChange={onRolesChange}>
                    {options}
                </select>
            </form>
        </>
    );

    return content;
};

export default EditUserForm;