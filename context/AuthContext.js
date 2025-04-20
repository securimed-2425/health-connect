import React, {
  useRef,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import 'react-native-get-random-values';
import 'gun/lib/mobile';
import Gun from 'gun';
import SEA from 'gun/sea';
import 'react-native-webview-crypto';
import 'react-native-get-random-values';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import asyncStore from 'gun/lib/ras.js';

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
  const db = (gun_ref => {
    if (gun_ref.current == null) {
      gun_ref.current = Gun({
        peers: ['https://gun-manhattan.herokuapp.com/gun'],
        store: asyncStore({AsyncStorage}),
        localStorage: false,
      });
    }
    return gun_ref.current;
  })(useRef(null));

  const user = db.user();
  const [userInfo, setUserInfo] = useState(null);
  const [count, setCount] = useState(0);
  const [retrieved, setRetrieved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const signIn = async (username, password) => {
    return new Promise((resolve, reject) => {
      user.auth(username, password, ret => {
        if (ret.err) {
          resolve(false);
        } else {
          //   console.log('ret', ret);
          resolve(true);
        }
      });
    });
  };

  const logOut = () => {
    user.leave(); // log the user out from Gun
    setUserInfo(null); // clear user info in app state
  };

  db.on('auth', async () => {
    const alias = user._.put.alias;
    console.log('alias', alias);
    console.log('usersea', user._.sea);
    setUserInfo({
      username: alias || '',
      usersea: user._.sea,
    });

    await user
      .get('securimed')
      .get('scmroom')
      .get('hr')
      .then(async data => {
        if (!data) {
          console.log('no keypair');
          setCount(count + 1);
        } else {
          const keypair = await Gun.SEA.decrypt(data, user._.sea);
          console.log('keypair', keypair);
          setUserInfo({
            username: alias || '',
            usersea: user._.sea,
            hrkeypair: keypair,
          });
          setRetrieved(true);
        }
      });
  });

  useEffect(() => {
    const getKeyPair = async () => {
      await user
        .get('securimed')
        .get('scmroom')
        .get('hr')
        .then(async data => {
          if (!data) {
            console.log('no keypair');
            setCount(count + 1);
          } else {
            const keypair = await Gun.SEA.decrypt(data, user._.sea);
            console.log('keypair', keypair);
            setUserInfo({
              username: alias || '',
              usersea: user._.sea,
              hrkeypair: keypair,
            });
            setRetrieved(true);
          }
        });
    };
    if (count !== 0 && !retrieved) {
      getKeyPair();
    }
  }, [count, retrieved, user]);

  //   const signUp = async (username, password) => {
  //     return new Promise((resolve, reject) => {
  //       user.create(username, password, ret => {
  //         // console.log('ret', ret);
  //         if (ret.err) {
  //           resolve(false);
  //         } else {
  //           resolve(true);
  //         }
  //       });
  //     });
  //   };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        logOut,
        userInfo,
        user,
        db,
        darkMode,
        toggleDarkMode,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
