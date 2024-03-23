import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuth } from '../../context/auth-context';
import { fetchLikeListData, fetchLikeMusic } from '../../api/like';

export const useLike = (): {
  isLoading: boolean;
  error: Error | unknown;
  isLiked: (id: number) => boolean;
  toggleLike: (id: number) => void;
} => {
  const { user } = useAuth();
  const uid = user?.userId;

  const {
    data: likeList,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['likeList', uid],
    () => fetchLikeListData(uid as number).then((response) => response.data.ids),
    {
      enabled: uid !== undefined, // 只有在 uid 存在时才执行 useQuery
    },
  );

  const likeMutation = useMutation(
    ({ id, like }: { id: number; like: boolean }) => fetchLikeMusic(id, like),
    {
      onSuccess: () => {
        // 当 mutation 成功时，手动触发喜欢列表数据的重新查询
        refetch();
      },
    },
  );

  const isLiked = (id: number) => {
    return likeList?.includes(id) ?? false;
  };

  const toggleLike = (id: number) => {
    const like = !likeList?.includes(id) ?? false;
    // 执行添加或删除喜欢音乐的操作
    likeMutation.mutateAsync({ id, like });
  };

  return {
    isLoading,
    error,
    isLiked,
    toggleLike,
  };
};
