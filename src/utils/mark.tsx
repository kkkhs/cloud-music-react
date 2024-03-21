// 关键字强调色
import React from 'react';

export const Mark = ({ name, keyWord }: { name: string; keyWord: string }) => {
  if (!keyWord) {
    return <>{name}</>;
  }
  const arr = name.split(keyWord);
  return (
    <>
      {arr.map((str, index) => (
        <span key={index}>
          {str}
          {index === arr.length - 1 ? null : <span style={{ color: '#257AFD' }}>{keyWord}</span>}
        </span>
      ))}
    </>
  );
};
