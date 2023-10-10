import {useEffect, useRef, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import {useRefreshMutation} from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "./authSlice";
import {PulseLoader} from "react-spinners";


const PersistLogin = () => {

    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);

    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false);



    const [refresh, {
        isUninitialized,
        isError,
        isLoading,
        isSuccess,
        error,
    }] = useRefreshMutation();

    const errClass = isError ? "errmsg" : "offscreen";

    useEffect(() => {
        // Strick mode happen in development mode only
        if (effectRan.current === true || process.env.NODE_ENV !== 'production') {
            const verifyRefreshToken = async () => {
                console.log("Verifying refresh token");
                try {
                    await refresh();
                    setTrueSuccess(true);
                } catch (err) {
                    console.log(err);
                }
            };
            if (!token && persist) verifyRefreshToken();
        };
        return () => effectRan.current = true;
    }, []);


    let content;
    if (!persist) { // persist: no
        content = <Outlet />;
    } else if (isLoading) { // persist: yes, token: no
        console.log("Loading");
        content = <PulseLoader color={"#fff"} />;
    } else if (isError) { // persist: yes, token: no
        console.log("error");
        content = (
            <p className={errClass}>
                {`${error.data?.message} - `}
                <Link to="/login"> Please Login again</Link>
            </p>
        );
    } else if (isSuccess && trueSuccess) { // persist: yes, token: yes
        console.log("Success");
        content = <Outlet />;
    } else if (token && isUninitialized) { // persist: yes, token: yes
        console.log("Token and Uninitialized");
        console.log(isUninitialized);
        content = <Outlet />;
    }


    return content;
};

export default PersistLogin;;