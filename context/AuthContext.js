import React, {useRef, createContext, useContext, useState} from 'react';

import 'react-native-get-random-values';
import 'gun/lib/mobile';
import 'gun/lib/mobile';
import Gun from 'gun';
import 'gun/sea';
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

  const logOut = () => {};

  db.on('auth', () => {
    const alias = user._.put.alias;

    setUserInfo({
      username: alias || '',
      usersea: user._.sea,
    });
  });

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
    <AuthContext.Provider value={{signIn, logOut, userInfo, user, db}}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
