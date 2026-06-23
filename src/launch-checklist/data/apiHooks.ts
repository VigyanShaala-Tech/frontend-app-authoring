import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLaunchChecklist, updateLaunchChecklistItem } from './api';

export const launchChecklistQueryKeys = {
  all: (courseId: string) => ['launchChecklist', courseId],
};

export const useLaunchChecklist = (courseId: string) => (
  useQuery({
    queryKey: launchChecklistQueryKeys.all(courseId),
    queryFn: () => getLaunchChecklist(courseId),
  })
);

export const useUpdateLaunchChecklistItem = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, isCompleted }: { itemId: string, isCompleted: boolean }) => (
      updateLaunchChecklistItem(courseId, itemId, isCompleted)
    ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: launchChecklistQueryKeys.all(courseId) });
    },
  });
};
