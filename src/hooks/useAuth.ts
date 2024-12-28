import { useState, useEffect } from "react";
import { ethers, Wallet, HDNodeWallet, Mnemonic } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
}

interface AuthState {
  username: string;
  loginKey: string;
  mnemonic: string;
  publicKey: string;
  message: string;
  allUsernames: string[];
  isUsernameAvailable: boolean | null;
  hasInvalidChars: boolean;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserID, setUserName } = useAuthStore();

  const [authState, setAuthState] = useState<AuthState>({
    username: "",
    loginKey: "",
    mnemonic: "",
    publicKey: "",
    message: "",
    allUsernames: [],
    isUsernameAvailable: null,
    hasInvalidChars: false,
  });

  // Fetch usernames for signup validation
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/usernames`
        );
        setAuthState(prev => ({
          ...prev,
          allUsernames: response.data.usernames || []
        }));
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };

    fetchUsernames();
  }, []);

  // Check for existing auth on login page load
  useEffect(() => {
    const storedPublicKey = localStorage.getItem("publicKey");
    if (storedPublicKey) {
      setIsAuthenticated(true);
      navigate("/");
    }
  }, [navigate, setIsAuthenticated]);

  const validateUsername = (input: string): void => {
    const invalidChars = /\s/;
    const hasInvalid = invalidChars.test(input);

    setAuthState(prev => ({
      ...prev,
      hasInvalidChars: hasInvalid,
      isUsernameAvailable: hasInvalid ? null : !prev.allUsernames.includes(input),
      username: input
    }));
  };

  const isValidPrivateKey = (key: string) => /^0x[a-fA-F0-9]{64}$/.test(key);

  const handleSignup = async (): Promise<void> => {
    const wallet = ethers.Wallet.createRandom();
    const generatedMnemonic = wallet.mnemonic ? wallet.mnemonic.phrase : "";
    const generatedPrivateKey = wallet.privateKey;
    const generatedPublicKey = wallet.address;

    localStorage.setItem("privateKey", generatedPrivateKey);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        publicKey: generatedPublicKey,
        username: authState.username,
      });

      setAuthState(prev => ({
        ...prev,
        mnemonic: generatedMnemonic,
        publicKey: generatedPublicKey,
        message: "Signup successful. Public key saved!"
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        message: "Error during signup: " + (error.response?.data?.message || "Unknown error")
      }));
    }
  };

  const handleLogin = async (): Promise<void> => {
    let wallet: HDNodeWallet | Wallet | undefined;
    
    try {
      try {
        const mnemonic = Mnemonic.fromPhrase(authState.loginKey);
        wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
      } catch {
        if (isValidPrivateKey(authState.loginKey)) {
          wallet = new Wallet(authState.loginKey);
        } else {
          throw new Error("Invalid mnemonic or private key.");
        }
      }

      if (!wallet) throw new Error("Wallet generation failed.");
      
      const storedPublicKey = wallet.address;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { publicKey: storedPublicKey }
      );

      if (response.status === 200) {
        const { token, username } = response.data;
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userID = decodedToken.id;

        localStorage.setItem("securaToken", token);
        localStorage.setItem("securaUserID", userID);
        localStorage.setItem("securaUserName", username);

        setIsAuthenticated(true);
        setUserID(userID);
        setUserName(username);
        navigate("/");
      } else {
        setAuthState(prev => ({
          ...prev,
          message: "Login failed: Invalid credentials."
        }));
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        message: "Error logging in: " + error.message
      }));
    }
  };

  const handleConfirm = (): void => {
    const savedPrivateKey = localStorage.getItem("privateKey");
    alert(
      `Mnemonic confirmed! Public key: ${authState.publicKey}\nPrivate key: ${savedPrivateKey}`
    );
    setIsAuthenticated(true);
  };

  const updateLoginKey = (value: string) => {
    setAuthState(prev => ({
      ...prev,
      loginKey: value
    }));
  };

  return {
    ...authState,
    validateUsername,
    handleSignup,
    handleLogin,
    handleConfirm,
    updateLoginKey,
  };
};