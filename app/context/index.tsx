import {
  useReducer,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { User } from "../models/user";
import { Appointment } from "../models/appointments";

type AppState = {
  user?: User;
  onboarding: boolean;
  setUser: (user: User) => void;
  setOnboarding: (value: boolean) => void;
};

// initial state
const initialState: AppState = {
  user: null,
  onboarding: false,
  setUser: (user) => {},
  setOnboarding: (value) => {},
};

// create context
const AppContext = createContext(initialState);

export const useAppContext = () => useContext(AppContext);

// context provider
const Provider = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [onboarding, setOnboarding] = useState(false);

  // router
  const router = useRouter();

  useEffect(() => {
    //console.log("Context. State: ", user, onboarding);
    if (user == null) {
      setUser(JSON.parse(window.localStorage.getItem("user")));
    }
  }, []);

  axios.interceptors.response.use(
    function (response) {
      // any status code that lie within the range of 2XX cause this function
      // to trigger
      return response;
    },
    function (error) {
      // any status codes that falls outside the range of 2xx cause this function
      // to trigger
      let res = error.response;
      if (
        res &&
        res.status === 401 &&
        res.config &&
        !res.config.__isRetryRequest
      ) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              console.log("/401 error > logout");
              setUser(null);
              window.localStorage.removeItem("user");
              router.push("/login");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERR", err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      // console.log("CSRF", data);
      axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
    };
    getCsrfToken();
  }, []);

  const value = {
    user,
    onboarding,
    setUser,
    setOnboarding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default Provider;
