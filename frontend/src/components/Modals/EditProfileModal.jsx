import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		innOrOgrnip: "",
		companyName: "",
		bankAccount: "",
		bic: "",
		email: "",
		phoneNumber: "",
		firstName: "",
		lastName: "",
		newPassword: "",
		currentPassword: "",
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				innOrOgrnip: authUser.innOrOgrnip,
				companyName: authUser.companyName,
				email: authUser.email,
				bankAccount: authUser.bankAccount,
				bic: authUser.bic,
				phoneNumber: authUser.phoneNumber,
				firstName: authUser.firstName,
				lastName: authUser.lastName,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
				<button
					className='bg-custom-gradient font-rfBold text-white rounded-500 px-12 py-2.5'
					onClick={() => document.getElementById("edit_profile_modal").showModal()}
					title='Для изменения текущих данных, а также пароля'
				>
					Изменить данные
				</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Обновить профиль</h3>
					<h4 className="my-4">Если не хотите что-то менять, оставьте поле пустым</h4>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
							document.getElementById("edit_profile_modal").close();
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Имя'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.firstName}
								name='firstName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Фамилия'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.lastName}
								name='lastName'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<input
								type="text"
								placeholder='Расчетный счет'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bankAccount}
								name='bankAccount'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Текущий пароль'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='Новый пароль'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='БИК'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bic}
								name='bic'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Номер телефона'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.phoneNumber}
								name='phoneNumber'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='ИНН/ОГРНИП'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.innOrOgrnip}
								name='innOrOgrnip'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Название компании'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.companyName}
								name='companyName'
								onChange={handleInputChange}
							/>
						</div>
						<div className="btn-universal mx-auto mt-10">
							<button className='btn-universal-btn font-rfBold'>
								{isUpdatingProfile ? "Обновление..." : "Обновить"}
							</button>
						</div>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>Закрыть</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;
