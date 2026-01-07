import { useLocation, useNavigate } from "react-router-dom";
import { SignUp, ConfirmSignUp } from "../components/signUp.jsx";
import { SignIn, ForgotPassword } from "../components/signIn.jsx";

const Auth = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const mode = query.get("mode"); 
    const payload = location.state?.payload || "";
    const email = location.state?.email || "";
    const fromSignIn = location.state?.fromSignIn || false;

    switch (mode) {
        case "signin":
            return <SignIn email={email}/>;
        case "signup":
            return <SignUp />;
        case "confirm":
            if (!payload) {navigate("/auth?mode=signup", { replace: true }); return null;}
            return <ConfirmSignUp payload={payload}/>;
        case "forgot":
            if (!fromSignIn) {
                navigate("/auth?mode=signin", { replace: true });
                return null;
            }
            return <ForgotPassword email={email} />;
        default:
            return <SignIn />;
    }

};

export default Auth;
