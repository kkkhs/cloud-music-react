// 歌手作者格式化

export function formatArtistName(
  artists: {
    id: string;
    name: string;
  }[],
) {
  let result = '';
  for (let i = 0; i < artists.length; i++) {
    const name = artists[i].name;
    if (i === 0) {
      result += name;
    } else {
      result += '/' + name;
    }
  }
  return result;
}
