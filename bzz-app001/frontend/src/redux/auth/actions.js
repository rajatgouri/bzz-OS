import * as actionTypes from "./types";
import * as authService from "@/auth";
import storePersist from "@/redux/storePersist";
import history from "@/utils/history";
import { request } from "@/request";
import {getDay} from '@/utils/helpers';
import socket from "@/socket";

export const login = (loginAdminData) => async (dispatch) => {

  dispatch({
    type: actionTypes.LOADING_REQUEST,
    payload: { loading: true },
  });
  const data = await authService.login(loginAdminData);

  if (data.success === true) {

    const authValue = {
      current: data.result.admin,
      loading: false,
      isLoggedIn: true,
    };

    localStorage.setItem('SSO', data.result.token)
    socket.emit('setUserID', data.result.admin.EMPID, data.result.admin.name)

    localStorage.setItem('loggedDay', getDay())

    tracker('/login', 'Login', data.result.admin.name, "Login", data.result.admin.EMPID)
    storePersist.set("auth", authValue);
    dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      payload: data.result.admin,
    });

    history.push("/");
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
      payload: data,
    });
  }
};


export const ssoLogin = (loginAdminData) => async (dispatch) => {

  dispatch({
    type: actionTypes.LOADING_REQUEST,
    payload: { loading: true },
  });
  const data = await authService.ssoLogin(loginAdminData);

  if (data.success === true) {

    const authValue = {
      current: data.result.admin,
      loading: false,
      isLoggedIn: true,
    };

    localStorage.setItem('SSO', data.result.token)
    socket.emit('setUserID', data.result.admin.EMPID, data.result.admin.name)

    localStorage.setItem('loggedDay', getDay())

    tracker('/login', 'Login', data.result.admin.name, "Login",data.result.admin.EMPID )
    storePersist.set("auth", authValue);
    dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      payload: data.result.admin,
    });

    history.push("/");
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
      payload: data,
    });
  }
};


export const logout = () => async (dispatch) => {
  
  let user = JSON.parse(localStorage.getItem('auth'))
  socket.emit('disconnected', user.current.EMPID)

  tracker('/logout', 'Logout', user.current.name, "Logout", user.current.EMPID)
  window.localStorage.removeItem('auth');
  window.localStorage.removeItem('x-auth-token');
  authService.logout();
  dispatch({
    type: actionTypes.LOGOUT_SUCCESS,
  });
  // history.push("/login");
  window.location.href = '/login'

};

const tracker = async (Url, Page, UserName, Status = "Visit", EMPID) => {
  await request.create("/pageLogger", {Url, Page, Status, UserName, EMPID});
} 