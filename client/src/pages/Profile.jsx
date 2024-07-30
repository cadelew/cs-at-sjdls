import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});

  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <a
          onClick={() => fileRef.current.click()}
          className='relative inline-flex self-center group'
        >
          <img
            src={currentUser.profilePicture}
            alt='profile picture'
            className='h-24 w-24 self-center rounded-full object-cover mt-2'
          />
          <img
            src="data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg' aria-labelledby='title' aria-describedby='desc' role='img' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EEdit Button%3C/title%3E%3Cdesc%3EA line styled icon from Orion Icon Library.%3C/desc%3E%3Cpath stroke-width='2' stroke-miterlimit='10' stroke='%23202020' fill='none' d='M44.889 26.138l1.882-1.883c1.941-1.94 1.439-4.584-.5-6.524s-4.584-2.442-6.525-.5l-1.882 1.883' data-name='layer2' stroke-linejoin='round' stroke-linecap='round'%3E%3C/path%3E%3Cpath d='M41.814 29.212l3.075-3.074-7.027-7.027-3.074 3.074M18.164 38.809l7.026 7.026' stroke-width='2' stroke-miterlimit='10' stroke='%23202020' fill='none' data-name='layer2' stroke-linejoin='round' stroke-linecap='round'%3E%3C/path%3E%3Ccircle stroke-width='2' stroke-miterlimit='10' stroke='%23202020' fill='none' r='30' cy='32' cx='32' data-name='layer1' stroke-linejoin='round' stroke-linecap='round'%3E%3C/circle%3E%3Cpath d='M25.19 45.835l16.624-16.623-7.026-7.027-16.624 16.624L16 47.999l9.19-2.164z' stroke-width='2' stroke-miterlimit='10' stroke='%23202020' fill='none' data-name='layer2' stroke-linejoin='round' stroke-linecap='round'%3E%3C/path%3E%3C/svg%3E"
            alt='Edit Button'
            className='h-8 w-8 absolute bottom-0 right-0 bg-slate-100 rounded-full object-cover border-none group-hover:bg-slate-500'
          />
        </a>

        <p className='text-sm self-center text-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error Uploading Image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>
              {`Uploading: ${imagePercent}%`}
            </span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700 '>
              Image Uploaded Successfully
              <br />
              Press the Update Button Below to Save Changes
            </span>
          ) : (
            ''
          )}
        </p>

        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3'
        ></input>

        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
        ></input>

        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
        ></input>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85'>
          Update
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}
