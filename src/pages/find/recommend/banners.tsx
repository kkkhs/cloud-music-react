import React, { useEffect, useState } from 'react';
import { fetchBannerData } from '../../../api/banner';
import { Image, SpinLoading, Swiper } from 'antd-mobile';
import { Banner } from '../../../types/banner';
import { MyLoading } from '../../../components/my-loading';

export const Banners = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBannerData(2)
      .then((response) => {
        setBanners(response.data.banners.slice(0, 9));
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
      });
  }, []); // 仅在组件挂载时执行一次

  return (
    <div>
      {banners.length !== 0 ? (
        <Swiper className={'rounded-2xl'} loop autoplay>
          {banners.map((banner: Banner, index) => {
            return (
              <Swiper.Item className={'rounded-2xl'} key={index}>
                <a href={banner.url}>
                  <Image
                    placeholder={<MyLoading />}
                    alt={'banner'}
                    className={'rounded-2xl'}
                    src={banner.pic}
                  />
                </a>
              </Swiper.Item>
            );
          })}
        </Swiper>
      ) : (
        <MyLoading />
      )}
    </div>
  );
};
