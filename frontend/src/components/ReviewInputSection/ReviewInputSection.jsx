import React from "react";
import OneStar from "../../components/RatingStars/OneStar";

const ReviewInputSection = ({ responses, handleInputChange }) => {
    return (
        <div className="flex flex-col gap-2 max-w-96 w-full">
            {[...Array(5)].map((_, index) => {
                const starCount = index + 1;
                return (
                    <div className="w-full flex items-center" key={starCount}>
                        <div className="h-full flex items-center justify-center">
                            {starCount}<OneStar />
                        </div>
                        <input
                            type="text"
                            className="border p-2 mr-2 w-full"
                            placeholder="Текст отзыва"
                            value={responses[`oneStar`]}
                            onChange={(e) => handleInputChange(e, `oneStar`)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ReviewInputSection;
