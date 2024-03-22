import { useState } from 'react';
import { NavBar, Toast } from 'antd-mobile';
import {
  fetchAnonimousData,
  fetchCaptchaData,
  fetchCaptchaVertifyData,
  fetchLoginData,
} from '../../api/login';
import { useNavigate } from 'react-router-dom';
import { AppleFilled, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/auth-context';

export const LoginPage = () => {
  const phoneNumberPattern = /^1[3456789]\d{9}$/;
  const [phone, setPhone] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('获取验证码');
  const [countdown, setCountDown] = useState(60);
  const history = useNavigate();
  const { login: ContextLogin } = useAuth();

  // 正则匹配是否为大陆手机号
  function isPhoneNumber(phoneNumber: string) {
    return phoneNumberPattern.test(phoneNumber);
  }

  // 发送验证码
  const sentCaptcha = () => {
    if (!isPhoneNumber(phone)) {
      Toast.show({
        content: '请输入正确的手机号',
        position: 'top',
      });
      return;
    }
    fetchCaptchaData(phone).then((res) => {
      //发送验证码
      if (res.data.code === 200) {
        Toast.show({
          content: '验证码已发送',
          position: 'top',
        });
      }
    });

    setDisabled(true);
    setButtonText(`${countdown}`);

    let timer = setInterval(() => {
      setCountDown((prevCountdown) => {
        const newCountdown = prevCountdown - 1;
        setButtonText(`${newCountdown}`);
        if (newCountdown === 0) {
          clearInterval(timer);

          setDisabled(false);
          setButtonText('获取验证码');
          return 60;
        }
        return newCountdown;
      }); // 使用函数式更新
    }, 1000);
  };

  // 登陆(需要先验证)
  const login = () => {
    if (!isPhoneNumber(phone)) {
      Toast.show({
        content: '请输入正确的手机号',
        position: 'top',
      });
      return;
    }
    fetchCaptchaVertifyData(phone, captcha)
      .then((res) => {
        if (res.data.code === 200) {
          // 验证码正确
          fetchLoginData(phone, captcha)
            .then((res) => {
              if (res.data.code === 200) {
                Toast.show({
                  content: '登陆成功',
                  position: 'top',
                });
                ContextLogin();
                history('/find');
              }
            })
            .catch((err) => {
              console.log(err);
              Toast.show({
                content: err.response.data.message,
                position: 'top',
              });
            });
        } else {
          Toast.show({
            content: res.data.message,
            position: 'top',
          });
        }
      })
      .catch((_) => {
        Toast.show({
          content: '验证码错误',
          position: 'top',
        });
      });
  };

  // 游客登陆
  const anonimousLogin = () => {
    fetchAnonimousData().then(() => {
      ContextLogin();
      history('/find');
    });
  };

  const back = () => {
    history(-1);
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-red-200 to-red-300 via-white z-10">
      <NavBar onBack={back} className={'bg-white rounded-b-xl bg-opacity-80'}>
        登陆
      </NavBar>
      <AppleFilled className={'text-8xl text-white w-full mx-auto mt-20 opacity-80'} />
      <div className="login-container flex flex-col w-4/5 absolute top-1/3 left-1/2 -translate-x-1/2 mt-10">
        <form
          className=" flex flex-col justify-center items-center w-full mb-2"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <div className="form-group flex items-center mb-4 bg-white h-12 rounded-lg w-full border-solid border-[1px] border-red-200">
            <PhoneOutlined className={'text-xl flex items-center mx-3 opacity-60'} />
            <input
              className="outline-none text-lg "
              type="text"
              id="phone"
              value={phone}
              placeholder="输入手机号"
              required
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div className="form-group h-12 w-full flex justify-between">
            <input
              className=" bg-white border-solid border-[1px] border-red-200 min-w-0 text-lg outline-none h-full rounded-lg mr-2 pl-3"
              type="text"
              id="captcha"
              value={captcha}
              placeholder="输入验证码"
              required
              onChange={(event) => setCaptcha(event.target.value)}
            />
            <button
              disabled={disabled}
              className={`rounded-lg text-base bg-red-500 text-white h-full w-40 ${disabled ? 'opacity-40 text-xl' : ''}`}
              onClick={sentCaptcha}
            >
              {buttonText}
            </button>
          </div>
          <button className="rounded-2xl bg-red-500 w-2/3 h-10 text-white mt-5" type="submit">
            <span className="text-white text-base">登陆</span>
          </button>
        </form>

        <button className=" text-opacity-80 text-black" onClick={anonimousLogin}>
          游客登入
        </button>
      </div>
    </div>
  );
};
