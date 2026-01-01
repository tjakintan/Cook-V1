import { useLocation, useNavigate } from "react-router-dom";
import { SignUp, ConfirmSignUp } from "../components/signUp.jsx";
import { SignIn, FallBack } from "../components/signIn.jsx";

const Auth = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const mode = query.get("mode"); 
    const payload = location.state?.payload || "";

    switch (mode) {
        case "signin":
            return <SignIn />;
        case "signup":
            return <SignUp />;
        case "confirm":
            if (!payload) {navigate("/auth?mode=signup", { replace: true }); return null;}
            return <ConfirmSignUp payload={payload}/>;
        case "fallback":
            return <FallBack />;
        default:
            return <SignIn />;
    }

};

export default Auth;
