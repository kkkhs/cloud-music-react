import axios from './base';

// 游客登陆
export const fetchAnonimousData = () => {
  return axios.get('register/anonimous');
};

// 获取验证码
export const fetchCaptchaData = (phone: string) => {
  return axios.get('captcha/sent', { params: { phone } });
};

// 登陆
export const fetchLoginData = (phone: string, captcha: string) => {
  return axios.get('login/cellphone', { params: { phone, captcha } });
};

// 验证码校验
export const fetchCaptchaVertifyData = (phone: string, captcha: string) => {
  return axios.get('captcha/verify', { params: { phone, captcha } });
};

//  登出
export const fetchLogoutData = () => {
  return axios.get('logout');
};
