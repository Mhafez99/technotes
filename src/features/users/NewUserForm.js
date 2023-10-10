import {useState, useEffect} from "react";
import {useAddNewUserMutation} from './userApiSlice';
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {ROLES} from '../../config/roles';

const USER_REGEX = /^[A-Z]{3,20}$/i;
const PWD_REGEX = /^[A-Z0-9!@#$%]{4,12}$/i;

const NewUserForm = () => {

    const [addNewUser, {
        isSuccess,
        isLoading,
        isError,
        error
    }] = useAddNewUserMutation();

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(["Employee"]);


    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUsername('');
            setPassword('');
            setRoles([]);
            navigate('/dash/users');
        }
    }, [isSuccess, navigate]);

    const onUsernameChange = e => setUsername(e.target.value);
    const onPasswordChange = e => setPassword(e.target.value);

    const onRolesChange = e => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setRoles(values);
    };

    const canSave = [roles.length, validPassword, validUsername].every(Boolean) && !isLoading;

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewUser({username, password, roles});
        }
    };

    const options = Object.values(ROLES).map(role => {
        return (
            <option key={role} value={role}>
                {role}
            </option>
        );
    });
    const errClass = isError ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? "form__input--incomplete" : "";
    const validPwdClass = !validPassword ? "form__input--incomplete" : "";
    const validRolesClass = !Boolean(roles.length) ? "form__input--incomplete" : "";

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button className="icon-button" title="save" disabled={!canSave}>
                            <FontAwesomeIcon icon={faSave} />
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
                <label className="form__label" htmlFor="password">Password:<span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="off"
                    value={password}
                    onChange={onPasswordChange} />
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

export default NewUserForm;