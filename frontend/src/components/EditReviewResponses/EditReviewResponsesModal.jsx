import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditReviewResponsesModal = ({ responses, setResponses, refetchReviews }) => {
  const [modalResponses, setModalResponses] = useState(responses);

  const handleInputChange = (event, rating) => {
    setModalResponses({ ...modalResponses, [rating]: event.target.value });
  };
  const queryClient = useQueryClient();
  const { mutate: saveResponses } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post('/api/reviews/save-responses', {
          responses: modalResponses,
        });
        return res.data;
      } catch (error) {
        console.log(error);
        throw new Error('Ошибка сохранения ответов');
      }
    },
    onSuccess: () => {
      setResponses(modalResponses);
      toast.success('Ответы успешно сохранены!');

      refetchReviews();
      document.getElementById('edit-responses-modal-close').click();
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    saveResponses();
  };

  return (
    <div>
      <input type="checkbox" id="edit-responses-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Редактировать ответы</h3>
          <div className="py-4">
            {[
              { star: 1, key: 'oneStar' },
              { star: 2, key: 'twoStars' },
              { star: 3, key: 'threeStars' },
              { star: 4, key: 'fourStars' },
              { star: 5, key: 'fiveStars' },
            ].map(({ star, key }) => (
              <div key={star} className="mb-4">
                <label>{star} звездный ответ</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={`Ответ на ${star} звездный отзыв`}
                  value={modalResponses[key] || ''} 
                  onChange={(e) => handleInputChange(e, key)} 
                />
              </div>
            ))}
          </div>
          <div className="modal-action">
            <label htmlFor="edit-responses-modal" id="edit-responses-modal-close" className="btn">Закрыть</label>
            <button className="btn btn-primary" onClick={handleSave}>Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReviewResponsesModal;
