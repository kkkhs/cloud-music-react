import { MenuOutlined, PoweroffOutlined, RightOutlined, SwapOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Button, List, NavBar, Popup, Toast } from 'antd-mobile';
import React, { useState } from 'react';
import { fetchLogoutData } from '../api/login';
import { useAuth } from '../context/auth-context';
import { SetOutline } from 'antd-mobile-icons';

export const TopNavBar = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    fetchLogoutData().then((res) => {
      if (res.data.code === 200) {
        Toast.show({
          content: '已登出',
          position: 'top',
        });
        window.location.reload();
      }
    });
  };

  return (
    <>
      <NavBar
        className={'mt-1'}
        backArrow={
          <MenuOutlined
            onClick={() => {
              setVisible(true);
            }}
            className={'flex items-center'}
          />
        }
      >
        <div>{children ? children : null}</div>
      </NavBar>
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        position="left"
        bodyStyle={{ width: '80vw' }}
      >
        <div className={'h-full w-full bg-slate-100'}>
          <div className={'h-full w-full px-3 pt-2'}>
            {user !== undefined ? (
              <div className={'flex items-center mb-5'}>
                <img className={'rounded-full w-10 h-10 mr-2'} src={user.avatarUrl} />
                <div className={'text-xl mr-2'}>{user.nickname}</div>
              </div>
            ) : (
              <div className={'flex items-center mb-5'}>
                <img
                  className={'rounded-full w-10 h-10 mr-2'}
                  src={'http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg'}
                />
                <div className={'text-xl mr-2'}>游客</div>
              </div>
            )}
            <List>
              <List.Item
                prefix={<SwapOutlined className={'flex items-center'} />}
                onClick={() => {
                  navigate('/login');
                }}
              >
                切换账号
              </List.Item>
              <List.Item
                prefix={<PoweroffOutlined className={'flex items-center text-red-500'} />}
                onClick={logout}
              >
                退出登录
              </List.Item>
            </List>
          </div>
        </div>
      </Popup>
    </>
  );
};
