import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useAuth } from '../../context/auth-context';
import { fetchLikeListData, fetchLikeMusic } from '../../api/like';

export const useLike = (): {
  isLoading: boolean;
  error: Error | unknown;
  isLiked: (id: number) => boolean;
  toggleLike: (id: number, like: boolean) => void;
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

  const toggleLike = async (id: number, like: boolean) => {
    try {
      // 更新 UI，乐观地添加或移除音乐
      if (like) {
        // 如果音乐已经在喜欢列表中，则不再重复添加
        if (!likeList?.includes(id)) {
          likeList.push(id);
        }
      } else {
        // 如果音乐不在喜欢列表中，则不需要更新
        const index = likeList?.indexOf(id);
        if (index !== undefined && index !== -1) {
          likeList.splice(index, 1);
        }
      }

      // 执行添加或删除喜欢音乐的操作
      await likeMutation.mutateAsync({ id, like });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return {
    isLoading,
    error,
    isLiked,
    toggleLike,
  };
};
