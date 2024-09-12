import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import useUpdateUserProfile from '../../hooks/useUpdateUserProfile';
import EditProfileModal from '../Modals/EditProfileModal';
import UserCreatedAt from '../DateTimeFormat/DateTImeFormat';



const Account = ({ authUser }) => {
  const url = "http://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
  const token = "95be70136a908e879f3aaaf0082eb215a245ae70";

  const [formData, setFormData] = useState({
    innOrOgrnip: "",
    companyName: "",
    bankAccount: "",
    bic: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: ""
  });

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


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const verifyInn = async () => {

    try {
      const res = await axios.post(url, { query: `${formData.innOrOgrnip}` }, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${token}`,
        }
      });
      const arrayLength = res.data.suggestions.length;
      return arrayLength > 0 ? true : false;
    } catch (error) {
      console.log("Error verifying INN/OGRNIP:", error);
    }
  };

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();


  const submitData = async () => {
    if (formData.innOrOgrnip?.length == 10) {
      const isVerified = await verifyInn()
      if (!isVerified) {
        toast.error("Введите корректный ИНН/ОГРНИП")
        return;
      }
    }
    updateProfile(formData)
  }

  return (
    <>
      <div className='flex min-h-96 gap-5'>
        <div className='w-5/6 flex items-start justify-between gap-3 mt-20'>
          <div className='w-full flex flex-col justify-between h-full'>
            <label className="input input-bordered flex items-center gap-2">
              ИНН/ОГРНИП
              <input
                type="text"
                className="grow"
                placeholder={formData.innOrOgrnip ? formData.innOrOgrnip : 'Ввести'}
                name='innOrOgrnip'
                disabled={authUser.innOrOgrnip}
                value={formData.innOrOgrnip || ''}
                onChange={handleInputChange} />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Полное наименование
              <input
                value={formData.companyName || ''}
                name='companyName'
                type="text"
                className="grow"
                title='Введите полное наименование компании'
                placeholder={formData.companyName ? formData.companyName : 'Ввести'}
                disabled={authUser.companyName}
                onChange={handleInputChange} />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Расчетный счет
              <input
                value={formData.bankAccount || ''}
                name='bankAccount'
                type="text"
                className="grow"
                placeholder={formData.bankAccount ? formData.bankAccount : 'Ввести'}
                disabled={authUser.bankAccount} onChange={handleInputChange} />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              БИК
              <input
                value={formData.bic || ''}
                name='bic'
                type="text"
                className="grow"
                placeholder={formData.bic ? formData.bic : 'Ввести'}
                disabled={authUser.bic}
                onChange={handleInputChange} />
            </label>
          </div>
          <div className='w-full flex flex-col justify-between h-full'>
            <label className="input input-bordered flex items-center gap-2">
              Email
              <input type="text" className="grow" placeholder={formData.email} disabled={formData.email} />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Номер телефона
              <input type="text" className="grow" placeholder={formData.phoneNumber} disabled={formData.phoneNumber} />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Имя
              <input type="text" className="grow" placeholder={formData.firstName} disabled={formData.firstName} />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Фамилия
              <input type="text" className="grow" placeholder={formData.lastName} disabled={formData.lastName} />
            </label>
          </div>
        </div>
        <div className='flex flex-col items-start mt-20 justify-between'>
          <div>
            <p className='text-2xl text-start'>Нам хотелось бы знать немого больше о <strong>Вас</strong>.</p>
            <p className='text-2xl text-start'>Все введенные <strong>Вами</strong>  данные хранятся в надежно защищенной базе данных.</p>
            <p className='text-2xl text-start'>Мы не передаем <strong>Ваши</strong> данные третьим лицам</p>
          </div>
          <div className='flex gap-2'>
            <button className='btn btn-primary btn-outline' onClick={submitData} title='Для добавления новых данных'>
              Сохранить данные
            </button>
            <EditProfileModal />
          </div>
        </div>

      </div>
      <div className='max-w-xs h-32 border border-black flex items-start flex-col p-6 gap-5 mt-10'>
        <h2 className='black font-bold text-lg'>Оферта</h2> 
        <div className='flex items-start text-sm'>
          <UserCreatedAt authUser={authUser}/>
        </div>
      </div>
    </>
  )
}

export default Account